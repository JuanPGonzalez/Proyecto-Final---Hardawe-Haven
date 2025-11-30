import { Request, Response } from 'express';
import { getDataDashboard } from '../dashboard/management.js';

const dashBoardController = async (req: Request, res: Response): Promise<void> => {    
    try {

        const dashboard = await getDataDashboard();
 
        if(dashboard!=undefined){
        res.status(200).json(
            {
             data: dashboard,
             message:"Dashboard data retrieved successfully"
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
