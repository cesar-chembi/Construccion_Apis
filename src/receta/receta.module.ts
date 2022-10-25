/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

@Module({
    imports: [TypeOrmModule.forFeature([RecetaEntity])],
    controllers: [],
    providers: [RecetaService],
})
export class RecetaModule {}
