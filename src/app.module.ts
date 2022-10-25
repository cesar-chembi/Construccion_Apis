import { CulturaModule } from './cultura/cultura.module';
import { RecetaModule } from './receta/receta.module';
import { PremioMichelinModule } from './premio-michelin/premio-michelin.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ProductoModule} from "./producto/producto.module";
import {ProductoEntity} from "./producto/producto.entity";
import {CategoriaModule} from "./categoria/categoria.module";
import {CategoriaEntity} from "./categoria/categoria.entity";
import { CulturaEntity } from './cultura/cultura.entity';
import { PaisModule } from './pais/pais.module';
import { RestauranteModule } from './restaurante/restaurante.module';
import { PaisEntity } from './pais/pais.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioMichelinEntity } from './premio-michelin/premio-michelin.entity';
import { RecetaEntity } from './receta/receta.entity';
import { RestaurantePremioModule } from './restaurante-premio/restaurante-premio.module';
import { CulturaRecetaModule } from './cultura-receta/cultura-receta.module';
import { PaisRestauranteModule } from './pais-restaurante/pais-restaurante.module';
import { CategoriaProductoModule } from './categoria-producto/categoria-producto.module';

@Module({
  imports: [
    CulturaModule,ProductoModule,CategoriaModule,
    PaisModule,
    RestauranteModule,
    RecetaModule,
    PremioMichelinModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'culturaGastronomica',
      entities: [RecetaEntity,PremioMichelinEntity, ProductoEntity, CategoriaEntity, CulturaEntity, PaisEntity, RestauranteEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    RestaurantePremioModule,
    CulturaRecetaModule,
    PaisRestauranteModule,
    CategoriaProductoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
