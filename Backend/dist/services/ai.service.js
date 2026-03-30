const AI_MODEL_URL = 'http://localhost:8000/api/v1';
export class AIService {
    async interactuarChatbot(mensaje, usuario_id) {
        try {
            const response = await fetch(`${AI_MODEL_URL}/chatbot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensaje_usuario: mensaje, usuario_id })
            });
            return await response.json();
        }
        catch (error) {
            console.error('Error connecting to AI Backend (chatbot)', error);
            throw new Error('AI Service unavailable');
        }
    }
    async getRecomendaciones(usuario_id, producto_actual_id) {
        try {
            const response = await fetch(`${AI_MODEL_URL}/recomendaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id, producto_actual_id })
            });
            return await response.json();
        }
        catch (error) {
            console.error('Error connecting to AI Backend (recomendaciones)', error);
            throw new Error('AI Service unavailable');
        }
    }
    async getPrecioDinamico(componente_id, precio_base, stock) {
        try {
            const response = await fetch(`${AI_MODEL_URL}/precio-dinamico`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ componente_id, precio_base, stock })
            });
            return await response.json();
        }
        catch (error) {
            console.error('Error connecting to AI Backend (precio-dinamico)', error);
            throw new Error('AI Service unavailable');
        }
    }
}
export default new AIService();
//# sourceMappingURL=ai.service.js.map