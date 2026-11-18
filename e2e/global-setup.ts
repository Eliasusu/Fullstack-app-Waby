/**
 * Levanta el entorno de los smoke tests y devuelve cómo bajarlo (teardown):
 *   1. MySQL 8 efímero con testcontainers (datos en tmpfs, se descarta al terminar).
 *   2. Seed de demo contra esa base.
 *   3. API compilada (`api/dist`, la deja `pnpm build:api`) en un puerto libre.
 *   4. Client: `vite build` apuntando a esa API y `vite preview` en otro puerto libre.
 * La configuración va por variables de entorno, que tienen prioridad sobre el `.env` de la raíz
 * (`process.loadEnvFile` no pisa las que ya existen). Así no se toca la base de desarrollo.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MySqlContainer } from '@testcontainers/mysql';
import { DEMO } from './support/demo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const apiDir = resolve(root, 'api');
const clientDir = resolve(root, 'client');
const clientOutDir = resolve(root, 'e2e', '.client-dist');
/** Node 22 de las devDependencies de la API: con Node 26 `jsonwebtoken` no carga (ver AGENTS.md). */
const apiNode = resolve(apiDir, 'node_modules', '.bin', 'node');
const vite = resolve(clientDir, 'node_modules', '.bin', 'vite');

const log = (message: string) => console.log(`[e2e] ${message}`);

function freePort(): Promise<number> {
    return new Promise((resolvePort, reject) => {
        const server = createServer();
        server.once('error', reject);
        server.listen(0, () => {
            const { port } = server.address() as { port: number };
            server.close(() => resolvePort(port));
        });
    });
}

/** Corre un proceso y espera a que termine bien; si falla, muestra su salida. */
function run(command: string, args: string[], options: { cwd: string; env: NodeJS.ProcessEnv }): Promise<void> {
    return new Promise((done, reject) => {
        const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
        let output = '';
        child.stdout.on('data', (chunk) => (output += chunk));
        child.stderr.on('data', (chunk) => (output += chunk));
        child.on('error', reject);
        child.on('exit', (code) =>
            code === 0 ? done() : reject(new Error(`${command} ${args.join(' ')} terminó con ${code}:\n${output}`)),
        );
    });
}

/** Arranca un proceso de larga vida. Guarda su salida para mostrarla si no llega a estar listo. */
function start(command: string, args: string[], options: { cwd: string; env: NodeJS.ProcessEnv }) {
    const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'] });
    const output: string[] = [];
    child.stdout?.on('data', (chunk) => output.push(String(chunk)));
    child.stderr?.on('data', (chunk) => output.push(String(chunk)));
    return { child, output };
}

async function waitFor(url: string, isReady: (status: number) => boolean, proc: ReturnType<typeof start>, name: string) {
    const deadline = Date.now() + 60_000;
    while (Date.now() < deadline) {
        if (proc.child.exitCode !== null) break;
        try {
            if (isReady((await fetch(url)).status)) return;
        } catch {
            // Todavía no escucha.
        }
        await new Promise((r) => setTimeout(r, 250));
    }
    throw new Error(`${name} no arrancó (${url}). Salida:\n${proc.output.join('').slice(-3000)}`);
}

function stop(child: ChildProcess) {
    if (child.exitCode === null) child.kill('SIGTERM');
}

export default async function globalSetup() {
    for (const [path, hint] of [
        [resolve(apiDir, 'dist', 'index.js'), 'Corré `pnpm test:e2e`, que compila la API antes.'],
        [apiNode, 'Falta el Node 22 de la API: corré `pnpm install`.'],
    ]) {
        if (!existsSync(path)) throw new Error(`No existe ${path}. ${hint}`);
    }

    const startedAt = Date.now();
    log('MySQL efímero...');
    const db = await new MySqlContainer('mysql:8.0')
        .withDatabase('waby_e2e')
        .withUsername('waby')
        .withUserPassword('waby-e2e')
        .withTmpFs({ '/var/lib/mysql': 'rw' })
        .start();

    const [apiPort, clientPort] = [await freePort(), await freePort()];
    const apiUrl = `http://localhost:${apiPort}`;
    const clientUrl = `http://localhost:${clientPort}`;

    const apiEnv: NodeJS.ProcessEnv = {
        ...process.env,
        // `test`: sin logs de consultas ni `updateSchema`; la base sale de DB_TEST_NAME.
        NODE_ENV: 'test',
        PORT: String(apiPort),
        DB_HOST: db.getHost(),
        DB_PORT: String(db.getPort()),
        DB_NAME: db.getDatabase(),
        DB_TEST_NAME: db.getDatabase(),
        DB_USER: db.getUsername(),
        DB_PASSWORD: db.getUserPassword(),
        JWT_SECRET: randomBytes(48).toString('base64url'),
        CORS_ORIGINS: clientUrl,
        SEED_ADMIN_USERNAME: 'admin',
        SEED_ADMIN_EMAIL: 'admin@waby.local',
        SEED_ADMIN_PASSWORD: 'admin-e2e-password',
        SEED_DEMO_USERNAME: DEMO.username,
        SEED_DEMO_EMAIL: 'demo@waby.local',
        SEED_DEMO_PASSWORD: DEMO.password,
    };

    log('Seed y build del client...');
    await Promise.all([
        run(apiNode, ['dist/scripts/seed.js'], { cwd: apiDir, env: apiEnv }),
        run(vite, ['build', '--outDir', clientOutDir, '--emptyOutDir', '--logLevel', 'warn'], {
            cwd: clientDir,
            env: { ...process.env, VITE_API_URL: `${apiUrl}/api/v1/` },
        }),
    ]);

    log('API y client...');
    const api = start(apiNode, ['dist/index.js'], { cwd: apiDir, env: apiEnv });
    const client = start(vite, ['preview', '--outDir', clientOutDir, '--port', String(clientPort), '--strictPort'], {
        cwd: clientDir,
        env: process.env,
    });

    const teardown = async () => {
        stop(api.child);
        stop(client.child);
        await db.stop();
    };

    try {
        await Promise.all([
            waitFor(`${apiUrl}/api/v1/users/me`, (status) => status === 401, api, 'La API'),
            waitFor(clientUrl, (status) => status === 200, client, 'El client'),
        ]);
    } catch (error) {
        await teardown();
        throw error;
    }

    // Los workers heredan estas variables (ver support/test.ts).
    process.env.E2E_BASE_URL = clientUrl;
    process.env.E2E_API_URL = apiUrl;
    log(`Listo en ${((Date.now() - startedAt) / 1000).toFixed(1)} s: client ${clientUrl}, API ${apiUrl}`);

    return teardown;
}
