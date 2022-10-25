import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PremioMichelinEntity } from './premio-michelin.entity';

@Injectable()
export class PremioMichelinService {
    constructor(
        @InjectRepository(PremioMichelinEntity)
        private readonly premioMichelinRepository: Repository<PremioMichelinEntity>
    ){}

    async findAll(): Promise<PremioMichelinEntity[]> {
        return await this.premioMichelinRepository.find({ relations: [] });
    }

    async findOne(codigo: number): Promise<PremioMichelinEntity> {
        const premioMichelin: PremioMichelinEntity = await this.premioMichelinRepository.findOne({where: {codigo}, relations: [] } );
        if (!premioMichelin)
          throw new BusinessLogicException("El premio michelin con este codigo no fue encontrado", BusinessError.NOT_FOUND);
   
        return premioMichelin;
    }

    async create(premioMichelin: PremioMichelinEntity): Promise<PremioMichelinEntity> {
        return await this.premioMichelinRepository.save(premioMichelin);
    }

    async update(codigo: number, premioMichelin: PremioMichelinEntity): Promise<PremioMichelinEntity> {
        const persistedPremio: PremioMichelinEntity = await this.premioMichelinRepository.findOne({where:{codigo}});
        if (!persistedPremio)
          throw new BusinessLogicException("El premio michelin con este codigo no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.premioMichelinRepository.save({...persistedPremio, ...premioMichelin});
    }

    async delete(codigo: number) {
        const premioMichelin: PremioMichelinEntity = await this.premioMichelinRepository.findOne({where:{codigo}});
        if (!premioMichelin)
          throw new BusinessLogicException("El premio michelin con este codigo no fue encontrado", BusinessError.NOT_FOUND);
     
        await this.premioMichelinRepository.remove(premioMichelin);
    }
}
