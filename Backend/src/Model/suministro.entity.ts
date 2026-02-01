import {
    Entity,
    ManyToOne,
    Property,
    Rel,
  } from '@mikro-orm/core'
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { User } from './user.entity.js';
import { Componente } from './componente.entity.js';

  
@Entity()
export class Suministro extends BaseEntity {

    @Property({nullable:false})
    cantidad!: number;

    @Property({nullable:true})
    fechaEntrega!: Date;

    @ManyToOne(() => Componente,{nullable:false})  
    componente!: Rel<Componente>;

    @ManyToOne(() => User,{nullable:false}) 
    usuario!: Rel<User>;

    constructor(cantidad:number,fechaEntrega:Date, componente:Rel<Componente>, usuario:Rel<User>) {
      super(); 
      this.cantidad = cantidad;
      this.fechaEntrega=fechaEntrega;
      this.componente = componente;
      this.usuario = usuario;
  }
  
}