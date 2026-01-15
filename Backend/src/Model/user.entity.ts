import {
    Entity,
    OneToMany,
    Property,
    Cascade,
    Collection,
  } from '@mikro-orm/core'
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
  import { Compra } from './compra.entity.js';
@Entity()
export class User extends BaseEntity {

    @Property({nullable:false, unique: true})
    name!: string;

    @Property({nullable:false})
    password!: string;

    @Property({nullable:false})
    email!: string;

    @Property({nullable:false})
    tipoUsuario!: string;

    @Property({nullable:false, defaultRaw: 'CURRENT_TIMESTAMP'})
    fechaReg!: Date;

    @Property({nullable:false, default: 'Indefinido'})
    sexo!: string;

    @Property({nullable:false, defaultRaw: 'CURRENT_TIMESTAMP'})
    fechaNac!: Date;

    @Property({nullable:false, default: 'Desconocida'})
    direccion!: string;

    @OneToMany(() => Compra, c => c.user, { cascade: [Cascade.ALL] })
    compras = new Collection<Compra>(this);

    constructor(name:string, password: string, email: string, tipoUsuario:string, fechaReg:Date, fechaNac: Date, sexo:string, direccion:string) {
      super(); 
      this.name = name;
      this.password = password;
      this.email = email;
      this.tipoUsuario = tipoUsuario;
      this.fechaReg = fechaReg;
      this.fechaNac = fechaNac;
      this.sexo = sexo;
      this.direccion = direccion;
  }
}

