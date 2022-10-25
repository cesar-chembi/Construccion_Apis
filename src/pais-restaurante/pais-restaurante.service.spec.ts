/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PaisRestauranteService } from './pais-restaurante.service';
import {PaisEntity} from "../pais/pais.entity";
import {RestauranteEntity} from "../restaurante/restaurante.entity";
import {Repository} from "typeorm";
import { faker } from '@faker-js/faker';
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import {getRepositoryToken} from "@nestjs/typeorm";

describe('PaisRestauranteService', () => {
  let service: PaisRestauranteService;

  let paisRepository: Repository<PaisEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let pais: PaisEntity;
  let restauranteList : RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisRestauranteService],
    }).compile();

    service = module.get<PaisRestauranteService>(PaisRestauranteService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });


  const seedDatabase = async () => {
    restauranteRepository.clear();
    paisRepository.clear();

    restauranteList = [];
    for(let i = 0; i < 5; i++){
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        nombreCiudad : faker.address.city()
      })
      restauranteList.push(restaurante);
    }

    pais = await paisRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      capital: faker.address.city(),
      bandera: faker.image.imageUrl(),
      restaurantes:  restauranteList
    })
  }
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('add restaurantePais  should add an restaurante to a pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    const newPais: PaisEntity = await paisRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      capital: faker.address.city(),
      bandera: faker.image.imageUrl(),
    })

    const otroPais: PaisEntity = await service.adicionarRestaurantePais(newPais.codigo, newRestaurante.codigo);

    expect(otroPais.restaurantes.length).toBe(1);
    console.log(otroPais.restaurantes.length)
    expect(otroPais.restaurantes[0]).not.toBeNull();
    expect(otroPais.restaurantes[0].codigo).toBe(newRestaurante.codigo)
    expect(otroPais.restaurantes[0].nombre).toBe(newRestaurante.nombre)
    expect(otroPais.restaurantes[0].nombreCiudad).toBe(newRestaurante.nombreCiudad)

  });

  it('add restaurantePais should thrown exception for an invalid restaurante', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      capital: faker.address.city(),
      bandera: faker.image.imageUrl(),
    })

    await expect(() => service.adicionarRestaurantePais(newPais.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El restaurante no se encontró");
  });

  it('addrestaurantePais should throw an exception for an invalid Pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    await expect(() => service.adicionarRestaurantePais(faker.datatype.number(), newRestaurante.codigo)).rejects.toHaveProperty("message", "El pais no se encontró");
  });

  it('findrestauranteByPaisIdrestauranteId should return restaurante by Pais', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    const restauranteModif: RestauranteEntity = await service.buscarRestauranteXPaisCodigoRestauranteCodigo(pais.codigo, restaurante.codigo, )
    expect(restauranteModif).not.toBeNull();
    expect(restauranteModif.codigo).toBe(restaurante.codigo);
    expect(restauranteModif.nombre).toBe(restaurante.nombre);
    expect(restauranteModif.nombreCiudad).toBe(restaurante.nombreCiudad);
  });

  it('findrestauranteByPaisIdrestauranteId should throw an exception for an invalid restaurante', async () => {
    await expect(()=> service.buscarRestauranteXPaisCodigoRestauranteCodigo(pais.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El restaurante no se encontró");
  });

  it('findrestauranteByPaisIdrestauranteId should throw an exception for an invalid Pais', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.buscarRestauranteXPaisCodigoRestauranteCodigo(faker.datatype.number(), restaurante.codigo)).rejects.toHaveProperty("message", "El pais no se encontró");
  });

  it('findrestauranteByPaisIdrestauranteId should throw an exception for an restaurante not associated to the Pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    await expect(()=> service.buscarRestauranteXPaisCodigoRestauranteCodigo(pais.codigo, newRestaurante.codigo)).rejects.toHaveProperty("message", "El  restaurante que se desea borrar no esta asociado al pais");
  });

  it('findrestaurantesByPaisId should return restaurantes by Pais', async ()=>{
    const restaurantes: RestauranteEntity[] = await service.buscarRestaurantesXPaisCodigo(pais.codigo);
    expect(restaurantes.length).toBe(5)
  });

  it('findrestaurantesByPaisId should throw an exception for an invalid Pais', async () => {
    await expect(()=> service.buscarRestaurantesXPaisCodigo(faker.datatype.number())).rejects.toHaveProperty("message", "El pais no se encontró");
  });

  it('associaterestaurantesPais should update restaurantes list for a Pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    const paisModificado: PaisEntity = await service.asociarRestaurantesPais(pais.codigo, [newRestaurante]);
    expect(paisModificado.restaurantes.length).toBe(1);

    expect(paisModificado.restaurantes[0].codigo).toBe(newRestaurante.codigo);
    expect(paisModificado.restaurantes[0].nombre).toBe(newRestaurante.nombre);
    expect(paisModificado.restaurantes[0].nombreCiudad).toBe(newRestaurante.nombreCiudad);
  });

  it('associaterestaurantesPais should throw an exception for an invalid Pais', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    await expect(()=> service.asociarRestaurantesPais(faker.datatype.number(), [newRestaurante])).rejects.toHaveProperty("message", "El pais no se encontró");
  });

  it('associaterestaurantesPais should throw an exception for an invalid restaurante', async () => {
    const newRestaurante: RestauranteEntity = restauranteList[0];
    newRestaurante.codigo = faker.datatype.number();

    await expect(()=> service.asociarRestaurantesPais(pais.codigo, [newRestaurante])).rejects.toHaveProperty("message", "El restaurante no se encontró");
  });

  it('deleterestauranteToPais should remove an restaurante from a Pais', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];

    await service.borrarRestaurantePais(pais.codigo, restaurante.codigo);

    const storedPais: PaisEntity = await paisRepository.findOne({where: {codigo: pais.codigo}, relations: ["restaurantes"]});
    const deletedrestaurante: RestauranteEntity = storedPais.restaurantes.find(a => a.codigo === restaurante.codigo);

    expect(deletedrestaurante).toBeUndefined();

  });

  it('deleterestauranteToPais should thrown an exception for an invalid restaurante', async () => {
    await expect(()=> service.borrarRestaurantePais(pais.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El restaurante no se encontró");
  });

  it('deleterestauranteToPais should thrown an exception for an invalid Pais', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.borrarRestaurantePais(faker.datatype.number(), restaurante.codigo)).rejects.toHaveProperty("message", "El pais no se encontró");
  });

  it('deleterestauranteToPais should thrown an exception for an non asocciated restaurante', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      nombreCiudad : faker.address.city()
    });

    await expect(()=> service.borrarRestaurantePais(pais.codigo, newRestaurante.codigo)).rejects.toHaveProperty("message", "El  restaurante que se desea borrar no esta asociado al pais");
  });

});
