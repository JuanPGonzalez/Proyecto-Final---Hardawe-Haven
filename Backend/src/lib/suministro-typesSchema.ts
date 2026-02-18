// componente.types.ts
import { Type } from "@sinclair/typebox";

export const SuministroDTOSchema = Type.Object({
    cantidad: 
    Type.Optional( 
    Type.Number({
        minimum: 1,
        errorMessage: {
            minimum: 'La cantidad debe ser mayor o igual a 1',
        }
    })), 
    fechaEntrega: 
    Type.Optional( 
    Type.String({
         errorMessage: {
            type: 'El tipo de fecha desde no es válido, debe ser una cadena en formato de fecha',
            format: 'El formato de fecha desde no es válido',
        }
    })), 
    newCant: 
    Type.Optional( 
    Type.Number({
        minimum: 1,
        errorMessage: {
            minimum: 'La nueva cantidad debe ser mayor o igual a 1',
        }
    })), 
    newFechaEntrega: 
    Type.Optional( 
    Type.String({
         errorMessage: {
            type: 'El tipo de fecha desde no es válido, debe ser una cadena en formato de fecha',
            format: 'El formato de fecha desde no es válido',
        }
    })), 
}, { additionalProperties: true });
