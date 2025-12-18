import { Router } from "express";
import userJWTDTOAdmin from "../dto/userJWTDTOAdmin.js";
import dashBoardController from "../controllers/DashBoard.Controller.js";
const dashboardRouter = Router();
//middlewares
dashboardRouter.get('/getAll', userJWTDTOAdmin, dashBoardController);
export default dashboardRouter;
//# sourceMappingURL=dashboardRouter.js.map