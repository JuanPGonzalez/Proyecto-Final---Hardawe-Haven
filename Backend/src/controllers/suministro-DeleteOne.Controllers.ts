import { Request, Response } from 'express';
import { SuministroRepository } from '../repository/suministro.Repository.js';


const sumRepo = new SuministroRepository();

const sumiDeleteOneController = async (req: Request, res: Response): Promise<void> => {       
    const id =  parseInt(req.params.id);

    try{
        const sumi= await sumRepo.findOne({id: id});
        if (sumi) {
                const sumi_deleted = await sumRepo.delete({id:id});
                res.status(200).json({
                    data: sumi_deleted,
                    message: "The suministro was deleted"
                });
        } else {
            res.status(404).json({
                data: undefined
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

export default sumiDeleteOneController;