import { Request, Response } from 'express';
import aiService from '../services/ai.service.js';

export const interactuarChatbotController = async (req: Request, res: Response) => {
    try {
        const { mensaje_usuario, usuario_id } = req.body;
        const result = await aiService.interactuarChatbot(mensaje_usuario, usuario_id);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getRecomendacionesController = async (req: Request, res: Response) => {
    try {
        const { usuario_id, producto_actual_id } = req.body;
        const result = await aiService.getRecomendaciones(usuario_id, producto_actual_id);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getPrecioDinamicoController = async (req: Request, res: Response) => {
    try {
        const { componente_id, precio_base, stock } = req.body;
        const result = await aiService.getPrecioDinamico(componente_id, precio_base, stock);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getDashboardStatsController = async (req: Request, res: Response) => {
    return res.status(200).json({
        kpis: {
            ingresos: 125000.5,
            conversion: 3.4,
            tickets_chatbot_escalados: 12
        },
        top_productos: [
            { id: "comp-101", nombre: "RTX 4090", ventas: 15 },
            { id: "comp-102", nombre: "Intel Core i9", ventas: 22 }
        ]
    });
};
