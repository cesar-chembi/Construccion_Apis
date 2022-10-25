/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import {ProductoDTO} from "./producto.dto";

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find( { relations: ["categoria","culturas"] });
    }

    async findOne(codigo: number): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo} , relations: ["categoria","culturas"] } );
        if (!producto)
            throw new BusinessLogicException("El producto con este identificador no fue encontrado", BusinessError.NOT_FOUND);

        return producto;
    }

    async create(productoDTO: ProductoDTO): Promise<ProductoDTO> {
        const producto = new ProductoEntity();
        producto.nombre = productoDTO.nombre;
        producto.historia = productoDTO.historia;
        producto.descripcion = productoDTO.descripcion;
        return await this.productoRepository.save(producto);

    }

    async update(codigo: number, productoDTO: ProductoDTO): Promise<ProductoDTO> {
        const persistedProducto: ProductoEntity = await this.productoRepository.findOne({where:{codigo}});
        if (!persistedProducto)
            throw new BusinessLogicException("El producto con este identificador no fue encontrado", BusinessError.NOT_FOUND);

        persistedProducto.nombre = productoDTO.nombre;
        persistedProducto.historia = productoDTO.historia;
        persistedProducto.descripcion = productoDTO.descripcion;
        return await this.productoRepository.save(persistedProducto);
    }

    async delete(codigo: number) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{codigo}});
        if (!producto)
            throw new BusinessLogicException("El producto con este identificador no fue encontrado", BusinessError.NOT_FOUND);

        await this.productoRepository.remove(producto);
    }
}
