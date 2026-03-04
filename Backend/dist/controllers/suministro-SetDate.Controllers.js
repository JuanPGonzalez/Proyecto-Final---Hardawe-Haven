import { SuministroRepository } from '../repository/suministro.Repository.js';
const sumRepo = new SuministroRepository();
const sumiSetDateController = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const sumi = await sumRepo.findOne({ id: id });
        if (sumi) {
            if (!sumi.fechaEntrega) {
                sumi.fechaEntrega = new Date();
                const sumi_updated = await sumRepo.update(sumi);
                res.status(200).json({
                    data: sumi_updated,
                    message: "The suministero was seted successfully"
                });
            }
            else {
                res.status(400).json({
                    data: undefined,
                    message: 'The suminister already has a delivery date'
                });
            }
        }
        else {
            res.status(404).json({
                data: undefined,
                message: 'Suminister not found'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            data: undefined,
            message: 'There was a server error'
        });
    }
};
export default sumiSetDateController;
//# sourceMappingURL=suministro-SetDate.Controllers.js.map