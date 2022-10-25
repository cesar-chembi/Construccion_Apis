import { Test, TestingModule } from '@nestjs/testing';
import { CulturaRecetaService } from './cultura-receta.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaEntity } from '../cultura/cultura.entity';


describe('CulturaRecetaService', () => {
  let service: CulturaRecetaService
  let recetaRepository:Repository<RecetaEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let cultura: CulturaEntity;
  let recetasList: RecetaEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRecetaService],
    }).compile();

    service = module.get<CulturaRecetaService>(CulturaRecetaService);
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));
    recetaRepository =  module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaRepository.clear();
 
    recetasList = [];
    for(let i = 0; i < 5; i++){
        const receta: RecetaEntity = await recetaRepository.save({
          nombre: faker.name.firstName(),
          descripcion: faker.lorem.paragraph(),
          urlFoto: faker.image.business(),
          procesoPrep: faker.lorem.paragraph(),
          urlVideo: faker.image.animals()
        })
        recetasList.push(receta);
    }
 
    cultura = await culturaRepository.save({
      nombre: faker.name.firstName(),
      descripcion: faker.lorem.paragraph(),
      urlFoto: faker.image.business(),
      procesoPrep: faker.lorem.paragraph(),
      urlVideo: faker.image.animals(),
      recetas: recetasList})
      }

      it('addRecetaCultura debe agregar un receta a una cultura', async () => {
        const newReceta: RecetaEntity = await recetaRepository.save({
          nombre: faker.name.firstName(),
          descripcion: faker.lorem.paragraph(),
          urlFoto: faker.image.business(),
          procesoPrep: faker.lorem.paragraph(),
          urlVideo: faker.image.animals()
        });
     
        const newCultura: CulturaEntity = await culturaRepository.save({
          codigo: 1, 
          nombre: faker.name.firstName(), 
          nombreCiudad: faker.name.jobArea(), 
          recetas: recetasList})
        
     
        const result: CulturaEntity = await service.addRecetaCultura(newCultura.codigo, newReceta.codigo);
       
        expect(result.recetas.length).toBe(6);
        expect(result.recetas[5]).not.toBeNull();
        });

        it('addRecetaCultura debe lanzar excepcion al no encontrar receta', async () => {
          const newCultura: CulturaEntity = await culturaRepository.save({
            codigo: 1, 
            nombre: faker.name.firstName(), 
            nombreCiudad: faker.name.jobArea(), 
            recetas: recetasList})
      
          await expect(() => service.addRecetaCultura(newCultura.codigo, 0)).rejects.toHaveProperty("message", "La receta con este codigo, no fue encontrado");
        });

        it('addRecetaCultura debe lanzar excepcion al no encontrar cultura', async () => {
          const newReceta: RecetaEntity = await recetaRepository.save({
            nombre: faker.name.firstName(),
            descripcion: faker.lorem.paragraph(),
            urlFoto: faker.image.business(),
            procesoPrep: faker.lorem.paragraph(),
            urlVideo: faker.image.animals()
          });
          await expect(() => service.addRecetaCultura(0, newReceta.codigo)).rejects.toHaveProperty("message", "Cultura gastronomica no encontrada, identificador de cultura invalido");
        });

        it('findrecetasByCulturaId debe retornar recetas por una cultura', async () => {
          const recetas: RecetaEntity[] = await service.findrecetasByCulturaId(cultura.codigo);
          expect(recetas.length).toBe(5)
        });

        it('findrecetasByCulturaId retorna excepcion por cultura invalido', async () => {
          await expect(()=> service.findrecetasByCulturaId(0)).rejects.toHaveProperty("message", "La receta con este codigo, no fue encontrado"); 
        });
});
