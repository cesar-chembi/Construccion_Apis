/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PaisEntity} from "./pais.entity";
import {Repository} from "typeorm";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class PaisService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,
    ) {}

    async findAll(): Promise<PaisEntity[]> {
        return await this.paisRepository.find({

        });
    }
    async findOne(codigo: number): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo} } );
        if (!pais)
            throw new BusinessLogicException(
                'El país que consulta no existe',
                BusinessError.NOT_FOUND,
            );

        return pais;
    }

    async create(pais: PaisEntity): Promise<PaisEntity> {
        return await this.paisRepository.save(pais);
    }

    async update(codigo: number, pais: PaisEntity): Promise<PaisEntity> {
        const persistedPais: PaisEntity = await this.paisRepository.findOne({
            where: { codigo },
        });
        if (!persistedPais)
            throw new BusinessLogicException(
                'El país que actualiza no existe',
                BusinessError.NOT_FOUND,
            );

        pais.codigo = codigo;

        return await this.paisRepository.save(pais);
    }
    async delete(codigo: number) {
        const pais: PaisEntity = await this.paisRepository.findOne({
            where: { codigo },
        });
        if (!pais)
            throw new BusinessLogicException(
                'El país que borra no existe',
                BusinessError.NOT_FOUND,
            );

        await this.paisRepository.remove(pais);
    }
}
