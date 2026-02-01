import { Router } from "express";



//Imports de validaciones
import userJWTDTO from "../dto/userJWTDTO.js";
import userJWTDTOAdmin from "../dto/userJWTDTOAdmin.js";
import sumiGetAllController from "../controllers/suministro-GetAll.Controllers.js";
import sumiGetOneController from "../controllers/suministro-GetOne.Controllers.js";
import { sanitizeSuministroInput } from "../security/suministro-sanitize.dto.js";
import { suministroDTO } from "../dto/suministroDTO.js";
import sumiInsertController from "../controllers/suminister-Insert.Controllers.js";
import sumiUpdateController from "../controllers/suministro-Update.Controllers.js";
import sumiDeleteOneController from "../controllers/suministro-DeleteOne.Controllers.js";
import sumiGetByUserController from "../controllers/suministro-GetByUser.Controllers.js";
const sumiRouter = Router();

//middlewares
sumiRouter.get('/getAll', sumiGetAllController);
sumiRouter.get('/getOne/:id', userJWTDTO, sumiGetOneController)
sumiRouter.get('/getByUser/:id', userJWTDTO, sumiGetByUserController)
sumiRouter.post('/insert',  userJWTDTOAdmin, sanitizeSuministroInput, suministroDTO, sumiInsertController);
sumiRouter.delete('/deleteOne/:id',userJWTDTOAdmin,sumiDeleteOneController);
sumiRouter.put('/update/:id',  userJWTDTOAdmin, sanitizeSuministroInput,suministroDTO, sumiUpdateController)


export default sumiRouter;