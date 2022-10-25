/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../../cultura/cultura.entity';
import {PaisEntity} from "../../pais/pais.entity";
import {RestauranteEntity} from "../../restaurante/restaurante.entity";
import {ProductoEntity} from "../../producto/producto.entity";
import {CategoriaEntity} from "../../categoria/categoria.entity";
import { PremioMichelinEntity } from '../../premio-michelin/premio-michelin.entity';
import { RecetaEntity } from '../../receta/receta.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ProductoEntity, CategoriaEntity,CulturaEntity, PaisEntity, RestauranteEntity,RecetaEntity, PremioMichelinEntity],
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature([ProductoEntity, CategoriaEntity,CulturaEntity, PaisEntity, RestauranteEntity,RecetaEntity, PremioMichelinEntity]),
];
