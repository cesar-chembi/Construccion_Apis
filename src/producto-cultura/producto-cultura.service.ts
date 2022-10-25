/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import {CulturaDTO} from "../cultura/cultura.dto";
import {ProductoDTO} from "../producto/producto.dto";
import {CulturaEntity} from "../cultura/cultura.entity";
import {ProductoEntity} from "../producto/producto.entity";

@Injectable()
export class ProductoCulturaService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>
    ){}



    async adicionarProductoCultura(productoId: number, culturaId: number): Promise<ProductoEntity> {
        const cultura = await this.culturaRepository.findOne({where: {codigo: culturaId}});
        if (!cultura)
            throw new BusinessLogicException("La cultura seleccionado no fue encontrada", BusinessError.NOT_FOUND);

        const producto = await this.productoRepository.findOne({where: {codigo: productoId}, relations: ["categoria", "culturas"]})
        if (!producto)
            throw new BusinessLogicException("El producto seleccionado no fue encontrado", BusinessError.NOT_FOUND);

        producto.culturas = [...producto.culturas, cultura];
        return await this.productoRepository.save(producto);
        }



    async buscarCulturaPorProductoIdCulturaId(culturaId: number, productoId: number): Promise<CulturaEntity> {
        const cultura = await this.culturaRepository.findOne({where: {codigo: culturaId}});
    if (!cultura)
        throw new BusinessLogicException("La cultura seleccionado no fue encontrada", BusinessError.NOT_FOUND)

    const producto = await this.productoRepository.findOne({where: {codigo: productoId}, relations: ["categoria", "culturas"]})
    if (!producto)
        throw new BusinessLogicException("El producto seleccionado no fue encontrado", BusinessError.NOT_FOUND)

    const productoCultura = producto.culturas.find(e => e.codigo === cultura.codigo);

    if (!productoCultura)
        throw new BusinessLogicException("El producto con el id proporcionado no está asociado  a la cultura.", BusinessError.PRECONDITION_FAILED)

    return productoCultura;
    }



    async buscarCulturaPorProductoId(productoId: number): Promise<CulturaEntity[]> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productoId}, relations: ["categoria", "culturas"]})
    if (!producto)
        throw new BusinessLogicException("El producto seleccionado no fue encontrado", BusinessError.NOT_FOUND)

    return producto.culturas.filter(p => p.constructor.name === "Cultura")
    }




    async asociacionProductoCultura(productoId: number, culturaDTO: CulturaDTO[]): Promise<ProductoEntity> {
        const producto = await this.productoRepository.findOne({where: {codigo: productoId}, relations: ["categoria", "culturas"]})

        if (!producto)
            throw new BusinessLogicException("El producto seleccionado no fue encontrado", BusinessError.NOT_FOUND)

        let culturas: CulturaEntity[] = [];

        for (let i = 0; i < CulturaDTO.length; i++) {
            const cultura = await this.culturaRepository.findOne({where: {codigo: culturaDTO[i].codigo}});
            if (!cultura)
                throw new BusinessLogicException("La cultura seleccionado no fue encontrada", BusinessError.NOT_FOUND)
            else
                culturas.push(cultura);
        }

        producto.culturas = culturas;
        return await this.productoRepository.save(producto);
    }

    async borrarCulturaDelProducto(culturaId: number, productoId: number): Promise<ProductoDTO> {
        const cultura = await this.culturaRepository.findOne({where: {codigo: culturaId}});
        if (!cultura)
            throw new BusinessLogicException("La cultura seleccionado no fue encontrada", BusinessError.NOT_FOUND)

        const producto = await this.productoRepository.findOne({where: {codigo: productoId}, relations: ["categoria", "culturas"]})
        if (!producto)
            throw new BusinessLogicException("El producto seleccionado no fue encontrado", BusinessError.NOT_FOUND)

        producto.culturas = producto.culturas.filter(e => e.codigo !== culturaId);
        return await this.productoRepository.save(producto);
    }
}
