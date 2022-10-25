/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import {PaisEntity} from "./pais.entity";
import { PaisService } from './pais.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaisEntity])],
    providers: [PaisService]
})
export class PaisModule {}
