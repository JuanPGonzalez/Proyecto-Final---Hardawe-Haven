import { Request, Response } from 'express';
import { CompraRepository } from '../repository/compraRepository.js';
import { UserRepository } from '../repository/userRepository.js';
import { ComponenteRepository } from '../repository/componenteRepository.js';

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

const dashBoardController = async (req: Request, res: Response): Promise<void> => {    
    try {

        
        const compras = await compraRepo.findAll();
        const users = await userRepo.findAll();
        const products = await productRepo.findAll();
        const mes = new Date().getMonth()+1;
        const year = new Date().getFullYear();
        const today = new Date().getDate();

        function searchSalesTotalPerMonth (mes:number,year:number){
            return (compras ? compras.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() + 1 === mes && compraDate.getFullYear() === year;
        }): undefined)
        }

        const TotalSalesMonth = searchSalesTotalPerMonth(mes,year);

        const TotalResvenueLM = compras ? compras.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() === mes && compraDate.getFullYear() === year;
        }):undefined;
        
  /////////////////////////////////////////////////////////////////////////////////////////////////////////      
        const TotalResvenue = compras ? (TotalSalesMonth? TotalSalesMonth : []).reduce((total, compra) => total + compra.total, 0):undefined;
        const TotalResvenueLMP = compras ? (TotalResvenueLM ? TotalResvenueLM:[]).reduce((total, compra) => total + compra.total, 0) - (TotalResvenue ? TotalResvenue: 0) /100:undefined;
        
        const NewOrders = compras ? compras.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() + 1 === mes && compraDate.getFullYear() === year && compraDate.getDay() === today;
        }).reduce((total, compra) => total + compra.total, 0):undefined;
        
        const NewOrdersLMP = compras ? compras.filter(compra => {
            const compraDate = new Date(compra.fechaCompra);
            return compraDate.getMonth() === mes && compraDate.getFullYear() === year && compraDate.getDay() === today;
        }).reduce((total, compra) => total + compra.total, 0) - (NewOrders ? NewOrders: 0) /100:undefined;

        const CustomersAC = users ? users.length : 0;

        const ActiveProducts = products ? products.length : 0;

        const SaleMonthIN = [];
        for (let index = 1; index < 13; index++) {
            const salesTotalPermonth = searchSalesTotalPerMonth(index,year)||[];
            SaleMonthIN.push({
                month: index,
                amount: salesTotalPermonth.reduce((total, compra) => total + compra.total, 0)
            })
        }

       






        
        if(compras!=undefined){
        res.status(200).json(
            {
             data: compras,
             message:"All the compras"
            }
        );

        }
        else{
            res.status(500).json(
                {
                data: undefined,
                message:'There was a connection error with Hardware Haven database'
                }
                
            );
        }   
        
        
    } catch (error) {
        
        res.status(500).json(
            {
            data: undefined,
            message:'There was a connection error with Hardware Haven database'
            }
            
        ); 
    }      
};

export default dashBoardController;



   