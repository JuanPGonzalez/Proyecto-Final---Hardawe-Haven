import { Suministro } from "../model/suministro.entity.js";
import { orm } from '../shared/db/orm.js';
const em = orm.em;
export class SuministroRepository {
    async findAll() {
        try {
            const comps = await em.find(Suministro, {}, { populate: ['usuario', 'componente'] });
            return comps;
        }
        catch (error) {
            return undefined;
        }
    }
    async findOne(item) {
        try {
            const sumi = await em.findOneOrFail(Suministro, { id: item.id }, { populate: ['usuario', 'componente'] });
            return sumi;
        }
        catch (error) {
            return undefined;
        }
    }
    async add(item) {
        try {
            const new_comp = em.create(Suministro, item);
            await em.flush();
            return new_comp;
        }
        catch (error) {
            return undefined;
        }
    }
    async update(item) {
        try {
            const id = item.id;
            const sumiToUpdate = await em.findOneOrFail(Suministro, { id });
            em.assign(sumiToUpdate, item);
            await em.flush();
            return sumiToUpdate;
        }
        catch (error) {
            return undefined;
        }
    }
    async delete(item) {
        try {
            const id = item.id;
            const sumi = em.getReference(Suministro, id);
            await em.removeAndFlush(sumi);
            return sumi;
        }
        catch (error) {
            return undefined;
        }
    }
    async findSuministersByUser(userId) {
        try {
            const sumi = await em.find(Suministro, { usuario: { id: userId } }, { populate: ['usuario', 'componente'] });
            return sumi;
        }
        catch (error) {
            return undefined;
        }
    }
}
//# sourceMappingURL=suministro.Repository.js.map