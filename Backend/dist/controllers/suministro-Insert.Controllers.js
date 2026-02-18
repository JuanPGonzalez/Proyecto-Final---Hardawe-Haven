import { ComponenteRepository } from '../repository/componenteRepository.js';
import { UserRepository } from '../repository/userRepository.js';
import { Suministro } from '../model/suministro.entity.js';
import { SuministroRepository } from '../repository/suministro.Repository.js';
const simiRepo = new SuministroRepository();
const compRepo = new ComponenteRepository();
const userRepo = new UserRepository();
const sumiInsertController = async (req, res) => {
    const { cantidad, fechaEntrega, idComponente, idUsuario } = req.body;
    try {
        const comp = await compRepo.findOne({ id: idComponente });
        const user = await userRepo.findOne({ id: idUsuario });
        if (comp && user) {
            const new_simi = new Suministro(cantidad, fechaEntrega, comp, user);
            simiRepo.add(new_simi);
            res.status(201).json({
                data: new_simi,
                message: "The suminister was added"
            });
        }
        else {
            res.status(404).json({
                data: undefined,
                message: "Error: Component or User not found"
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
export default sumiInsertController;
//# sourceMappingURL=suministro-Insert.Controllers.js.map