import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RecetaEntity } from './receta.entity';

@Injectable()
export class RecetaService {
    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ){}

    async findAll(): Promise<RecetaEntity[]> {
        return await this.recetaRepository.find({ relations: [] });
    }

    async findOne(codigo: number): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {codigo}, relations: [] } );
        if (!receta)
          throw new BusinessLogicException("La receta con este codigo no fue encontrado", BusinessError.NOT_FOUND);
   
        return receta;
    }

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(codigo: number, receta: RecetaEntity): Promise<RecetaEntity> {
        const persistedReceta: RecetaEntity = await this.recetaRepository.findOne({where:{codigo}});
        if (!persistedReceta)
          throw new BusinessLogicException("La receta con este codigo no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.recetaRepository.save({...persistedReceta, ...receta});
    }

    async delete(codigo: number) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where:{codigo}});
        if (!receta)
          throw new BusinessLogicException("La receta con este codigo no fue encontrado", BusinessError.NOT_FOUND);
     
        await this.recetaRepository.remove(receta);
    }
}
