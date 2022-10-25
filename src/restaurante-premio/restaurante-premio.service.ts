import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PremioMichelinEntity } from '../premio-michelin/premio-michelin.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestaurantePremioService {
    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
    
        @InjectRepository(PremioMichelinEntity)
        private readonly premioRepository: Repository<PremioMichelinEntity>,
        
    ) {}

    async addPremioRestaurante(restauranteId: number, premioId: number): Promise<RestauranteEntity> {
        const premio: PremioMichelinEntity  = await this.premioRepository.findOne({where: {codigo: premioId}});
        if (!premio)
          throw new BusinessLogicException("Premio, no encontrado, debe agregarlo antes", BusinessError.NOT_FOUND);
      
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restauranteId}, relations: ["premiosMicheline"]})
        if (!restaurante)
          throw new BusinessLogicException("Restaurante no encontrado o identificador de restaurante invalido", BusinessError.NOT_FOUND);
    
        restaurante.premiosMicheline = [...restaurante.premiosMicheline, premio];
        return await this.restauranteRepository.save(restaurante);
      }

      async findPremiosByRestauranteId(restauranteId : number): Promise<PremioMichelinEntity[]> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restauranteId}, relations: ["premiosMicheline"]})
        if (!restaurante)
          throw new BusinessLogicException("Premios michelin no encontrados, restaurante invalido", BusinessError.NOT_FOUND)
       
        return restaurante.premiosMicheline;
      }
    
}
