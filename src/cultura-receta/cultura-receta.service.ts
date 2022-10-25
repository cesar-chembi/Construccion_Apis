import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CulturaRecetaService {
    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,
    
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
        
    ) {}

    async addRecetaCultura(culturaId: number, recetaId: number): Promise<CulturaEntity> {
        const receta: RecetaEntity  = await this.recetaRepository.findOne({where: {codigo: recetaId}});
        if (!receta)
          throw new BusinessLogicException("La receta con este codigo, no fue encontrado", BusinessError.NOT_FOUND);
      
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {codigo: culturaId}, relations: ["recetas"]})
        if (!cultura)
          throw new BusinessLogicException("Cultura gastronomica no encontrada, identificador de cultura invalido", BusinessError.NOT_FOUND);
    
        cultura.recetas = [...cultura.recetas, receta];
        return await this.culturaRepository.save(cultura);
      }

      async findrecetasByCulturaId(culturaId : number): Promise<RecetaEntity[]> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {codigo: culturaId}, relations: ["recetas"]})
        if (!cultura)
          throw new BusinessLogicException("La receta con este codigo, no fue encontrado", BusinessError.NOT_FOUND)
       
        return cultura.recetas;
      }
    
}
