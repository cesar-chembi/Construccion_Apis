import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PaisEntity} from "../pais/pais.entity";
import {Repository} from "typeorm";
import {RestauranteEntity} from "../restaurante/restaurante.entity";
import {CategoriaEntity} from "../categoria/categoria.entity";
import {ProductoEntity} from "../producto/producto.entity";
import {BusinessError, BusinessLogicException} from "../shared/errors/BusinessError";

@Injectable()
export class CategoriaProductoService {

    constructor(
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>,

        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ) {}

    async adicionarProductoCategoria(categoriaCodigo: number, productoCodigo: number): Promise<CategoriaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productoCodigo}});
        if (!producto)
            throw new BusinessLogicException("El producto no se encontró", BusinessError.NOT_FOUND);

        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo: categoriaCodigo}, relations: ["productos"]})
        if (!categoria)
            throw new BusinessLogicException("la Categoria no se encontró", BusinessError.NOT_FOUND);

        categoria.productos = [...categoria.productos, producto];
        return await this.categoriaRepository.save(categoria);
    }


    async buscarProductoXCategoriaCodigoProductoCodigo(categoriaCodigo: number, productoCodigo: number): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productoCodigo}});
        if (!producto)
            throw new BusinessLogicException("El producto no se encontró", BusinessError.NOT_FOUND)

        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo: categoriaCodigo}, relations: ["productos"]});
        if (!categoria)
            throw new BusinessLogicException("La categoria no se encontró", BusinessError.NOT_FOUND)

        const categoriaproducto: ProductoEntity = categoria.productos.find(e => e.codigo === producto.codigo);

        if (!categoriaproducto)
            throw new BusinessLogicException("El  producto asociado a la categoria no fue encontrado", BusinessError.PRECONDITION_FAILED)

        return categoriaproducto;
    }


    async buscarProductoXCategoriaCodigo(categoriaCodigo: number): Promise<ProductoEntity[]> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo: categoriaCodigo}, relations: ["productos"]});
        if (!categoria)
            throw new BusinessLogicException("La categoria no se encontró", BusinessError.NOT_FOUND)

        return categoria.productos;
    }


    async asociarProductosACategoria(categoriaCodigo: number, productos: ProductoEntity[]): Promise<CategoriaEntity> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo: categoriaCodigo}, relations: ["productos"]});

        if (!categoria)
            throw new BusinessLogicException("La categoria no se encontró", BusinessError.NOT_FOUND)

        for (let i = 0; i < productos.length; i++) {
            const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productos[i].codigo}});
            if (!producto)
                throw new BusinessLogicException("El producto no se encontró", BusinessError.NOT_FOUND)
        }

        categoria.productos = productos;
        return await this.categoriaRepository.save(categoria);
    }


    async borrarProductoDeCategoria(categoriaCodigo: number, productoCodigo: number){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productoCodigo}});
        if (!producto)
            throw new BusinessLogicException("El producto no se encontró", BusinessError.NOT_FOUND)

        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {codigo: categoriaCodigo}, relations: ["productos"]});
        if (!categoria)
            throw new BusinessLogicException("La categoria no se encontró", BusinessError.NOT_FOUND)

        const categoriaproducto: ProductoEntity = categoria.productos.find(e => e.codigo === producto.codigo);

        if (!categoriaproducto)
            throw new BusinessLogicException("El  producto que se desea borrar no esta asociado a la categoria", BusinessError.PRECONDITION_FAILED)

        categoria.productos = categoria.productos.filter(e => e.codigo !== productoCodigo);
        await this.categoriaRepository.save(categoria);
    }


}
