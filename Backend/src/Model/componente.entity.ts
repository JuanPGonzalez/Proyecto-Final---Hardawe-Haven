import {
  Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
    Rel,
  } from '@mikro-orm/core'
  import { BaseEntity } from '../shared/db/baseEntity.entity.js'
import { Categoria } from './categoria.entity.js';
import { Precio } from './precio.entity.js';
  
@Entity()
export class Componente extends BaseEntity {

    @Property({nullable:false})
    name!: string;

    @Property({nullable:false})
    description!: string;

    @Property({nullable:true})
    imgURL!: string;

    @Property({ type: 'numeric', nullable: false, default: 0 })
    precio_base!: number;

    @Property({ type: 'integer', nullable: false, default: 0 })
    stock!: number;

    @ManyToOne(() => Categoria,{nullable:false})
    categoria!: Rel<Categoria>;

    @OneToMany(() => Precio, (precio) => precio.componente, { cascade: [Cascade.ALL], nullable: true })
    precios = new Collection<Precio>(this);

    constructor(name:string,description:string, categoria:Rel<Categoria>, imgURL:string, precio_base: number = 0, stock: number = 0) {
      super(); 
      this.name = name;
      this.description=description;
      this.categoria = categoria;
      this.imgURL = imgURL;
      this.precio_base = precio_base;
      this.stock = stock;
  }
  
}