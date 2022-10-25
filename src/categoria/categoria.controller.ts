import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { CategoriaDTO } from './categoria.dto';
import {CategoriaService} from './categoria.service';


@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Get()
    async findAll() {
        return await this.categoriaService.findAll();
    }

    @Get(':categoriaId')
    async findOne(@Param('categoriaId') categoriaId: number) {
        return await this.categoriaService.findOne(categoriaId);
    }

    @Post()
    @HttpCode(200)
    async create(@Body() categoriaDTO: CategoriaDTO) {
        return await this.categoriaService.create(categoriaDTO);
    }



    @Put(':categoriaId')
    async update(@Param('categoriaId') categoriaId: number, @Body() categoriaDTO: CategoriaDTO) {
        return await this.categoriaService.update(categoriaId, categoriaDTO);
    }


    @Delete(':categoriaId')
    @HttpCode(204)
    async delete(@Param('categoriaId') categoriaId: number) {
        return await this.categoriaService.delete(categoriaId);
    }


}
