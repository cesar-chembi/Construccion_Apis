import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm/repository/Repository';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let recetasList: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();

  });
  const seedDatabase = async () => {
    repository.clear();
    recetasList = [];
    for(let i = 0; i < 5; i++){
      const receta: RecetaEntity = await repository.save({
          nombre: faker.lorem.sentence(),
          descripcion: faker.lorem.paragraph(),
          urlFoto: faker.image.imageUrl(),
          procesoPrep: faker.lorem.paragraph(),
          urlVideo: faker.image.imageUrl()
        });
      recetasList.push(receta);
    }
  }

  it('findAll Debera retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(recetasList.length);
  });

  it('findOne debera retornar una receta por codigo', async () => {
    const recetaAlmacenada: RecetaEntity = recetasList[0];
    const receta: RecetaEntity = await service.findOne(recetaAlmacenada.codigo);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(recetaAlmacenada.nombre)
    expect(receta.descripcion).toEqual(recetaAlmacenada.descripcion)
    expect(receta.urlFoto).toEqual(recetaAlmacenada.urlFoto)
    expect(receta.procesoPrep).toEqual(recetaAlmacenada.procesoPrep)
    expect(receta.urlVideo).toEqual(recetaAlmacenada.urlVideo)


  });

  it('findOne debera retornar una excepcion por receta no encontrada', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "La receta con este codigo no fue encontrado")
  });

  it('create debera retornar una nueva receta', async () => {
    const receta: RecetaEntity =   await repository.save( {
      codigo: 1,
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      urlFoto: faker.image.imageUrl(),
      procesoPrep: faker.lorem.paragraph(),
      urlVideo: faker.image.imageUrl()
    })
 
    const nuevaReceta: RecetaEntity = await service.create(receta);
    expect(nuevaReceta).not.toBeNull();
 
    const recetaAlmacenada: RecetaEntity = await repository.findOne({where: {codigo: nuevaReceta.codigo}})
    expect(recetaAlmacenada).not.toBeNull();
    expect(recetaAlmacenada.nombre).toEqual(nuevaReceta.nombre)
    expect(recetaAlmacenada.descripcion).toEqual(nuevaReceta.descripcion)
    expect(recetaAlmacenada.urlFoto).toEqual(nuevaReceta.urlFoto)
    expect(recetaAlmacenada.procesoPrep).toEqual(nuevaReceta.procesoPrep)
    expect(recetaAlmacenada.urlVideo).toEqual(nuevaReceta.urlVideo)  });

  it('update debera modificar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    receta.nombre = faker.lorem.sentence();
    const recetaActualizada: RecetaEntity = await service.update(receta.codigo, receta);
    expect(recetaActualizada).not.toBeNull();
    const recetaAlmacenada: RecetaEntity = await repository.findOne({ where: { codigo: receta.codigo } })
    expect(recetaAlmacenada.nombre).toEqual(receta.nombre)
  });

  it('update debe lanzar un error al ser invalida', async () => {
    let receta: RecetaEntity = recetasList[0];
    receta = {
      ...receta, nombre: "Nuevo nombre"
    }
    await expect(() => service.update(0, receta)).rejects.toHaveProperty("message", "La receta con este codigo no fue encontrado")
  });

  it('delete Debe eliminar una receta', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.codigo);
     const recetaEliminada: RecetaEntity = await repository.findOne({ where: { codigo: receta.codigo } })
    expect(recetaEliminada).toBeNull();
  });

  it('delete debera lanzar excepcion al ser codigo invalido', async () => {
    const receta: RecetaEntity = recetasList[0];
    await service.delete(receta.codigo)
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "La receta con este codigo no fue encontrado")
  });

});
