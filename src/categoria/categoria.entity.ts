/* eslint-disable prettier/prettier */

import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import {ProductoEntity} from "../producto/producto.entity";


@Entity()
export class CategoriaEntity {

    @PrimaryGeneratedColumn()
    codigo: number;
 
    @Column()
    nombre: string;

    @OneToMany(() => ProductoEntity, producto => producto.categoria)
    productos: ProductoEntity[];
}
