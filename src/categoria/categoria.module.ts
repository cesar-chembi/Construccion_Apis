import { Module } from '@nestjs/common';
import {CategoriaService} from "./categoria.service";
import {CategoriaEntity} from "./categoria.entity";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([CategoriaEntity])],
    providers: [CategoriaService],
})
export class CategoriaModule {}
