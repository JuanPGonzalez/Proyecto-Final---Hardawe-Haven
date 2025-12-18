import { CompraRepository } from '../repository/compraRepository.js';
import { UserRepository } from '../repository/userRepository.js';
import { ComponenteRepository } from '../repository/componenteRepository.js';
import { LineaCompraRepository } from '../repository/lineaCompraRepository.js';
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
BSProducts: 1{Nanme + TotalSaleAmount}n
------------------------------------------------
SPCustomers: 1{UserName + TotalSales}n
-----------------------------------------------
Payments: {CashAmount+ CardAmount+ EPAmount}
-----------------------------------------------
AnalysisBusiness:{ActiveUsers+ UsesMeM+ ApplicationPMin+ TimeR+ LatProm+ BurdenProm,
retentioRate+ AverageST+Conversions+ CriticalErrorsMens
*/
const compraRepo = new CompraRepository();
const userRepo = new UserRepository();
const productRepo = new ComponenteRepository();
const saleLineRepo = new LineaCompraRepository();
const dashBoardController = async (req, res) => {
    try {
        const sales = await compraRepo.findAll();
        const users = await userRepo.findAll();
        const products = await productRepo.findAll();
        const salesLines = await saleLineRepo.findAll();
        const mes = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const today = new Date().getDate();
        function searchSalesTotalPerMonth(mes, year) {
            return (sales ? sales.filter(compra => {
                const compraDate = new Date(compra.fechaCompra);
                return compraDate.getMonth() + 1 === mes && compraDate.getFullYear() === year;
            }) : undefined);
        }
        const TotalSalesMonth = searchSalesTotalPerMonth(mes, year);
        const TotalResvenueLM = sales ? sales.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() === mes && compraDate.getFullYear() === year;
        }) : undefined;
        /////////////////////////////////////////////////////////////////////////////////////////////////////////      
        const TotalResvenue = sales ? (TotalSalesMonth ? TotalSalesMonth : []).reduce((total, compra) => total + compra.total, 0) : undefined;
        const TotalResvenueLMP = sales ? (TotalResvenueLM ? TotalResvenueLM : []).reduce((total, compra) => total + compra.total, 0) - (TotalResvenue ? TotalResvenue : 0) / 100 : undefined;
        const NewOrders = sales ? sales.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() + 1 === mes && compraDate.getFullYear() === year && compraDate.getDay() === today;
        }).reduce((total, compra) => total + compra.total, 0) : undefined;
        const NewOrdersLMP = sales ? sales.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() === mes && compraDate.getFullYear() === year && compraDate.getDay() === today;
        }).reduce((total, compra) => total + compra.total, 0) - (NewOrders ? NewOrders : 0) / 100 : undefined;
        const CustomersAC = users ? users.length : 0; ////////////////////////////////////////////////
        const ActiveProducts = products ? products.length : 0; ////////////////////////////////////////////////
        const SaleMonthIN = []; ////////////////////////////////////////////////////////////////////////////////////////////////
        for (let index = 1; index < 13; index++) {
            const salesTotalPermonth = searchSalesTotalPerMonth(index, year) || [];
            SaleMonthIN.push({
                month: index,
                amount: salesTotalPermonth.reduce((total, compra) => total + compra.total, 0) || 0
            });
        }
        function calculateTotalPerUser(sales) {
            const totalGroup = sales.reduce((acumulador, compra) => {
                const id = compra.user.id;
                const total = compra.total;
                acumulador[id] = (acumulador[id] || 0) + total;
                return acumulador;
            }, {});
            return Object.keys(totalGroup).map(id => ({
                userId: parseInt(id),
                totalSaled: totalGroup[id]
            }));
        }
        const BestCustomers = []; ////////////////////////////////////////////////
        const CustomersPerUser = calculateTotalPerUser(sales);
        CustomersPerUser.sort((a, b) => b.totalSaled - a.totalSaled);
        for (let i = 0; i < 3 && i < CustomersPerUser.length; i++) {
            const user = users?.find(u => u.id === CustomersPerUser[i].userId);
            if (user) {
                BestCustomers.push({
                    nombre: user.name,
                    email: user.email,
                    totalIn: CustomersPerUser[i].totalSaled
                });
            }
        }
        function calculateTotalProduct(salesLines) {
            const totalGroup = salesLines.reduce((acumulador, lineacompra) => {
                const id = lineacompra.componente.id;
                const total = lineacompra.cantidad * lineacompra.subTotal;
                acumulador[id] = (acumulador[id] || 0) + total;
                return acumulador;
            }, {});
            return Object.keys(totalGroup).map(id => ({
                productId: parseInt(id),
                totalSaled: totalGroup[id]
            }));
        }
        const TopProducts = []; ////////////////////////////////////////////////
        const SalesPerProduct = calculateTotalProduct(salesLines);
        SalesPerProduct.sort((a, b) => b.totalSaled - a.totalSaled);
        for (let i = 0; i < 10 && i < SalesPerProduct.length; i++) {
            const product = products?.find(p => p.id === SalesPerProduct[i].productId);
            if (product) {
                TopProducts.push({
                    id: product.id,
                    name: product.name,
                    category: product.categoria.descripcion,
                    sales: SalesPerProduct[i].totalSaled
                });
            }
        }
        function calculateTotalPerMonth(sales) {
            const resumenMensual = sales.reduce((acc, compra) => {
                const fecha = new Date(compra.fechaCompra);
                const nroMes = fecha.getMonth() + 1;
                if (!acc[nroMes]) {
                    acc[nroMes] = {
                        nroMonth: nroMes,
                        totalSaled: 0,
                        SalesAmount: 0
                    };
                }
                acc[nroMes].totalSaled += compra.total;
                acc[nroMes].SalesAmount += 1;
                return acc;
            }, {});
            return Object.values(resumenMensual);
        }
        const SalesMonth = calculateTotalPerMonth(TotalSalesMonth); //////////////////
        if (sales != undefined) {
            res.status(200).json({
                data: sales,
                message: "All the sales"
            });
        }
        else {
            res.status(500).json({
                data: undefined,
                message: 'There was a connection error with Hardware Haven database'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            data: undefined,
            message: 'There was a connection error with Hardware Haven database'
        });
    }
};
export default dashBoardController;
//# sourceMappingURL=DashBoard.js.map