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
        // Dinero perdido por cancelaciones
        //////////////////////////////////////////////
        const cancelSQL = `
    SELECT ROUND(SUM(total), 2) AS totalLosedCancel
    FROM hardware_haven.compra
    WHERE fecha_cancel IS NOT NULL;
`;
        const totalCancelResult = await orm.em.execute(cancelSQL, []);
        const totalLosedCancel = Number(totalCancelResult[0].totalLosedCancel) || 0;
        //////////////////////////////////////////////
        // Cantidad de ventas por categoría
        //////////////////////////////////////////////
        const ventasCategoriaSQL = `
    SELECT ca.descripcion, COUNT(c.id) AS totalCompras
    FROM categoria ca
    LEFT JOIN componente co ON co.categoria_id = ca.id
    LEFT JOIN linea_compra lc ON lc.componente_id = co.id
    LEFT JOIN compra c ON c.id = lc.compra_id
    GROUP BY ca.descripcion
    ORDER BY totalCompras DESC;
`;
        const salesPerCategory = await orm.em.execute(ventasCategoriaSQL, []);
        //////////////////////////////////////////////
        // Promedio de ventas por día
        //////////////////////////////////////////////
        const promedioVentasSQL = `
    SELECT ROUND(AVG(daily_total), 0) AS promedioVentasPorDia
    FROM (
        SELECT DATE(fecha_compra) AS fecha, count(*) AS daily_total
        FROM hardware_haven.compra
        GROUP BY DATE(fecha_compra)
    ) AS sub;
`;
        const avgSalesPerDayResult = await orm.em.execute(promedioVentasSQL, []);
        const avgSalesPerDay = Number(avgSalesPerDayResult[0].promedioVentasPorDia) || 0;
        //////////////////////////////////////////////
        // Total de ventas por tipo de usuario
        //////////////////////////////////////////////
        const ventasTipoUsuarioSQL = `
    SELECT u.tipo_usuario AS typeUser, COUNT(*) AS totalAmount
    FROM hardware_haven.user u
    LEFT JOIN compra c ON c.user_id = u.id
    WHERE fecha_compra IS NOT NULL
    GROUP BY u.tipo_usuario;
`;
        const salesPerTypeUser = await orm.em.execute(ventasTipoUsuarioSQL, []);
        //////////////////////////////////////////////
        // Cantidad de productos vendidos
        //////////////////////////////////////////////
        const totalProductosSQL = `
    SELECT SUM(cantidad) AS totalProductAmount
    FROM hardware_haven.linea_compra;
`;
        const totalProductsSaledResult = await orm.em.execute(totalProductosSQL, []);
        const totalProductsSaled = Number(totalProductsSaledResult[0].totalProductAmount) || 0;
        //////////////////////////////////////////////
        // Tiempo promedio de cancelación
        //////////////////////////////////////////////
        const tiempoPromedioCancelSQL = `
    SELECT ROUND(AVG(TIMESTAMPDIFF(DAY, fecha_compra, fecha_cancel)), 2) AS avgCancelTimeInDays
    FROM hardware_haven.compra
    WHERE fecha_cancel IS NOT NULL;
`;
        const avgCancelTimeResult = await orm.em.execute(tiempoPromedioCancelSQL, []);
        const avgCancelTime = Number(avgCancelTimeResult[0].avgCancelTimeInDays) || 0;
        //////////////////////////////////////////////
        // Sexo promedio de los clientes
        //////////////////////////////////////////////
        const sexoPromedioSQL = `
    SELECT 
       ROUND((maleCount * 100) / (maleCount + femaleCount), 2) AS malePercentage,
       ROUND((femaleCount * 100) / (maleCount + femaleCount), 2) AS femalePercentage
    FROM
        (SELECT COUNT(*) AS maleCount FROM hardware_haven.user WHERE sexo = 'M') AS m
    CROSS JOIN
        (SELECT COUNT(*) AS femaleCount FROM hardware_haven.user WHERE sexo = 'F') AS f;
`;
        const avgSexResult = await orm.em.execute(sexoPromedioSQL, []);
        const avgSex = {
            malePercentage: Number(avgSexResult[0].malePercentage) || 0,
            femalePercentage: Number(avgSexResult[0].femalePercentage) || 0
        };
        //////////////////////////////////////////////
        // Cantidad de usuarios por tipo
        //////////////////////////////////////////////
        const usuariosPorTipoSQL = `
    SELECT tipo_usuario AS typeUsers, COUNT(*) AS amountUsers
    FROM hardware_haven.user
    GROUP BY tipo_usuario;
`;
        const usersPerType = await orm.em.execute(usuariosPorTipoSQL, []);
        //////////////////////////////////////////////
        // Edad promedio de los clientes
        //////////////////////////////////////////////
        const edadPromedioSQL = `
    SELECT ROUND(AVG(TIMESTAMPDIFF(YEAR, fecha_nac, NOW())), 0) AS avgAge
    FROM hardware_haven.user;
`;
        const avgAgeResult = await orm.em.execute(edadPromedioSQL, []);
        const avgAge = Number(avgAgeResult[0].avgAge) || 0;
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
            Payments,
            totalLosedCancel,
            salesPerCategory,
            avgSalesPerDay,
            salesPerTypeUser,
            totalProductsSaled,
            avgCancelTime,
            avgSex,
            usersPerType,
            avgAge
        };
    }
    catch (error) {
        console.error(error);
        throw new Error("Hubo un error obteniendo dashboard");
    }
}
//# sourceMappingURL=management.js.map