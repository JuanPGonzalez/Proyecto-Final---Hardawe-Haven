import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialNavegacion extends Document {
    usuario_id?: string;
    producto_id?: string;
    accion: 'view' | 'add_to_cart' | 'purchase';
    fecha: Date;
    metadata?: Record<string, any>;
}

const HistorialNavegacionSchema: Schema = new Schema({
    usuario_id: { type: String, required: false },
    producto_id: { type: String, required: false },
    accion: { type: String, enum: ['view', 'add_to_cart', 'purchase'], required: true },
    fecha: { type: Date, default: Date.now },
    metadata: { type: Schema.Types.Mixed, required: false }
});

export const HistorialNavegacionModel = mongoose.model<IHistorialNavegacion>('HistorialNavegacion', HistorialNavegacionSchema);
