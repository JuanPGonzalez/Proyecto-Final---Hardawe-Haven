import mongoose, { Schema } from 'mongoose';
const HistorialNavegacionSchema = new Schema({
    usuario_id: { type: String, required: false },
    producto_id: { type: String, required: false },
    accion: { type: String, enum: ['view', 'add_to_cart', 'purchase'], required: true },
    fecha: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed, required: false }
});
export const HistorialNavegacionModel = mongoose.model('HistorialNavegacion', HistorialNavegacionSchema);
//# sourceMappingURL=historialNavegacion.model.js.map