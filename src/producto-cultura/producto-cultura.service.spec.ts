/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {ProductoCulturaService} from "./producto-cultura.service";
import {CulturaEntity} from "../cultura/cultura.entity";
import {ProductoEntity} from "../producto/producto.entity";
import {CategoriaEntity} from "../categoria/categoria.entity";

describe('ProductoCulturaService', () => {
  let service: ProductoCulturaService;
  let productoRepository: Repository<ProductoEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let productosList: ProductoEntity[];
  let cultura: CulturaEntity;
  let producto: ProductoEntity;
  let culturaList : CulturaEntity[];
  let categoria : CategoriaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoCulturaService],
    }).compile();

    service = module.get<ProductoCulturaService>(ProductoCulturaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    productoRepository.clear();
    culturaRepository.clear();
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        historia: faker.lorem.sentence()})
      productosList.push(producto);
    }


    cultura = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion: faker.address.city()
    })
  }


  it('add productoCultura  should add an cultura to a producto', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
      categoria : null,
      culturas: []

    })

    const otroProducto: ProductoEntity = await service.adicionarProductoCultura(newProducto.codigo, newCultura.codigo);
    expect(otroProducto.culturas.length).toBe(1);
    console.log(otroProducto.culturas.length)
    expect(otroProducto.culturas[0]).not.toBeNull();
    expect(otroProducto.culturas[0].codigo).toBe(newCultura.codigo)
    expect(otroProducto.culturas[0].nombre).toBe(newCultura.nombre)
    expect(otroProducto.culturas[0].descripcion).toBe(newCultura.descripcion)


  });
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  it('add productoCultura should thrown exception for an invalid cultura', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion: faker.lorem.sentence(),
      historia: faker.lorem.sentence(),
    })

    await expect(() => service.adicionarProductoCultura(newProducto.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "La cultura no se encontró");
  });




  it('add productoCultura should throw an exception for an invalid Producto', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    await expect(() => service.adicionarProductoCultura(faker.datatype.number(), newCultura.codigo)).rejects.toHaveProperty("message", "El producto no se encontró");
  });



  it('find culturaByProductoIdCulturaId should return cultura by Producto', async () => {
    const cultura: CulturaEntity = culturaList[0];
    const culturaModif: CulturaEntity = await service.buscarCulturaPorProductoIdCulturaId(producto.codigo, cultura.codigo, )
    expect(culturaModif).not.toBeNull();
    expect(culturaModif.codigo).toBe(cultura.codigo);
    expect(culturaModif.nombre).toBe(cultura.nombre);
    expect(culturaModif.descripcion).toBe(cultura.descripcion);
  });



  it('find culturaByProductoIdCulturaId should throw an exception for an invalid cultura', async () => {
    await expect(()=> service.buscarCulturaPorProductoIdCulturaId(producto.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "La cultura no se encontró");
  });

  it('find culturaByProductoIdCulturaId should throw an exception for an invalid Producto', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await expect(()=> service.buscarCulturaPorProductoIdCulturaId(faker.datatype.number(), cultura.codigo)).rejects.toHaveProperty("message", "El producto no se encontró");
  });





  it('find culturaByProductoIdCulturaId should throw an exception for an cultura not associated to the Producto', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    await expect(()=> service.buscarCulturaPorProductoIdCulturaId(producto.codigo, newCultura.codigo)).rejects.toHaveProperty("message", "La cultura que se desea encontrar no esta asociada al producto");
  });


  it('find culturaByProductoIdCulturaId should return culturas by Producto', async ()=>{
    const culturas: CulturaEntity[] = await service.buscarCulturaPorProductoId(producto.codigo);
    expect(culturas.length).toBe(5)
  });

  it('find culturaByProductoIdCulturaId should throw an exception for an invalid Producto', async () => {
    await expect(()=> service.buscarCulturaPorProductoId(faker.datatype.number())).rejects.toHaveProperty("message", "El Producto no se encontró");
  });



  it('associate culturaProducto should update culturas list for a Producto', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    const productoModificado: ProductoEntity = await service.asociacionProductoCultura(producto.codigo, [newCultura]);
    expect(productoModificado.culturas.length).toBe(1);

    expect(productoModificado.culturas[0].codigo).toBe(newCultura.codigo);
    expect(productoModificado.culturas[0].nombre).toBe(newCultura.nombre);
    expect(productoModificado.culturas[0].descripcion).toBe(newCultura.descripcion);
  });



  it('associate culturaProducto should throw an exception for an invalid Producto', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    await expect(()=> service.asociacionProductoCultura(faker.datatype.number(), [newCultura])).rejects.toHaveProperty("message", "El Producto no se encontró");
  });






  it('associate culturaProducto should throw an exception for an invalid cultura', async () => {
    const newCultura: CulturaEntity = culturaList[0];
    newCultura.codigo = faker.datatype.number();
    await expect(()=> service.asociacionProductoCultura(producto.codigo, [newCultura])).rejects.toHaveProperty("message", "La cultura no se encontró");
  });


  it('deleteculturaToProdcuto should remove an cultura from a Producto', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await service.borrarCulturaDelProducto(producto.codigo, cultura.codigo);
    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {codigo: producto.codigo}, relations: ["culturas"]});
    const deletedcultura: CulturaEntity = storedProducto.culturas.find(a => a.codigo === cultura.codigo);
    expect(deletedcultura).toBeUndefined();
  });



  it('deleteculturaToProdcuto should thrown an exception for an invalid cultura', async () => {
    await expect(()=> service.borrarCulturaDelProducto(producto.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "La cultura no se encontró");
  });

  it('deleteculturaToProdcuto should thrown an exception for an invalid Producto', async () => {
    const cultura: CulturaEntity = culturaList[0];
    await expect(()=> service.borrarCulturaDelProducto(faker.datatype.number(), cultura.codigo)).rejects.toHaveProperty("message", "El Producto no se encontró");
  });

  it('deleteculturaToProdcuto should thrown an exception for an non asocciated cultura', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      codigo: faker.datatype.number(),
      nombre: faker.address.city(),
      descripcion : faker.address.city()
    });

    await expect(()=> service.borrarCulturaDelProducto(producto.codigo, newCultura.codigo)).rejects.toHaveProperty("message", "La cultura que se desea borrar no esta asociada al producto");
  });


 
});
