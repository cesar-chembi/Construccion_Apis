import { Module } from '@nestjs/common';
import { RestaurantePremioService } from './restaurante-premio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { PremioMichelinEntity } from '../premio-michelin/premio-michelin.entity';

@Module({
  providers: [RestaurantePremioService],
  imports: [TypeOrmModule.forFeature([RestauranteEntity, PremioMichelinEntity])],
})
export class RestaurantePremioModule {}
