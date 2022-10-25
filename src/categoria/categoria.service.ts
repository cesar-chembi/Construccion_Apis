/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import {CategoriaEntity} from "./categoria.entity";
import {ProductoEntity} from "../producto/producto.entity";
import {ProductoDTO} from "../producto/producto.dto";
import {CategoriaDTO} from "./categoria.dto";


@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>
    ){}

    async findAll(): Promise<CategoriaEntity[]> {
        return await this.categoriaRepository.find({ relations: ["productos"] });
    }

    async findOne(codigo: number): Promise<CategoriaEntity> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo} , relations: ["productos"] } );
        if (!categoria)
            throw new BusinessLogicException("La categoria con este identificador no fue encontrada", BusinessError.NOT_FOUND);

        return categoria;
    }

    async create(categoriaDTO: CategoriaDTO): Promise<CategoriaDTO> {

        const categoria = new CategoriaEntity();
        categoria.nombre = categoriaDTO.nombre;
        return await this.categoriaRepository.save(categoria);
    }

    async update(codigo: number, categoriaDTO: CategoriaDTO): Promise<CategoriaDTO> {
        const persistedCategoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{codigo}});
        if (!persistedCategoria)
            throw new BusinessLogicException("La categoria con este identificador no fue encontrada", BusinessError.NOT_FOUND);

        persistedCategoria.nombre = categoriaDTO.nombre;

        return await this.categoriaRepository.save(persistedCategoria);
    }

    async delete(codigo: number) {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{codigo}});
        if (!categoria)
            throw new BusinessLogicException("La categoria con este identificador no fue encontrada", BusinessError.NOT_FOUND);

        await this.categoriaRepository.remove(categoria);
    }
}

