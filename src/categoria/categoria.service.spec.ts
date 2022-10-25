/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

import { faker } from '@faker-js/faker';
import {ProductoEntity} from "../producto/producto.entity";

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;
  let categoriasList: CategoriaEntity[];



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaService],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoriasList = [];
    for(let i = 0; i < 5; i++){
      const categoria: CategoriaEntity = await repository.save({
        nombre: faker.company.name()
      })
      categoriasList.push(categoria);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debería devolver todas las categorias', async () => {
    const categorias: CategoriaEntity[] = await service.findAll();
    expect(categorias).not.toBeNull();
    expect(categorias).toHaveLength(categoriasList.length);
  });

  it('findOne debería devolver una categoria por el codigo', async () => {
    const storedCategoria: CategoriaEntity = categoriasList[0];
    const categoria: CategoriaEntity = await service.findOne(storedCategoria.codigo);
    expect(categoria).not.toBeNull();
    expect(categoria.nombre).toEqual(storedCategoria.nombre)

  });

  it('findOne debería lanzar una excepcion para una categoria invalida ', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "La categoria con este identificador no fue encontrada")
  });

  it('create deberia retornar una nueva categoria', async () => {
    const categoria: CategoriaEntity = {
      codigo: 0,
      nombre: faker.company.name(),
      productos: ProductoEntity[0]

    }

    const newCategoria: CategoriaEntity = await service.create(categoria);
    expect(newCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({where: {codigo: newCategoria.codigo}})
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(newCategoria.nombre)
  });

  it('update deberia modificar una nueva categoria', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    categoria.nombre = "New nombre";


    const updatedCategoria: CategoriaEntity = await service.update(categoria.codigo, categoria);
    expect(updatedCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({ where: { codigo: categoria.codigo } })
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(categoria.nombre)

  });

  it('update debería lanzar una excepcion para una categoria invalida', async () => {
    let categoria: CategoriaEntity = categoriasList[0];
    categoria = {
      ...categoria, nombre: "New nombre"
    }
    await expect(() => service.update(0, categoria)).rejects.toHaveProperty("message", "La categoria con este identificador no fue encontrada")
  });

  it('delete  deberia remover una categoria', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.codigo);

    const deletedCategoria: CategoriaEntity = await repository.findOne({ where: { codigo: categoria.codigo } })
    expect(deletedCategoria).toBeNull();
  });

  it('delete debería lanzar una excepcion para una categoria invalida', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "La categoria con este identificador no fue encontrada")
  });

});
