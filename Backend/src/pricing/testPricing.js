import { writeFileSync } from 'fs';
import 'reflect-metadata';
import '../config/env.js';
import { orm } from '../shared/db/orm.js';
import { Componente } from '../Model/componente.entity.js';
import { Categoria } from '../Model/categoria.entity.js';
import { Precio } from '../Model/precio.entity.js';
import { User } from '../Model/user.entity.js';
import { Compra } from '../Model/compra.entity.js';
import { LineaCompra } from '../Model/lineaCompra.entity.js';
import { DynamicPricingService } from './dynamicPricing.js';
async function runTest() {
    try {
        await orm.connect();
        // Warning: syncing schema might drop data depending on config. "updateSchema" is safer.
        // But for test reliability, we usually want clean state. 
        // Given existing project, I should avoid dropping schema unless verified safe.
        // I will just insert data.
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
        const uniqueName = `TestUser_${Date.now()}`;
        const user = new User(uniqueName, 'password', `${uniqueName}@example.com`, 'customer', new Date(), new Date('1990-01-01'), 'M', '123 Street');
        em.persist(user);
        // 5. Create Sales for Component A
        // Need > 2 sales. Let's create 3 sales of 1 unit, or 1 sale of 3 units? 
        // Logic: "Analyze how many sales each product had... Sales volume must be calculated exclusively using the purchase line"
        // Code: `salesVolume[compId] = ... + line.cantidad`. So 1 line with quantity 3 counts as 3.
        const compra = new Compra(user);
        compra.fechaCompra = new Date(); // Now
        em.persist(compra);
        const lineaA = new LineaCompra(3, compra, compA);
        // LineaCompra constructor: (cantidad, compra, componente)
        em.persist(lineaA);
        // Component B has 0 sales.
        await em.flush();
        console.log('--- Test Data Persisted ---');
        // 6. Run Adjustment
        console.log('--- Running Dynamic Pricing Adjustment ---');
        await DynamicPricingService.adjustPrices();
        // 7. Verify Results
        em.clear(); // Clear identity map to fetch fresh from DB
        const freshCompA = await em.findOne(Componente, { id: compA.id }, { populate: ['precios'] });
        const freshCompB = await em.findOne(Componente, { id: compB.id }, { populate: ['precios'] });
        if (!freshCompA || !freshCompB)
            throw new Error("Components not found after refresh");
        // Check Price A
        const pricesA = freshCompA.precios.getItems().sort((a, b) => b.fechaDesde.getTime() - a.fechaDesde.getTime());
        const latestPriceA = Number(pricesA[0].valor);
        console.log(`Product A (High Sales) Price: ${priceValA} -> ${latestPriceA}`);
        if (latestPriceA === 110) {
            console.log('SUCCESS: Product A increased by 10%');
        }
        else {
            console.error(`FAILURE: Product A expected 110, got ${latestPriceA}`);
        }
        // Check Price B
        const pricesB = freshCompB.precios.getItems().sort((a, b) => b.fechaDesde.getTime() - a.fechaDesde.getTime());
        const latestPriceB = Number(pricesB[0].valor);
        console.log(`Product B (Low Sales) Price: ${priceValB} -> ${latestPriceB}`);
        if (latestPriceB === 90) {
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
        await orm.close(true);
        // Clean up? Maybe risky to delete if we don't know IDs clearly or constraints. 
        // Test data will remain.
        console.log('--- Test Completed ---');
        process.exit(0);
    }
}
runTest();
