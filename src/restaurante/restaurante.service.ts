/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {RestauranteEntity} from "../restaurante/restaurante.entity";
import {Repository} from "typeorm";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class RestauranteService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    ) {}

    async findAll(): Promise<RestauranteEntity[]> {
        return await this.restauranteRepository.find({

        });
    }
    async findOne(codigo: number): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo},  } );
        if (!restaurante)
            throw new BusinessLogicException(
                'El recurso solicitado no se encontró',
                BusinessError.NOT_FOUND,
            );

        return restaurante;
    }

    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        return await this.restauranteRepository.save(restaurante);
    }

    async update(codigo: number, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const persistedrestaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: { codigo },
        });
        if (!persistedrestaurante)
            throw new BusinessLogicException(
                'El recurso solicitado no existe',
                BusinessError.NOT_FOUND,
            );

        restaurante.codigo = codigo;

        return await this.restauranteRepository.save(restaurante);
    }
    async delete(codigo: number) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({
            where: { codigo },
        });
        if (!restaurante)
            throw new BusinessLogicException(
                'El recurso solicitado no existe',
                BusinessError.NOT_FOUND,
            );

        await this.restauranteRepository.remove(restaurante);
    }
}
