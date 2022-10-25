/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PaisService } from './pais.service';
import {PaisEntity} from "./pais.entity";
import {Repository} from "typeorm";
import { faker } from '@faker-js/faker';
import {getRepositoryToken} from "@nestjs/typeorm";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let paisList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    repository.clear();
    paisList = [];
    for(let i = 0; i < 5; i++){
      const pais: PaisEntity = await repository.save({
        codigo: i,
        nombre: faker.address.city(),
        capital: faker.address.city(),
        bandera: faker.image.imageUrl(),
        restaurantes: []})
      paisList.push(pais);
    }
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('findAll should return all paiss', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(paisList.length);
  });

  it('findOne should return a pais by id', async () => {
    const storedPais: PaisEntity = paisList[0];
    const pais: PaisEntity = await service.findOne(storedPais.codigo);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(storedPais.nombre)
    expect(pais.capital).toEqual(storedPais.capital)
    expect(pais.bandera).toEqual(storedPais.bandera)


  });

  it('findOne should throw an exception for an invalid pais', async () => {
    await expect(() => service.findOne(10)).rejects.toHaveProperty("message", "El país que consulta no existe")
  });

  it('create should return a new pais', async () => {
    const pais: PaisEntity = {
      codigo: 0,
      nombre: faker.address.city(),
      capital: faker.address.city(),
      bandera: faker.image.imageUrl(),
      restaurantes: [],
    }

    const newPais: PaisEntity = await service.create(pais);
    expect(newPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({where: {codigo: newPais.codigo}})
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(newPais.nombre)
    expect(storedPais.capital).toEqual(newPais.capital)
    expect(storedPais.bandera).toEqual(newPais.bandera)
  });

  it('update should modify a pais', async () => {
    const pais: PaisEntity = paisList[0];
    pais.nombre = "Nuevo nombre";
    pais.capital = "Nueva capital";
    pais.bandera = "Nueva bandera";

    const updatedPais: PaisEntity = await service.update(pais.codigo, pais);
    expect(updatedPais).not.toBeNull();

    const storedPais: PaisEntity = await repository.findOne({ where: { codigo: pais.codigo } })
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toEqual(pais.nombre)
    expect(storedPais.capital).toEqual(pais.capital)
  });

  it('update should throw an exception for an invalid pais', async () => {
    let pais: PaisEntity = paisList[0];
    pais = {
      ...pais, nombre: "New name", capital: "New address"
    }
    await expect(() => service.update(10, pais)).rejects.toHaveProperty("message", "El país que actualiza no existe")
  });

  it('delete should remove a pais', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.codigo);

    const deletedpais: PaisEntity = await repository.findOne({ where: { codigo: pais.codigo } })
    expect(deletedpais).toBeNull();
  });

  it('delete should throw an exception for an invalid pais', async () => {
    const pais: PaisEntity = paisList[0];
    await service.delete(pais.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El país que borra no existe")
  });
});
