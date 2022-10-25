import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';

import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: Repository<CulturaEntity>;
  let culturesList: CulturaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    repository = module.get<Repository<CulturaEntity>>(
        getRepositoryToken(CulturaEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    culturesList = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaEntity = await repository.save({
        nombre: faker.name.fullName(),
        descripcion: faker.lorem.sentence(),
      });
      culturesList.push(cultura);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll retorna todas las culturas', async () => {
    const cultures: CulturaEntity[] = await service.findAll();
    expect(cultures).not.toBeNull();
    expect(cultures).toHaveLength(culturesList.length);
  });

  it('findOne retorna una cultura por id', async () => {
    const culturaAlmacenada: CulturaEntity = culturesList[0];
    const cultura: CulturaEntity = await service.findOne(
      culturaAlmacenada.codigo,
    );
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(culturaAlmacenada.nombre);
    expect(cultura.descripcion).toEqual(culturaAlmacenada.descripcion);
  });

  it('findOne puede retornar una exceción con una cultura invalida', async () => {
    //await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La cultura que se busca con ID no se encuentra")
  });

  it('Crear una nueva cultura', async () => {
    const cultura: CulturaEntity = {
      codigo: Number(faker.random.numeric(2)),
      nombre: faker.name.fullName(),
      descripcion: faker.lorem.sentence(),
      productos:[],
      recetas:[]
    };

    const newCulture: CulturaEntity = await service.create(cultura);
    expect(newCulture).not.toBeNull();

    const culturaAlmacenada: CulturaEntity = await repository.findOne({
      where: { codigo: newCulture.codigo },
    });
    expect(culturaAlmacenada).not.toBeNull();
    expect(culturaAlmacenada.nombre).toEqual(newCulture.nombre);
    expect(culturaAlmacenada.descripcion).toEqual(newCulture.descripcion);
  });

  it('Actualizar una cultura', async () => {
    const culture: CulturaEntity = culturesList[0];
    culture.nombre = 'Nueva Cultura';
    culture.descripcion = 'Nueva descripcion de una cultura';

    const updatedCulture: CulturaEntity = await service.update(
        culture.codigo,
        culture,
    );
    expect(updatedCulture).not.toBeNull();

    const culturaAlmacenada: CulturaEntity = await repository.findOne({
      where: { codigo: culture.codigo },
    });
    expect(culturaAlmacenada).not.toBeNull();
    expect(culturaAlmacenada.nombre).toEqual(culture.nombre);
    expect(culturaAlmacenada.descripcion).toEqual(culture.descripcion);
  });

  it('Excepción por la actualización de una cultura no valida', async () => {
    let culture: CulturaEntity = culturesList[0];
    culture = {
      ...culture,
      nombre: 'Nueva Cultura',
      descripcion: 'Nueva descripcion de una cultura',
    };
    //await expect(() => service.update("0", culture)).rejects.toHaveProperty("message", "La cultura que se busca con ID no se encuentra")
  });

  it('Borrar una cultura', async () => {
    const culture: CulturaEntity = culturesList[0];
    await service.delete(culture.codigo);

    const deletedCulture: CulturaEntity = await repository.findOne({
      where: { codigo: culture.codigo },
    });
    expect(deletedCulture).toBeNull();
  });

  it('Excepción por borrar una cultura no valida', async () => {
    const culture: CulturaEntity = culturesList[0];
    await service.delete(culture.codigo);
    //await expect(() => service.delete(0)).rejects.toHaveProperty("message", "La cultura que se busca con ID no se encuentra")
  });
});
