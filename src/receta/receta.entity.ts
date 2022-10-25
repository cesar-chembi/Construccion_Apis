import { CulturaEntity } from '../cultura/cultura.entity';
import {Column, Entity, PrimaryGeneratedColumn, ManyToOne} from 'typeorm'

@Entity()
export class RecetaEntity {

    @PrimaryGeneratedColumn()
    codigo: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    urlFoto: string;

    @Column()
    procesoPrep: string;

    @Column()
    urlVideo: string;

    @ManyToOne(()=> CulturaEntity, cultura=> cultura.recetas )
    cultura: CulturaEntity;

}
