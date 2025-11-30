import { Router } from "express";
import dashBoardController from "../controllers/DashBoard.Controller.js";
const dashboardRouter = Router();
//middlewares
dashboardRouter.get('/getAll', dashBoardController);
export default dashboardRouter;
//# sourceMappingURL=dashboardRouter.js.map