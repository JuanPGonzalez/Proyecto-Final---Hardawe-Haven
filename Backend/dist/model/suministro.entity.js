var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, ManyToOne, Property, } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { User } from './user.entity.js';
import { Componente } from './componente.entity.js';
let Suministro = class Suministro extends BaseEntity {
    constructor(cantidad, fechaEntrega, componente, usuario) {
        super();
        this.cantidad = cantidad;
        this.fechaEntrega = fechaEntrega;
        this.componente = componente;
        this.usuario = usuario;
    }
};
__decorate([
    Property({ nullable: false }),
    __metadata("design:type", Number)
], Suministro.prototype, "cantidad", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", Date)
], Suministro.prototype, "fechaEntrega", void 0);
__decorate([
    ManyToOne(() => Componente, { nullable: false }),
    __metadata("design:type", Object)
], Suministro.prototype, "componente", void 0);
__decorate([
    ManyToOne(() => User, { nullable: false }),
    __metadata("design:type", Object)
], Suministro.prototype, "usuario", void 0);
Suministro = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Number, Date, Object, Object])
], Suministro);
export { Suministro };
//# sourceMappingURL=suministro.entity.js.map