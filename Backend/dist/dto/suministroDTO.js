// Instancia de Ajv
import Ajv from "ajv";
import addErrors from "ajv-errors";
import { SuministroDTOSchema } from "../lib/suministro-typesSchema.js";
const ajv = new Ajv({ allErrors: true });
addErrors(ajv);
// Compila el esquema
const validateSchema = ajv.compile(SuministroDTOSchema);
// Middleware para validar el DTO
export const suministroDTO = (req, res, next) => {
    const isValid = validateSchema(req.body);
    if (!isValid) {
        const errors = validateSchema.errors ?? [];
        return res.status(400).send({
            errors: errors.map((error) => error.message),
        });
    }
    next();
};
//# sourceMappingURL=suministroDTO.js.map