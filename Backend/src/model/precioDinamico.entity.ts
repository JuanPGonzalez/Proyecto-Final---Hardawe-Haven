import { Entity, Property, ManyToOne, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../shared/db/baseEntity.entity.js';
import { Componente } from './componente.entity.js';

@Entity()
export class PrecioDinamico extends BaseEntity {
    @ManyToOne(() => Componente, { nullable: false })
    componente!: Rel<Componente>;

    @Property({ type: 'numeric', nullable: false })
    precio!: number;

    @Property({ nullable: true })
    motivo!: string;

    @Property({ type: 'datetime', nullable: false })
    fecha!: Date;

    constructor(componente: Rel<Componente>, precio: number, fecha: Date, motivo?: string) {
        super();
        this.componente = componente;
        this.precio = precio;
        this.fecha = fecha;
        if (motivo) this.motivo = motivo;
    }
}
