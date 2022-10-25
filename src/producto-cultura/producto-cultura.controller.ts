/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/interceptors/interceptor';
import { CulturaDTO } from 'src/cultura/cultura.dto';
import { ProductoCulturaService } from './producto-cultura.service';

@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoCulturaController {
  constructor(private readonly productoCulturaService: ProductoCulturaService) {}

  @Get(':productoId/culturas/:culturaId')
  async buscarCulturaPorProductoIdCulturaId(@Param('culturaId') culturaId: number, @Param('productoId') productoId: number) {
    return await this.productoCulturaService.buscarCulturaPorProductoIdCulturaId(culturaId, productoId);
  }

  @Get(':productoId/culturas')
  async buscarCulturaPorProductoId(@Param('productoId') productoId: number) {
    return await this.productoCulturaService.buscarCulturaPorProductoId(productoId);
  }

  @Post(':productoId/culturas/:culturaId/')
  @HttpCode(200)
  async adicionarProductoCultura(@Param('culturaId') culturaId: number, @Param('productoId') productoId: number) {
    return await this.productoCulturaService.adicionarProductoCultura(productoId, culturaId);
  }

  @Put(':artistId/movements')
  async asociacionProductoCultura(@Param('productoId') productoId: number, @Body() culturaDTO: CulturaDTO[]) {
    return await this.productoCulturaService.asociacionProductoCultura(productoId, culturaDTO);
  }

  @Delete(':artistId/movements/:movementId')
  @HttpCode(204)
  async borrarCulturaDelProducto(@Param('culturaId') culturaId: number, @Param('productoId') productoId: number) {
    return await this.productoCulturaService.borrarCulturaDelProducto(culturaId, productoId);
  }
}
