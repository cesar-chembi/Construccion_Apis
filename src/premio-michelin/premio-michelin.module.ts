/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremioMichelinEntity } from './premio-michelin.entity';
import { PremioMichelinService } from './premio-michelin.service';

@Module({
    imports: [TypeOrmModule.forFeature([PremioMichelinEntity])],
    controllers: [],
    providers: [PremioMichelinService],
})
export class PremioMichelinModule {}
