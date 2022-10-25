/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';

import { faker } from '@faker-js/faker';
import {CategoriaEntity} from "../categoria/categoria.entity";

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
      const producto: ProductoEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()})
      productosList.push(producto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería devolver todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productosList.length);
  });

  it('findOne debería devolver el producto por el codigo', async () => {
    const storedProducto: ProductoEntity = productosList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.codigo);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre)
    expect(producto.descripcion).toEqual(storedProducto.descripcion)
    expect(producto.historia).toEqual(storedProducto.historia)
  });

  it('findOne debería lanzar una excepcion para un producto invalido', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El producto con este identificador no fue encontrado")
  });

  it('create deberia retornar un nuevo producto', async () => {


    const categoria: CategoriaEntity = new CategoriaEntity();


    const producto: ProductoEntity = {
      codigo: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      historia: faker.address.secondaryAddress(),
      categoria: null,
      culturas: []

    }

    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({where: {codigo: newProducto.codigo}})
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre)
    expect(storedProducto.descripcion).toEqual(newProducto.descripcion)
    expect(storedProducto.historia).toEqual(newProducto.historia)

  });

  it('update deberia modificar un nuevo producto', async () => {
    const producto: ProductoEntity = productosList[0];
    producto.nombre = "New nombre";
    producto.descripcion = "New descripcion";

    const updatedProducto: ProductoEntity = await service.update(producto.codigo, producto);
    expect(updatedProducto).not.toBeNull();

    const storedProducto: ProductoEntity = await repository.findOne({ where: { codigo: producto.codigo } })
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre)
    expect(storedProducto.descripcion).toEqual(producto.descripcion)
  });

  it('update debería lanzar una excepcion para un producto invalido', async () => {
    let producto: ProductoEntity = productosList[0];
    producto = {
      ...producto, nombre: "New nombre", descripcion: "New descripcion"
    }
    await expect(() => service.update(0, producto)).rejects.toHaveProperty("message", "El producto con este identificador no fue encontrado")
  });

  it('delete deberia remover un producto', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.codigo);

    const deletedProducto: ProductoEntity = await repository.findOne({ where: { codigo: producto.codigo } })
    expect(deletedProducto).toBeNull();
  });

  it('delete debería lanzar una excepcion para un producto invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    await service.delete(producto.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El producto con este identificador no fue encontrado")
  });

});
