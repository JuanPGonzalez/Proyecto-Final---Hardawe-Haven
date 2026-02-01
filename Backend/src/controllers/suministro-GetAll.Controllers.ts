import { SuministroRepository } from './../repository/suministro.Repository.js';
import { Request, Response } from 'express';


const sumRepo = new SuministroRepository();

const sumiGetAllController = async (req: Request, res: Response): Promise<void> => {    
    try {
        const comps = await sumRepo.findAll();
        
        if(comps!=undefined){
        res.status(200).json(
            {
             data: comps,
             message:"All the suministers"
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

export default sumiGetAllController;