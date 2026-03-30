import { Router } from "express";
import { 
    interactuarChatbotController, 
    getRecomendacionesController, 
    getPrecioDinamicoController, 
    getDashboardStatsController 
} from "../controllers/ai-Integrations.Controllers.js";
import userJWTDTOAdmin from "../dto/userJWTDTOAdmin.js";

const aiRouter = Router();

aiRouter.post('/chatbot', interactuarChatbotController);
aiRouter.post('/recomendaciones', getRecomendacionesController);
aiRouter.post('/precio-dinamico', getPrecioDinamicoController);

// Dashboard endpoint solo para administradores
aiRouter.get('/dashboard/stats', userJWTDTOAdmin, getDashboardStatsController);

export default aiRouter;
