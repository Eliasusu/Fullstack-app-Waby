import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import type { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { env } from '../env.js';

export const orm = await MikroORM.init<MySqlDriver>({
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./**/*.entity.ts'],
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
