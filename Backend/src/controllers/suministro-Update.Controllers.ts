import { Suministro } from './../model/suministro.entity';
import { Request, Response } from 'express';
import { ComponenteRepository } from "../repository/componenteRepository.js";
import { SuministroRepository } from '../repository/suministro.Repository.js';
import { UserRepository } from '../repository/userRepository.js';

const compRepo = new ComponenteRepository();
const suministroRepo = new SuministroRepository();
const userRepo = new UserRepository();

const sumiUpdateController = async (req: Request, res: Response): Promise<void> => {       
    const {idUsuario, idComponente, newFechaEntrega, newCantidad} = req.body; 
    const id =  parseInt(req.params.id);

    try{
        const sumi = await suministroRepo.findOne({id:id});
        const user = await userRepo.findOne({id:idUsuario});
        const comp = await compRepo.findOne({id:idComponente});
       
        if (sumi && user && comp) {
            
            if(sumi.id === id){
                sumi.cantidad = newCantidad;
                sumi.fechaEntrega = newFechaEntrega;
                const sumi_updated = await suministroRepo.update(sumi);
                res.status(200).json({
                    data: sumi_updated,
                    message: "The suministro was updated"
                });
            }
            else{
                res.status(404).json({
                    data: undefined,
                    message: 'Suministro incorrect credentials'
                });
            }
                      


        } else {
            res.status(404).json({
                data: undefined,
                message: 'User or component incorrect credentials'
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

export default sumiUpdateController;