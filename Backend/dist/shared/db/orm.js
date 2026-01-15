import { MikroORM, } from '@mikro-orm/core';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';
let ormInstance;
try {
    ormInstance = await MikroORM.init({
        entities: ['dist/**/*.entity.js'],
        entitiesTs: ['src/**/*.entity.ts'],
        dbName: 'hardware_haven',
        driver: MySqlDriver,
        clientUrl: `${process.env.DB}`,
        highlighter: new SqlHighlighter(),
        debug: true,
        // allowGlobalContext: true, // maybe needed?
        schemaGenerator: {
            disableForeignKeys: true,
            createForeignKeyConstraints: true,
            ignoreSchema: [],
        },
    });
}
catch (error) {
    console.error("MIKRO-ORM INIT ERROR:", error);
    process.exit(1);
}
export const orm = ormInstance;
export const syncSchema = async () => {
    const generator = orm.getSchemaGenerator();
    //await generator.dropSchema()
    //await generator.createSchema()
    await generator.updateSchema();
};
//# sourceMappingURL=orm.js.map