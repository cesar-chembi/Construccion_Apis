/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {PaisEntity} from "../pais/pais.entity";
import {RestauranteEntity} from "../restaurante/restaurante.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class PaisRestauranteService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,

        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>
    ) {}
    //museo es pais
    //arwork es restaurante
    async adicionarRestaurantePais(paisCodigo: number, restauranteCodigo: number): Promise<PaisEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restauranteCodigo}});
        if (!restaurante)
            throw new BusinessLogicException("El restaurante no se encontró", BusinessError.NOT_FOUND);

        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paisCodigo}, relations: ["restaurantes"]})
        if (!pais)
            throw new BusinessLogicException("El pais no se encontró", BusinessError.NOT_FOUND);

        pais.restaurantes = [...pais.restaurantes, restaurante];
        return await this.paisRepository.save(pais);
    }

    async buscarRestauranteXPaisCodigoRestauranteCodigo(paisCodigo: number, restauranteCodigo: number): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restauranteCodigo}});
        if (!restaurante)
            throw new BusinessLogicException("El restaurante no se encontró", BusinessError.NOT_FOUND)

        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paisCodigo}, relations: ["restaurantes"]});
        if (!pais)
            throw new BusinessLogicException("El pais no se encontró", BusinessError.NOT_FOUND)

        const paisrestaurante: RestauranteEntity = pais.restaurantes.find(e => e.codigo === restaurante.codigo);

        if (!paisrestaurante)
            throw new BusinessLogicException("El  restaurante que se desea borrar no esta asociado al pais", BusinessError.PRECONDITION_FAILED)

        return paisrestaurante;
    }

    async buscarRestaurantesXPaisCodigo(paisCodigo: number): Promise<RestauranteEntity[]> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paisCodigo}, relations: ["restaurantes"]});
        if (!pais)
            throw new BusinessLogicException("El pais no se encontró", BusinessError.NOT_FOUND)

        return pais.restaurantes;
    }

    async asociarRestaurantesPais(paisCodigo: number, restaurantes: RestauranteEntity[]): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paisCodigo}, relations: ["restaurantes"]});

        if (!pais)
            throw new BusinessLogicException("El pais no se encontró", BusinessError.NOT_FOUND)

        for (let i = 0; i < restaurantes.length; i++) {
            const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restaurantes[i].codigo}});
            if (!restaurante)
                throw new BusinessLogicException("El restaurante no se encontró", BusinessError.NOT_FOUND)
        }

        pais.restaurantes = restaurantes;
        return await this.paisRepository.save(pais);
    }

    async borrarRestaurantePais(paisCodigo: number, restauranteCodigo: number){
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restauranteCodigo}});
        if (!restaurante)
            throw new BusinessLogicException("El restaurante no se encontró", BusinessError.NOT_FOUND)

        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paisCodigo}, relations: ["restaurantes"]});
        if (!pais)
            throw new BusinessLogicException("El pais no se encontró", BusinessError.NOT_FOUND)

        const paisrestaurante: RestauranteEntity = pais.restaurantes.find(e => e.codigo === restaurante.codigo);

        if (!paisrestaurante)
            throw new BusinessLogicException("El  restaurante que se desea borrar no esta asociado al pais", BusinessError.PRECONDITION_FAILED)

        pais.restaurantes = pais.restaurantes.filter(e => e.codigo !== restauranteCodigo);
        await this.paisRepository.save(pais);
    }
}
