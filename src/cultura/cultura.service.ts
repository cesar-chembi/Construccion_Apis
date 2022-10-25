import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaEntity } from './cultura.entity';

@Injectable()
export class CulturaService {
    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>
    ){}

    async findAll(): Promise<CulturaEntity[]> {
        return await this.culturaRepository.find();
        //return await this.culturaRepository.find({ relations: ["artworks", "exhibitions"] });
    }

    async findOne(codigo: number): Promise<CulturaEntity> {
        const culture: CulturaEntity = await this.culturaRepository.findOne({where: {codigo} } );
        //const culture: CulturaEntity = await this.culturaRepository.findOne({where: {codigo}, relations: ["artworks", "exhibitions"] } );
        if (!culture)
          throw new BusinessLogicException("La cultura que se busca con ID no se encuentra", BusinessError.NOT_FOUND);
    
        return culture;
    }

    async create(culture: CulturaEntity): Promise<CulturaEntity> {
        return await this.culturaRepository.save(culture);
    }

    async update(codigo: number, culture: CulturaEntity): Promise<CulturaEntity> {
        const persistedCulture: CulturaEntity = await this.culturaRepository.findOne({where:{codigo}});
        if (!persistedCulture)
          throw new BusinessLogicException("La cultura que se busca con ID no se encuentra", BusinessError.NOT_FOUND);
        
        return await this.culturaRepository.save({...persistedCulture, ...culture});
    }

    async delete(codigo: number) {
        const culture: CulturaEntity = await this.culturaRepository.findOne({where:{codigo}});
        if (!culture)
          throw new BusinessLogicException("La cultura que se busca con ID no se encuentra", BusinessError.NOT_FOUND);
      
        await this.culturaRepository.remove(culture);
    }

}
