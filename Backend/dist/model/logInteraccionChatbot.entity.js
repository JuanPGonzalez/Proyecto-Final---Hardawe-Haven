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
import { User } from './user.entity.js';
let LogInteraccionChatbot = class LogInteraccionChatbot extends BaseEntity {
    constructor(mensaje_usuario, respuesta_bot, fecha, usuario, intencion, escalado = false) {
        super();
        this.mensaje_usuario = mensaje_usuario;
        this.respuesta_bot = respuesta_bot;
        this.fecha = fecha;
        this.escalado = escalado;
        if (usuario)
            this.usuario = usuario;
        if (intencion)
            this.intencion = intencion;
    }
};
__decorate([
    ManyToOne(() => User, { nullable: true }),
    __metadata("design:type", Object)
], LogInteraccionChatbot.prototype, "usuario", void 0);
__decorate([
    Property({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], LogInteraccionChatbot.prototype, "mensaje_usuario", void 0);
__decorate([
    Property({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], LogInteraccionChatbot.prototype, "respuesta_bot", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], LogInteraccionChatbot.prototype, "intencion", void 0);
__decorate([
    Property({ default: false }),
    __metadata("design:type", Boolean)
], LogInteraccionChatbot.prototype, "escalado", void 0);
__decorate([
    Property({ type: 'datetime', nullable: false }),
    __metadata("design:type", Date)
], LogInteraccionChatbot.prototype, "fecha", void 0);
LogInteraccionChatbot = __decorate([
    Entity(),
    __metadata("design:paramtypes", [String, String, Date, Object, String, Boolean])
], LogInteraccionChatbot);
export { LogInteraccionChatbot };
//# sourceMappingURL=logInteraccionChatbot.entity.js.map