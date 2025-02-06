import { MikroORM } from "@mikro-orm/core";
import { SqlHighlighter } from "@mikro-orm/sql-highlighter";


export const orm = await MikroORM.init({
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./**/*.entity.js'],
    dbName: 'wabydb',
    type: 'mysql',
    user: 'admin',
    password: 'elias123', // 'renalessiSql21!'
    clientUrl: 'mysql://admin:admin@localhost:3306/wabydb',
    highlighter: new SqlHighlighter(),
    debug: true,
    schemaGenerator: { //Dont use this in production
        disableForeignKeys: true,
        createForeignKeyConstraints: true,
        ignoreSchema: [],
    },
});

export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    //await generator.dropSchema();
    //await generator.createSchema();
    await generator.updateSchema();
};