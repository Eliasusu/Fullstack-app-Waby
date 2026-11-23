import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import type { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../env.js';

/**
 * Raíz del build (`api/dist/`), calculada desde este archivo (`dist/shared/db/orm.js`)
 * para que las entidades se encuentren sin importar desde qué carpeta se arranca la API.
 */
const distRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

export const orm = await MikroORM.init<MySqlDriver>({
    baseDir: distRoot,
    entities: ['./**/*.entity.js'],
    // MikroORM decide entre import() y require() mirando el package.json del cwd.
    // Las entidades son ESM, así que se fuerza import() para no depender de desde dónde se arranca.
    dynamicImportProvider: (id) => import(id),
    type: 'mysql',
    host: env.DB_HOST,
    port: env.DB_PORT,
    dbName: env.dbName,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    highlighter: new SqlHighlighter(),
    debug: env.isDev,
    schemaGenerator: {
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
    },
});

/** Actualiza el esquema según las entidades. Solo en desarrollo: no hay migraciones (ADR-0003). */
export async function syncSchema() {
    if (!env.isDev) return;
    await orm.getSchemaGenerator().updateSchema();
}
