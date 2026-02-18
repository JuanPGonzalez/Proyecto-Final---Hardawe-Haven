export function sanitizeSuministroInput(req, res, next) {
    if (!req.body || typeof req.body !== 'object') {
        return next();
    }
    req.body.sanitizedSuministro = {
        idComponente: req.body.idComponente,
        idUsuario: req.body.idUsuario,
        cantidad: req.body.cantidad,
        fechaEntrega: req.body.fechaEntrega,
        newCantidad: req.body.newCantidad,
        newFechaEntrega: req.body.newFechaEntrega,
    };
    Object.keys(req.body.sanitizedSuministro).forEach((key) => {
        if (req.body.sanitizedSuministro[key] === undefined) {
            delete req.body.sanitizedSuministro[key];
        }
    });
    next();
}
//# sourceMappingURL=suministro-sanitize.dto.js.map