import { Response, NextFunction } from 'express';
import { CustomRequest } from '../Interfaces/interfaces';

export function sanitizeSuministroInput(req: CustomRequest, res: Response, next: NextFunction) {
  
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }
    req.body.sanitizedSuministro = {
        idComponente:req.body.idComponente,
        idUsuario:req.body.idUsuario,
        cantidad:req.body.cantidad,
        fechaEntrega:req.body.fechaEntrega,
        newCantidad:req.body.newCantidad,
        newFechaEntrega:req.body.newFechaEntrega,
        
      };
  
    Object.keys(req.body.sanitizedSuministro).forEach((key) => {
        if (req.body.sanitizedSuministro[key] === undefined) {
          delete req.body.sanitizedSuministro[key];
        }
      });
    
      next();
    }
