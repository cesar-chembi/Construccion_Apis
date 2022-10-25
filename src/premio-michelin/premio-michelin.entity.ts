import { RestauranteEntity } from '../restaurante/restaurante.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'

@Entity()
export class PremioMichelinEntity {
    @PrimaryGeneratedColumn()
    codigo: number;

    @Column()
    fechaConsecucion: Date;

    @ManyToOne(()=> RestauranteEntity, restaurante=> restaurante.premiosMicheline )
    restaurante: RestauranteEntity;
}
