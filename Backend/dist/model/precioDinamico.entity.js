var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Componente } from './componente.entity.js';
let PrecioDinamico = class PrecioDinamico extends BaseEntity {
    constructor(componente, precio, fecha, motivo) {
        super();
        this.componente = componente;
        this.precio = precio;
        this.fecha = fecha;
        if (motivo)
            this.motivo = motivo;
    }
};
__decorate([
    ManyToOne(() => Componente, { nullable: false }),
    __metadata("design:type", Object)
], PrecioDinamico.prototype, "componente", void 0);
__decorate([
    Property({ type: 'numeric', nullable: false }),
    __metadata("design:type", Number)
], PrecioDinamico.prototype, "precio", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], PrecioDinamico.prototype, "motivo", void 0);
__decorate([
    Property({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], PrecioDinamico.prototype, "fecha", void 0);
PrecioDinamico = __decorate([
    Entity(),
    __metadata("design:paramtypes", [Object, Number, Date, String])
], PrecioDinamico);
export { PrecioDinamico };
//# sourceMappingURL=precioDinamico.entity.js.map