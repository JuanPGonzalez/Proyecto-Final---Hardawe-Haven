import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { User } from './user.entity.js';

@Entity()
export class LogInteraccionChatbot extends BaseEntity {
    @ManyToOne(() => User, { nullable: true })
    usuario?: Rel<User>;

    @Property({ type: 'text', nullable: false })
    mensaje_usuario!: string;

    @Property({ type: 'text', nullable: false })
    respuesta_bot!: string;

    @Property({ nullable: true })
    intencion!: string;

    @Property({ default: false })
    escalado!: boolean;

    @Property({ type: 'datetime', nullable: false })
    fecha!: Date;

    constructor(mensaje_usuario: string, respuesta_bot: string, fecha: Date, usuario?: Rel<User>, intencion?: string, escalado: boolean = false) {
        super();
        this.mensaje_usuario = mensaje_usuario;
        this.respuesta_bot = respuesta_bot;
        this.fecha = fecha;
        this.escalado = escalado;
        if (usuario) this.usuario = usuario;
        if (intencion) this.intencion = intencion;
    }
}
