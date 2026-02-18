import { Request, Response } from 'express';
import { SuministroRepository } from '../repository/suministro.Repository.js';

const sumRepo = new SuministroRepository();

const sumiGetByUserController = async (req: Request, res: Response): Promise<void> => {       
    const id =  parseInt(req.params.id);

    try{
        const comp = await sumRepo.findSuministersByUser(id);
        if (comp) {
            res.status(200).json({
                data: comp,
                message: "The suministers was found successfully"
            });
        } else {
            res.status(404).json({
                data: undefined,
                message: 'Suminister not found'
            });
        }

    }
    catch (error) {
        console.error(error);
         res.status(500).json({
            data: undefined,
            message: 'There was a server error'
        });
    }     
};

export default sumiGetByUserController;
