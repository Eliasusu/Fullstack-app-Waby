import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';

/**
 * Configuración de la API, leída del `.env` de la raíz del monorepo (o del de `api/`).
 * Si falta algo obligatorio, la API no arranca.
 */
for (const candidate of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '..', '.env')]) {
    if (existsSync(candidate)) {
        process.loadEnvFile(candidate);
        break;
    }
}

const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DB_HOST: z.string().default('127.0.0.1'),
    DB_PORT: z.coerce.number().int().positive().default(3306),
    DB_NAME: z.string().min(1),
    DB_TEST_NAME: z.string().min(1).default('waby_test'),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET tiene que tener al menos 32 caracteres'),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    const problems = parsed.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Configuración inválida. Revisá el .env (ver .env.example):\n${problems}`);
}

export const env = {
    ...parsed.data,
    /** En los tests se usa una base aparte, que se borra y se recrea. */
    dbName: parsed.data.NODE_ENV === 'test' ? parsed.data.DB_TEST_NAME : parsed.data.DB_NAME,
    isDev: parsed.data.NODE_ENV === 'development',
    isTest: parsed.data.NODE_ENV === 'test',
    isProd: parsed.data.NODE_ENV === 'production',
};
