import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PremioMichelinEntity } from './premio-michelin.entity';
import { PremioMichelinService } from './premio-michelin.service';
import { faker } from '@faker-js/faker';

describe('PremioMichelinService', () => {
  let service: PremioMichelinService;
  let repository: Repository<PremioMichelinEntity>;
  let premiosMichelinList: PremioMichelinEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports : [...TypeOrmTestingConfig()],
      providers: [PremioMichelinService],
    }).compile();

    service = module.get<PremioMichelinService>(PremioMichelinService);
    repository = module.get<Repository<PremioMichelinEntity>>(getRepositoryToken(PremioMichelinEntity));
    await seedDatabase();

  });
  const seedDatabase = async () => {
    repository.clear();
    premiosMichelinList = [];
    for(let i = 0; i < 5; i++){
      const premio: PremioMichelinEntity = await repository.save({fechaConsecucion: faker.date.recent()});
      premiosMichelinList.push(premio);
    }
  }

  it('findAll Debera retornar todos los premios', async () => {
    const premios: PremioMichelinEntity[] = await service.findAll();
    expect(premios).not.toBeNull();
    expect(premios).toHaveLength(premiosMichelinList.length);
  });

  it('findOne debera retornar un premio por codigo', async () => {
    const premioAlmacenado: PremioMichelinEntity = premiosMichelinList[0];
    const premio: PremioMichelinEntity = await service.findOne(premioAlmacenado.codigo);
    expect(premio).not.toBeNull();
    expect(premio.fechaConsecucion).toEqual(premioAlmacenado.fechaConsecucion)
  });

  it('findOne debera retornar una excepcion por premio no encontrado', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty("message", "El premio michelin con este codigo no fue encontrado")
  });

  it('create debera retornar un nuevo premio', async () => {
    const premio: PremioMichelinEntity = await repository.save( {
      codigo: 1,
      fechaConsecucion: faker.date.recent()
    })
 
    const nuevoPremio: PremioMichelinEntity = await service.create(premio);
    expect(nuevoPremio).not.toBeNull();
 
    const premioAlmacenado: PremioMichelinEntity = await repository.findOne({where: {codigo: nuevoPremio.codigo}})
    expect(premioAlmacenado).not.toBeNull();
    expect(premioAlmacenado.fechaConsecucion).toEqual(nuevoPremio.fechaConsecucion)
  });

  it('update debera modificar un premio', async () => {
    const premio: PremioMichelinEntity = premiosMichelinList[0];
    premio.fechaConsecucion = faker.date.recent();
    const premioActualizado: PremioMichelinEntity = await service.update(premio.codigo, premio);
    expect(premioActualizado).not.toBeNull();
    const premioAlmacenado: PremioMichelinEntity = await repository.findOne({ where: { codigo: premio.codigo } })
    expect(premioAlmacenado).not.toBeNull();
  });

  it('update debe lanzar un error al ser invalido', async () => {
    let premio: PremioMichelinEntity = premiosMichelinList[0];
    premio = {
      ...premio, fechaConsecucion: faker.date.recent()
    }
    await expect(() => service.update(0, premio)).rejects.toHaveProperty("message", "El premio michelin con este codigo no fue encontrado")
  });

  it('delete Debe eliminar un premio', async () => {
    const premio: PremioMichelinEntity = premiosMichelinList[0];
    await service.delete(premio.codigo);
     const premioEliminado: PremioMichelinEntity = await repository.findOne({ where: { codigo: premio.codigo } })
    expect(premioEliminado).toBeNull();
  });

  it('delete debera lanzar excepcion al ser codigo invalido', async () => {
    const premio: PremioMichelinEntity = premiosMichelinList[0];
    await service.delete(premio.codigo);
    await expect(() => service.delete(0)).rejects.toHaveProperty("message", "El premio michelin con este codigo no fue encontrado")
  });

});
