/**
 * Helpers de los tests de integración. Cada archivo de test:
 *   const ctx = await setup();   // base waby_test limpia + API en un puerto libre
 *   after(() => ctx.close());
 * Los tests corren de a un archivo por vez (--test-concurrency=1) porque comparten la base.
 */
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import assert from 'node:assert/strict';
import type { CreateExerciseInput, RegisterInput } from '@waby/shared';

process.env.NODE_ENV = 'test';

const { createApp } = await import('../app.js');
const { orm } = await import('../shared/db/orm.js');
const { User } = await import('../users/user.entity.js');
const { TrainingMethod } = await import('../trainingMethods/trainingMethod.entity.js');
const { MuscleGroup } = await import('../muscleGroups/muscleGroup.entity.js');
const { hashPassword } = await import('../auth/password.js');

export type ApiResponse<T = any> = { status: number; body: T; setCookie: string | null };

/** Cliente HTTP con sesión propia: guarda la cookie que deja login/registro. */
export class ApiClient {
    cookie: string | null = null;
    constructor(private baseUrl: string) {}

    async request<T = any>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
        const headers: Record<string, string> = {};
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        if (this.cookie) headers.Cookie = this.cookie;
        const res = await fetch(`${this.baseUrl}/api/v1${path}`, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
        const setCookie = res.headers.get('set-cookie');
        if (setCookie) {
            const value = setCookie.split(';')[0];
            this.cookie = value.endsWith('=') ? null : value;
        }
        const text = await res.text();
        return { status: res.status, body: text ? JSON.parse(text) : null, setCookie };
    }

    get<T = any>(path: string) { return this.request<T>('GET', path); }
    post<T = any>(path: string, body?: unknown) { return this.request<T>('POST', path, body); }
    patch<T = any>(path: string, body?: unknown) { return this.request<T>('PATCH', path, body); }
    delete<T = any>(path: string) { return this.request<T>('DELETE', path); }
}

export type Catalog = { calisthenicsId: number; gymId: number; backId: number; chestId: number; coreId: number };

export type TestContext = {
    baseUrl: string;
    catalog: Catalog;
    /** Cliente sin sesión. */
    anon: () => ApiClient;
    /** Registra un usuario nuevo por la API y devuelve su cliente con sesión. */
    user: (username: string) => Promise<ApiClient>;
    /** Crea un admin directo en la base (el registro no puede) y devuelve su cliente con sesión. */
    admin: (username?: string) => Promise<ApiClient>;
    close: () => Promise<void>;
};

export async function setup(): Promise<TestContext> {
    await orm.getSchemaGenerator().refreshDatabase();
    const catalog = await seedCatalog();

    const server: Server = await new Promise((resolve) => {
        const s = createApp().listen(0, () => resolve(s));
    });
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;

    return {
        baseUrl,
        catalog,
        anon: () => new ApiClient(baseUrl),
        user: async (username) => {
            const client = new ApiClient(baseUrl);
            const res = await client.post('/auth/register', registerData(username, catalog));
            assert.equal(res.status, 201, `No se pudo registrar ${username}: ${JSON.stringify(res.body)}`);
            return client;
        },
        admin: async (username = 'admin') => {
            const em = orm.em.fork();
            const admin = em.create(User, {
                username,
                email: `${username}@waby.test`,
                password: await hashPassword('admin-password'),
                name: 'Admin',
                birthdate: '1990-01-01',
                bodyWeightKg: 80,
                heightCm: 180,
                role: 'ADMIN',
            });
            await em.persistAndFlush(admin);
            const client = new ApiClient(baseUrl);
            const res = await client.post('/auth/login', { username, password: 'admin-password' });
            assert.equal(res.status, 200, `No se pudo loguear el admin: ${JSON.stringify(res.body)}`);
            return client;
        },
        close: async () => {
            await new Promise<void>((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
            await orm.close(true);
        },
    };
}

async function seedCatalog(): Promise<Catalog> {
    const em = orm.em.fork();
    const calisthenics = em.create(TrainingMethod, { name: 'Calistenia', description: 'Entrenamiento con el peso corporal' });
    const gym = em.create(TrainingMethod, { name: 'Gimnasio', description: 'Entrenamiento con pesas y máquinas' });
    const back = em.create(MuscleGroup, { name: 'Espalda', description: 'Dorsales, trapecio y lumbares' });
    const chest = em.create(MuscleGroup, { name: 'Pecho', description: 'Pectorales' });
    const core = em.create(MuscleGroup, { name: 'Core', description: 'Abdominales y oblicuos' });
    await em.flush();
    return { calisthenicsId: calisthenics.id, gymId: gym.id, backId: back.id, chestId: chest.id, coreId: core.id };
}

export function registerData(username: string, catalog: Catalog): RegisterInput {
    return {
        username,
        email: `${username}@waby.test`,
        password: 'una-contraseña-segura',
        name: `Usuario ${username}`,
        birthdate: '1995-05-20',
        bodyWeightKg: 72.5,
        heightCm: 175,
        trainingMethodIds: [catalog.calisthenicsId],
    };
}

export function exerciseData(catalog: Catalog, overrides: Partial<CreateExerciseInput> = {}): CreateExerciseInput {
    return {
        name: 'Dominadas',
        description: 'Colgado de la barra, subir hasta pasar el mentón',
        trainingMethodId: catalog.calisthenicsId,
        muscleGroupIds: [catalog.backId],
        difficulty: 'MEDIUM',
        movementPattern: 'PULL',
        metricType: 'REPS',
        ...overrides,
    };
}

/** Crea un Ejercicio y devuelve su id. */
export async function createExercise(client: ApiClient, catalog: Catalog, overrides: Partial<CreateExerciseInput> = {}) {
    const res = await client.post('/exercises', exerciseData(catalog, overrides));
    assert.equal(res.status, 201, `No se pudo crear el ejercicio: ${JSON.stringify(res.body)}`);
    return res.body.id as number;
}

/** Crea un Entrenamiento y devuelve su id. */
export async function createTraining(client: ApiClient, day: string, extra: Record<string, unknown> = {}) {
    const res = await client.post('/trainings', { name: `Entrenamiento ${day}`, day, ...extra });
    assert.equal(res.status, 201, `No se pudo crear el entrenamiento: ${JSON.stringify(res.body)}`);
    return res.body.id as number;
}

/** Comprueba un error de validación: 400 con `issues` que mencionan los campos indicados. */
export function assertValidationError(res: ApiResponse, ...fields: string[]) {
    assert.equal(res.status, 400, `Se esperaba 400 y vino ${res.status}: ${JSON.stringify(res.body)}`);
    assert.ok(Array.isArray(res.body.issues), 'El 400 tiene que traer issues');
    for (const field of fields) {
        assert.ok(
            res.body.issues.some((issue: { path: (string | number)[] }) => issue.path.join('.') === field),
            `Se esperaba un issue en "${field}": ${JSON.stringify(res.body.issues)}`,
        );
    }
}

export function assertStatus(res: ApiResponse, status: number) {
    assert.equal(res.status, status, `Se esperaba ${status} y vino ${res.status}: ${JSON.stringify(res.body)}`);
}
