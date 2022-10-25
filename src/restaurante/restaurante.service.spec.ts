/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import {Repository} from "typeorm";
import {RestauranteEntity} from "../restaurante/restaurante.entity";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import {getRepositoryToken} from "@nestjs/typeorm";
import {faker} from "@faker-js/faker";
import {PaisEntity} from "../pais/pais.entity";

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let restauranteList: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    restauranteList = [];
    for(let i = 0; i < 5; i++){
      const restaurante: RestauranteEntity = await repository.save({
        codigo: i,
        nombre: faker.address.city(),
        nombreCiudad : faker.address.city(),
        pais: null})
      restauranteList.push(restaurante);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all restaurantes', async () => {
    const restaurantees: RestauranteEntity[] = await service.findAll();
    expect(restaurantees).not.toBeNull();
    expect(restaurantees).toHaveLength(restauranteList.length);
  });

  it('findOne should return a restaurante by id', async () => {
    const storedrestaurante: RestauranteEntity = restauranteList[0];
    const restaurante: RestauranteEntity = await service.findOne(storedrestaurante.codigo);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(storedrestaurante.nombre)


  });

  it('findOne should throw an exception for an invalid restaurante', async () => {
    await expect(() => service.findOne(10)).rejects.toHaveProperty("message", "El recurso solicitado no se encontró")
  });
/*
  it('create should return a new restaurante', async () => {
    const elPais: PaisEntity = {
      codigo: 0,
      nombre: faker.address.city(),
      capital: faker.address.city(),
      bandera: faker.image.imageUrl(),
      restaurantes: [],
    }

    const restaurante: RestauranteEntity = {
      codigo: 0,
      nombre: faker.address.city(),
      nombreCiudad: faker.address.city(),
      pais: elPais
    }

    const newrestaurante: RestauranteEntity = await service.create(restaurante);
    expect(newrestaurante).not.toBeNull();

    const storedrestaurante: RestauranteEntity = await repository.findOne({where: {codigo: newrestaurante.codigo}})
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toEqual(newrestaurante.nombre)
    expect(storedrestaurante.nombreCiudad).toEqual(newrestaurante.nombreCiudad)

  });
*/
  it('update should modify a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    restaurante.nombre = "Nuevo nombre";
    restaurante.nombreCiudad = "Nueva ciudad";

    const updatedrestaurante: RestauranteEntity = await service.update(restaurante.codigo, restaurante);
    expect(updatedrestaurante).not.toBeNull();

    const storedrestaurante: RestauranteEntity = await repository.findOne({ where: { codigo: restaurante.codigo } })
    expect(storedrestaurante).not.toBeNull();
    expect(storedrestaurante.nombre).toEqual(restaurante.nombre)
    expect(storedrestaurante.nombreCiudad).toEqual(restaurante.nombreCiudad)
  });

  it('update should throw an exception for an invalid restaurante', async () => {
    let restaurante: RestauranteEntity = restauranteList[10];
    restaurante = {
      ...restaurante, nombre: "New name", nombreCiudad: "New address"
    }
    await expect(() => service.update(10, restaurante)).rejects.toHaveProperty("message", "El recurso solicitado no existe")
  });

  it('delete should remove a restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.codigo);

    const deletedrestaurante: RestauranteEntity = await repository.findOne({ where: { codigo: restaurante.codigo } })
    expect(deletedrestaurante).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurante', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await service.delete(restaurante.codigo);
    await expect(() => service.delete(10)).rejects.toHaveProperty("message", "El recurso solicitado no existe")
  });
});
