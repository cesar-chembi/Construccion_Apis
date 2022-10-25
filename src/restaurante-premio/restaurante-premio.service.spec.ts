import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantePremioService } from './restaurante-premio.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PremioMichelinEntity } from '../premio-michelin/premio-michelin.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';


describe('RestaurantePremioService', () => {
  let service: RestaurantePremioService
  let premioRepository:Repository<PremioMichelinEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let restaurante: RestauranteEntity;
  let premiosMichelinList: PremioMichelinEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantePremioService],
    }).compile();

    service = module.get<RestaurantePremioService>(RestaurantePremioService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    premioRepository =  module.get<Repository<PremioMichelinEntity>>(getRepositoryToken(PremioMichelinEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    premioRepository.clear();
    restauranteRepository.clear();
 
    premiosMichelinList = [];
    for(let i = 0; i < 5; i++){
        const premio: PremioMichelinEntity = await premioRepository.save({
          fechaConsecucion: faker.date.recent()
        })
        premiosMichelinList.push(premio);
    }
 
    restaurante = await restauranteRepository.save({
      codigo: 1, 
      nombre: faker.name.firstName(), 
      nombreCiudad: faker.name.jobArea(),
      premiosMicheline: premiosMichelinList})
      }

      it('addPremioRestaurante debe agregar un premio a un restaurante', async () => {
        const newPremio: PremioMichelinEntity = await premioRepository.save({
          fechaConsecucion: faker.date.recent()
        });
     
        const newRestaurante: RestauranteEntity = await restauranteRepository.save({
          codigo: 1, 
          nombre: faker.name.firstName(), 
          nombreCiudad: faker.name.jobArea(), 
          premiosMicheline: premiosMichelinList})
        
     
        const result: RestauranteEntity = await service.addPremioRestaurante(newRestaurante.codigo, newPremio.codigo);
       
        expect(result.premiosMicheline.length).toBe(6);
        expect(result.premiosMicheline[5]).not.toBeNull();
        });

        it('addPremioRestaurante debe lanzar excepcion al no encontrar premio', async () => {
          const newRestaurante: RestauranteEntity = await restauranteRepository.save({
            codigo: 1, 
            nombre: faker.name.firstName(), 
            nombreCiudad: faker.name.jobArea(), 
            premiosMicheline: premiosMichelinList})
      
          await expect(() => service.addPremioRestaurante(newRestaurante.codigo, 0)).rejects.toHaveProperty("message", "Premio, no encontrado, debe agregarlo antes");
        });

        it('addPremioRestaurante debe lanzar excepcion al no encontrar restaurante', async () => {
          const newPremio: PremioMichelinEntity = await premioRepository.save({
            fechaConsecucion: faker.date.recent()
          });
          await expect(() => service.addPremioRestaurante(0, newPremio.codigo)).rejects.toHaveProperty("message", "Restaurante no encontrado o identificador de restaurante invalido");
        });

        it('findPremiosByRestauranteId debe retornar premios por un restaurante', async () => {
          const premios: PremioMichelinEntity[] = await service.findPremiosByRestauranteId(restaurante.codigo);
          expect(premios.length).toBe(5)
        });

        it('findPremiosByRestauranteId retorna excepcion por restaurante invalido', async () => {
          await expect(()=> service.findPremiosByRestauranteId(0)).rejects.toHaveProperty("message", "Premios michelin no encontrados, restaurante invalido"); 
        });
});
