/*
TotalResvenue + TotalResvenueLM
NewOrders + NewOrdersLM
Customers
ActiveProducts
SalesMonthIN: (Number+ Value) + SalesLMIN: (Number+ Value)
BestCustomer(3): 1{Nombre + email + TotalIn}n
TopProducts: {ID+Name+Category+Price+Sales}
-------------------------------------------
Inicio/Analisis "Ventas del mes"
SalesMonth: 1{Number+Amount}12
----------------------------------------------
ORDENES
OrdersLTY(12): 1{day, value}12
-----------------------------------------------
BSProducts: 1{Name + TotalSaleAmount}n
------------------------------------------------
SPCustomers: 1{UserName + TotalSales}n
-----------------------------------------------
Payments: {CashAmount+ CardAmount+ EPAmount}
-----------------------------------------------
AnalysisBusiness:{ActiveUsers+ UsesMeM+ ApplicationPMin+ TimeR+ LatProm+ BurdenProm,
retentioRate+ AverageST+Conversions+ CriticalErrorsMens
*/
import { orm } from '../shared/db/orm.js';
export async function obtenerDashboard() {
    try {
        //////////////////////////////////////////////
        // TOTAL REVENUE (MES ACTUAL)
        //////////////////////////////////////////////
        const totalRevenueSQL = `
            SELECT SUM(total) AS total
            FROM compra
            WHERE YEAR(fecha_compra) = YEAR(CURDATE())
            AND MONTH(fecha_compra) = MONTH(CURDATE());
        `;
        const totalRevenueResult = await orm.em.execute(totalRevenueSQL, []);
        const TotalResvenue = totalRevenueResult[0].total || 0;
        //////////////////////////////////////////////
        // TOTAL REVENUE LAST MONTH
        //////////////////////////////////////////////
        const totalRevenueLMSQL = `
            SELECT SUM(total) AS total
            FROM compra
            WHERE fecha_compra >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
              AND fecha_compra < CURDATE();
        `;
        const totalRevenueLMResult = await orm.em.execute(totalRevenueLMSQL, []);
        const TotalResvenueLM = totalRevenueLMResult[0].total || 0;
        //////////////////////////////////////////////
        // NEW ORDERS TODAY
        //////////////////////////////////////////////
        const newOrdersSQL = `
            SELECT SUM(total) AS total
            FROM compra
            WHERE DATE(fecha_compra) = CURDATE();
        `;
        const newOrdersResult = await orm.em.execute(newOrdersSQL, []);
        const NewOrders = newOrdersResult[0].total || 0;
        //////////////////////////////////////////////
        // NEW ORDERS LAST MONTH (same day)
        //////////////////////////////////////////////
        const newOrdersLMSQL = `
            SELECT SUM(total) AS total
            FROM compra
            WHERE DATE(fecha_compra) = DATE_SUB(CURDATE(), INTERVAL 1 MONTH);
        `;
        const newOrdersLMResult = await orm.em.execute(newOrdersLMSQL, []);
        const NewOrdersLM = newOrdersLMResult[0].total || 0;
        //////////////////////////////////////////////
        // CUSTOMERS (count users)
        //////////////////////////////////////////////
        const customersSQL = `SELECT COUNT(*) AS count FROM user;`;
        const customersResult = await orm.em.execute(customersSQL, []);
        const Customers = customersResult[0].count;
        //////////////////////////////////////////////
        // ACTIVE PRODUCTS
        //////////////////////////////////////////////
        const activeProductsSQL = `SELECT COUNT(*) AS count FROM componente;`;
        const activeProductsResult = await orm.em.execute(activeProductsSQL, []);
        const ActiveProducts = activeProductsResult[0].count;
        //////////////////////////////////////////////
        // SALES MONTH IN (12 MESES)
        //////////////////////////////////////////////
        const salesMonthINSQL = `
            SELECT 
                MONTH(fecha_compra) AS month,
                SUM(total) AS amount
            FROM compra
            WHERE YEAR(fecha_compra) = YEAR(CURDATE())
            GROUP BY MONTH(fecha_compra)
            ORDER BY MONTH(fecha_compra);
        `;
        const SalesMonthIN = await orm.em.execute(salesMonthINSQL, []);
        //////////////////////////////////////////////
        // SALES LAST MONTH IN (12 MESES)
        //////////////////////////////////////////////
        const salesLM_INSQL = `
            SELECT 
                MONTH(fecha_compra) AS month,
                SUM(total) AS amount
            FROM compra
            WHERE fecha_compra >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY MONTH(fecha_compra)
            ORDER BY MONTH(fecha_compra);
        `;
        const SalesLMIN = await orm.em.execute(salesLM_INSQL, []);
        //////////////////////////////////////////////
        // BEST CUSTOMERS (Top 3)
        //////////////////////////////////////////////
        const bestCustomersSQL = `
            SELECT u.name, u.email, SUM(c.total) AS totalIn
            FROM compra c
            JOIN user u ON c.user_id = u.id
            GROUP BY u.id
            ORDER BY totalIn DESC
            LIMIT 3;
        `;
        const BestCustomers = await orm.em.execute(bestCustomersSQL, []);
        //////////////////////////////////////////////
        // TOP PRODUCTS (Top 10)
        //////////////////////////////////////////////
        const topProductsSQL = `
            SELECT 
                comp.id,
                comp.name,
                cat.descripcion AS category,
                SUM(lc.cantidad * lc.sub_total) AS sales
            FROM linea_compra lc
            JOIN componente comp ON comp.id = lc.componente_id
            JOIN categoria cat ON cat.id = comp.categoria_id
            GROUP BY comp.id
            ORDER BY sales DESC
            LIMIT 10;
        `;
        const TopProducts = await orm.em.execute(topProductsSQL, []);
        //////////////////////////////////////////////
        // SALES MONTH DETAIL 1{Month+Amount}12
        //////////////////////////////////////////////
        const salesMonthSQL = `
            SELECT 
                MONTH(fecha_compra) AS number,
                SUM(total) AS amount
            FROM compra
            WHERE YEAR(fecha_compra) = YEAR(CURDATE())
            GROUP BY MONTH(fecha_compra);
        `;
        const SalesMonth = await orm.em.execute(salesMonthSQL, []);
        //////////////////////////////////////////////
        // ORDERS LTY (last 12 months)
        //////////////////////////////////////////////
        const ordersLTYSQL = `
            SELECT 
                DAY(fecha_compra) AS day,
                SUM(total) AS value
            FROM compra
            WHERE fecha_compra >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DAY(fecha_compra);
        `;
        const OrdersLTY = await orm.em.execute(ordersLTYSQL, []);
        //////////////////////////////////////////////
        // BEST SELLING PRODUCTS
        //////////////////////////////////////////////
        const bsProductsSQL = `
            SELECT 
                comp.name AS name,
                SUM(lc.cantidad * lc.sub_total) AS TotalSaleAmount
            FROM linea_compra lc
            JOIN componente comp ON comp.id = lc.componente_id
            GROUP BY comp.id
            ORDER BY TotalSaleAmount DESC;
        `;
        const BSProducts = await orm.em.execute(bsProductsSQL, []);
        //////////////////////////////////////////////
        // SALES PER CUSTOMER
        //////////////////////////////////////////////
        const spCustomerSQL = `
            SELECT 
                u.name AS userName,
                SUM(c.total) AS TotalSales
            FROM compra c
            JOIN user u ON u.id = c.user_id
            GROUP BY u.id
            ORDER BY TotalSales DESC;
        `;
        const SPCustomers = await orm.em.execute(spCustomerSQL, []);
        //////////////////////////////////////////////
        // PAYMENTS (Cash, Card, Electronic)
        //////////////////////////////////////////////
        const paymentsSQL = `
           SELECT count(*) AS cash FROM hardware_haven.compra;
        `;
        const Payments = (await orm.em.execute(paymentsSQL, []))[0];
        //////////////////////////////////////////////
        // FINAL RESPONSE
        //////////////////////////////////////////////
        return {
            TotalResvenue,
            TotalResvenueLM,
            NewOrders,
            NewOrdersLM,
            Customers,
            ActiveProducts,
            SalesMonthIN,
            SalesLMIN,
            BestCustomers,
            TopProducts,
            SalesMonth,
            OrdersLTY,
            BSProducts,
            SPCustomers,
            Payments
        };
    }
    catch (error) {
        console.error(error);
        throw new Error("Hubo un error obteniendo dashboard");
    }
}
//# sourceMappingURL=pruebas.js.map