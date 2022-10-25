import { Module } from '@nestjs/common';
import {ProductoService} from "./producto.service";
import {ProductoEntity} from "./producto.entity";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([ProductoEntity])],
    providers: [ProductoService],
})
export class ProductoModule {}
