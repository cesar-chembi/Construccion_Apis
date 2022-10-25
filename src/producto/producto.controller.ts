import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { ProductoDTO } from './producto.dto';
import {ProductoService} from "./producto.service";
import {ProductoEntity} from "./producto.entity";


@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoDTOController {
    constructor(private readonly productoService: ProductoService) {}

    @Get()
    async findAll() {
        return await this.productoService.findAll();
    }

    @Get(':productoId')
    async findOne(@Param('productoId') productoId: number) {
        return await this.productoService.findOne(productoId);
    }


    @Post()
    @HttpCode(200)
    async create(@Body() productoDTO: ProductoDTO) {
        return await this.productoService.create(productoDTO);
    }



    @Put(':productoId')
    async update(@Param('productoId') productoId: number, @Body() productoDTO: ProductoDTO) {
        return await this.productoService.update(productoId, productoDTO);
    }


    @Delete(':productoId')
    @HttpCode(204)
    async delete(@Param('productoId') productoId: number) {
        return await this.productoService.delete(productoId);
    }
}
