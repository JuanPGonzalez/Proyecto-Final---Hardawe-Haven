import { writeFileSync } from 'fs';
import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import '../config/env.js';
// Entities
import { Componente } from '../Model/componente.entity.js';
import { Categoria } from '../Model/categoria.entity.js';
import { Precio } from '../Model/precio.entity.js';
import { User } from '../Model/user.entity.js';
import { Compra } from '../Model/compra.entity.js';
import { LineaCompra } from '../Model/lineaCompra.entity.js';
import { DynamicPricingService } from './dynamicPricing.js';
async function runTest() {
    let orm;
    try {
        console.log('Initializing Test ORM...');
        orm = await MikroORM.init({
            entities: [Categoria, Componente, Precio, User, Compra, LineaCompra],
            dbName: 'hardware_haven',
            driver: MySqlDriver,
            clientUrl: process.env.DB,
            highlighter: new SqlHighlighter(),
            debug: true,
            allowGlobalContext: true, // For simplicity in test
        });
        const em = orm.em.fork();
        console.log('--- Setting up Test Data ---');
        // 1. Create a Category
        const categoria = new Categoria('Test Category Description');
        em.persist(categoria);
        // 2. Create Component A (High Sales Scenario: > 2 sales)
        const compA = new Componente('Product A', 'High Sales Desc', categoria, 'imgA.png');
        em.persist(compA);
        const priceValA = 100;
        const precioA = new Precio(new Date(Date.now() - 3600000), priceValA, compA); // 1 hour ago
        em.persist(precioA);
        // 3. Create Component B (Low Sales Scenario: < 2 sales)
        const compB = new Componente('Product B', 'Low Sales Desc', categoria, 'imgB.png');
        em.persist(compB);
        const priceValB = 100;
        const precioB = new Precio(new Date(Date.now() - 3600000), priceValB, compB);
        em.persist(precioB);
        // 4. Create User
        // Fix: Use random/unique name to avoid unique constraint violations if re-run
        const uniqueName = `TestUser_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const user = new User(uniqueName, 'password', `${uniqueName}@example.com`, 'customer', new Date(), new Date('1990-01-01'), 'M', '123 Street');
        em.persist(user);
        // 5. Create Sales for Component A
        const compra = new Compra(user);
        compra.fechaCompra = new Date();
        em.persist(compra);
        const lineaA = new LineaCompra(3, compra, compA);
        em.persist(lineaA);
        await em.flush();
        console.log('--- Test Data Persisted ---');
        // 6. Run Adjustment
        // IMPORTANT: The DynamicPricingService uses `orm` imported from `../shared/db/orm.js`.
        // This is a problem because that `orm` instance is NOT the one we just initialized.
        // It will try to use the configured GLOBAL one which fails discovery?
        // OR checks the DB independently.
        // If DynamicPricingService uses `orm.em.fork()`, it forks the SHARED instance.
        // That shared instance is initialized in `orm.ts` via top-level await.
        // It uses the GLOB configuration.
        // So `DynamicPricingService` will still use the glob-based ORM.
        // I must allow `DynamicPricingService` to accept an ORM instance or EntityManager?
        // Or I must Initialize the SHARED ORM correctly?
        // Use `DynamicPricingService.adjustPrices()`?
        // Wait, if passing explicit entities solves MY test persist, it doesn't solve DynamicPricingService's internal logic if it uses the broken shared ORM.
        // But the shared ORM logic `entities: ['dist/**/*.entity.js']` SHOULD work in `dist` mode.
        // The failure was `persist(categoria)` inside my test.
        // If `DynamicPricingService` works (it only does `em.find` and `em.persist`), it might work if IT uses the shared ORM correctly.
        // The issue was `ValidationError` on `persist` inside `runTest`, because `runTest` used shared ORM + local import.
        // If I make `runTest` use its OWN ORM, then `persist` works.
        // BUT `DynamicPricingService` uses Shared ORM.
        // They are communicating via the DATABASE.
        // If `runTest` persists to DB, and `DynamicPricingService` reads from DB, it's fine.
        // Connection context: different pools, same DB. Transaction isolation might be an issue if not committed?
        // `em.flush()` commits.
        // So:
        // 1. `runTest` uses LocalORM to create data -> Commit.
        // 2. Call `DynamicPricingService.adjustPrices()`.
        //    This service uses SharedORM. It connects, reads DB (sees committed data), computes, writes DB.
        // 3. `runTest` checks DB using LocalORM (reads committed data).
        // This works!
        // One catch: `DynamicPricingService` might need to be "waited" on for the top-level await in `orm.ts` to finish?
        // JS modules handle this.
        console.log('--- Running Dynamic Pricing Adjustment ---');
        await DynamicPricingService.adjustPrices(em);
        // 7. Verify Results
        em.clear();
        const freshCompA = await em.findOne(Componente, { id: compA.id }, { populate: ['precios'] });
        const freshCompB = await em.findOne(Componente, { id: compB.id }, { populate: ['precios'] });
        if (!freshCompA || !freshCompB)
            throw new Error("Components not found after refresh");
        const pricesA = freshCompA.precios.getItems().sort((a, b) => b.fechaDesde.getTime() - a.fechaDesde.getTime());
        const latestPriceA = Number(pricesA[0].valor);
        console.log(`Product A (High Sales) Price: ${priceValA} -> ${latestPriceA}`);
        if (Math.abs(latestPriceA - 110) < 0.01) {
            console.log('SUCCESS: Product A increased by 10%');
        }
        else {
            console.error(`FAILURE: Product A expected 110, got ${latestPriceA}`);
        }
        const pricesB = freshCompB.precios.getItems().sort((a, b) => b.fechaDesde.getTime() - a.fechaDesde.getTime());
        const latestPriceB = Number(pricesB[0].valor);
        console.log(`Product B (Low Sales) Price: ${priceValB} -> ${latestPriceB}`);
        if (Math.abs(latestPriceB - 90) < 0.01) {
            console.log('SUCCESS: Product B decreased by 10%');
        }
        else {
            console.error(`FAILURE: Product B expected 90, got ${latestPriceB}`);
        }
    }
    catch (e) {
        writeFileSync('error.log', JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        console.error('TEST FAILED:', e);
    }
    finally {
        if (orm)
            await orm.close(true);
        // We probably also need to close the shared ORM connection if it was opened by DynamicPricingService import?
        // DynamicPricingService imports `orm`. `orm` opens connection on load (top level await).
        // Calling `orm.close()` on shared?
        // import { orm as sharedOrm } from '../shared/db/orm.js';
        // sharedOrm.close();
        // I should add this clean up.
        try {
            const { orm: sharedOrm } = await import('../shared/db/orm.js');
            await sharedOrm.close(true);
        }
        catch (err) {
            console.log('Could not close shared ORM', err);
        }
        console.log('--- Test Completed ---');
        process.exit(0);
    }
}
runTest();
//# sourceMappingURL=testPricing.js.map