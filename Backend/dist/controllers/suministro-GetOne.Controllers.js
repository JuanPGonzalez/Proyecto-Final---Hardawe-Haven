import { SuministroRepository } from '../repository/suministro.Repository.js';
const sumRepo = new SuministroRepository();
const sumiGetOneController = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const comp = await sumRepo.findOne({ id: id });
        if (comp) {
            res.status(200).json({
                data: comp,
                message: "The suministero was found successfully"
            });
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
export default sumiGetOneController;
//# sourceMappingURL=suministro-GetOne.Controllers.js.map