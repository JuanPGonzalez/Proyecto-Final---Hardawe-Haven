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
export async function getDataDashboard() {
    try {
        //////////////////////////////////////////////
        // TOTAL REVENUE (MES ACTUAL)
        //////////////////////////////////////////////
        const totalRevenueSQL = `
            SELECT round(SUM(total),2) AS total
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
          SELECT 
        ROUND(
            (
                ? - (
                    SELECT COALESCE(SUM(total), 0)
                    FROM compra
                    WHERE YEAR(fecha_compra) = YEAR(CURDATE())
                      AND MONTH(fecha_compra) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                )
            ) / 100,
        2) AS TotalRevenueLM;

        `;
        const totalRevenueLMResult = await orm.em.execute(totalRevenueLMSQL, [TotalResvenue]);
        const TotalResvenueLM = totalRevenueLMResult[0].total || 0;
        //////////////////////////////////////////////
        // NEW ORDERS TODAY
        //////////////////////////////////////////////
        const newOrdersSQL = `
            SELECT count(*) AS amount
            FROM compra
            WHERE DATE(fecha_compra) = CURDATE();
        `;
        const newOrdersResult = await orm.em.execute(newOrdersSQL, []);
        const NewOrders = newOrdersResult[0].amount || 0;
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
           
            WITH meses AS (
                SELECT 1 AS month UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 UNION ALL
                SELECT 10 UNION ALL
                SELECT 11 UNION ALL
                SELECT 12
            )
            SELECT 
                m.month,
                COALESCE(ROUND(SUM(c.total),2), 0) AS amount
            FROM meses m
            LEFT JOIN compra c
                ON MONTH(c.fecha_compra) = m.month
                AND YEAR(c.fecha_compra) = YEAR(CURDATE())
            GROUP BY m.month
            ORDER BY m.month;
        `;
        const SalesMonthIN = await orm.em.execute(salesMonthINSQL, []);
        //////////////////////////////////////////////
        // SALES LAST MONTH IN (12 MESES)
        //////////////////////////////////////////////
        const salesLM_INSQL = `
          WITH meses AS (
                SELECT 1 AS month UNION ALL
                SELECT 2 UNION ALL
                SELECT 3 UNION ALL
                SELECT 4 UNION ALL
                SELECT 5 UNION ALL
                SELECT 6 UNION ALL
                SELECT 7 UNION ALL
                SELECT 8 UNION ALL
                SELECT 9 UNION ALL
                SELECT 10 UNION ALL
                SELECT 11 UNION ALL
                SELECT 12
            )
            SELECT 
                m.month,
                COALESCE(ROUND(SUM(c.total),2), 0) AS amount
            FROM meses m
            LEFT JOIN compra c
                ON MONTH(c.fecha_compra) = m.month
                AND YEAR(c.fecha_compra) = (YEAR(CURDATE())-1)
            GROUP BY m.month
            ORDER BY m.month;
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
                SUM(lc.cantidad * lc.sub_total) AS total,  count(*) as sales
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
          WITH RECURSIVE dias AS (
        SELECT 1 AS day
        UNION ALL
        SELECT day + 1
        FROM dias
        WHERE day < DAY(LAST_DAY(CURDATE()))
    )
    SELECT 
        d.day,
        COALESCE(ROUND(SUM(c.total),2), 0) AS total
    FROM dias d
    LEFT JOIN compra c
        ON DAY(c.fecha_compra) = d.day
        AND MONTH(c.fecha_compra) = MONTH(CURDATE())
        AND YEAR(c.fecha_compra) = YEAR(CURDATE())
    GROUP BY d.day
    ORDER BY d.day;
        `;
        const SalesMonth = await orm.em.execute(salesMonthSQL, []);
        //////////////////////////////////////////////
        // ORDERS LTY (last 12 months)
        //////////////////////////////////////////////
        const ordersLTYSQL = `
           WITH RECURSIVE dias AS (
            SELECT 1 AS day
            UNION ALL
            SELECT day + 1
            FROM dias
            WHERE day < DAY(LAST_DAY(CURDATE()))
        )
        SELECT 
            d.day,
            COALESCE(COUNT(c.fecha_compra), 0) AS amount
        FROM dias d
        LEFT JOIN hardware_haven.compra c
            ON DAY(c.fecha_compra) = d.day
            AND MONTH(c.fecha_compra) = MONTH(CURDATE())
            AND YEAR(c.fecha_compra) = YEAR(CURDATE())
        GROUP BY d.day
        ORDER BY d.day;


        `;
        const OrdersLTY = await orm.em.execute(ordersLTYSQL, []);
        //////////////////////////////////////////////
        // BEST SELLING PRODUCTS
        //////////////////////////////////////////////
        const bsProductsSQL = `
             SELECT 
                comp.name AS name,
                round(SUM(lc.cantidad * lc.sub_total),2) AS TotalSaleAmount
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
//# sourceMappingURL=management.js.map