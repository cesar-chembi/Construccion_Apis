import { CategoriaProductoService } from './categoria-producto.service';
import {CategoriaEntity} from "../categoria/categoria.entity";
import {ProductoEntity} from "../producto/producto.entity";
import {TypeOrmTestingConfig} from "../shared/testing-utils/typeorm-testing-config";
import { faker } from '@faker-js/faker';
import {getRepositoryToken} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { Test, TestingModule } from '@nestjs/testing';

  describe('CategoriaProductoService', () => {
    let service: CategoriaProductoService;

    let categoriaRepository: Repository<CategoriaEntity>;
    let productoRepository: Repository<ProductoEntity>;
    let categoria: CategoriaEntity;
    let productoList : ProductoEntity[];

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [CategoriaProductoService],
      }).compile();

      service = module.get<CategoriaProductoService>(CategoriaProductoService);
      categoriaRepository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
      productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));

      await seedDatabase();
    });


    const seedDatabase = async () => {
      categoriaRepository.clear();
      productoRepository.clear();

      productoList = [];
      for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          codigo: faker.datatype.number(),
          nombre: faker.address.city(),
          descripcion : faker.address.city(),
          historia : faker.address.city(),
        })
        productoList.push(producto);
      }

      categoria = await categoriaRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        productos:  productoList
      })
    }
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('add productoCategoria  should add an producto to a categoria', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city(),
      });

      const newCategoria: CategoriaEntity = await categoriaRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        productos:  productoList
      })

      const otraCategoria: CategoriaEntity = await service.adicionarProductoCategoria(newCategoria.codigo, newProducto.codigo);

      expect(otraCategoria.productos.length).toBe(1);
      console.log(otraCategoria.productos.length)
      expect(otraCategoria.productos[0]).not.toBeNull();
      expect(otraCategoria.productos[0].codigo).toBe(newProducto.codigo)
      expect(otraCategoria.productos[0].nombre).toBe(newProducto.nombre)
      expect(otraCategoria.productos[0].descripcion).toBe(newProducto.descripcion)
      expect(otraCategoria.productos[0].historia).toBe(newProducto.historia)

    });

    it('add productoCategoria should thrown exception for an invalid producto', async () => {
      const newCategoria: CategoriaEntity = await categoriaRepository.save({
          codigo: faker.datatype.number(),
          nombre: faker.address.city(),
          productos:  productoList
      })

      await expect(() => service.adicionarProductoCategoria(newCategoria.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El producto no se encontró");
    });

    it('add productoCategoria should throw an exception for an invalid Categoria', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city()
      });

      await expect(() => service.adicionarProductoCategoria(faker.datatype.number(), newProducto.codigo)).rejects.toHaveProperty("message", "La categoria no se encontró");
    });

    it('find productoByCategoriaIdProductoId should return producto by Categoria', async () => {
      const producto: ProductoEntity = productoList[0];
      const productoModificado: ProductoEntity = await service.buscarProductoXCategoriaCodigoProductoCodigo(categoria.codigo, producto.codigo, )
      expect(productoModificado).not.toBeNull();
      expect(productoModificado.codigo).toBe(producto.codigo);
      expect(productoModificado.nombre).toBe(producto.nombre);
      expect(productoModificado.descripcion).toBe(producto.descripcion)
      expect(productoModificado.historia).toBe(producto.historia)
    });

    it('find productoByCategoriaIdProductoId should throw an exception for an invalid producto', async () => {
      await expect(()=> service.buscarProductoXCategoriaCodigoProductoCodigo(categoria.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El producto no se encontró");
    });

    it('find productoByCategoriaIdProductoId should throw an exception for an invalid Categoria', async () => {
      const producto: ProductoEntity = productoList[0];
      await expect(()=> service.buscarProductoXCategoriaCodigoProductoCodigo(faker.datatype.number(), producto.codigo)).rejects.toHaveProperty("message", "La Categoria no se encontró");
    });

    it('find productoByCategoriaIdProductoId should throw an exception for an producto not associated to the Categoria', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city()
      });

      await expect(()=> service.buscarProductoXCategoriaCodigoProductoCodigo(categoria.codigo, newProducto.codigo)).rejects.toHaveProperty("message", "El  producto que se desea buscar no esta asociado a la Categoria");
    });

    it('find productosByCategoriaId should return productos Por Categoria', async ()=>{
      const productos: ProductoEntity[] = await service.buscarProductoXCategoriaCodigo(categoria.codigo);
      expect(productos.length).toBe(5)
    });

    it('find productosByCategoriaId should throw an exception for an invalid Categoria', async () => {
      await expect(()=> service.buscarProductoXCategoriaCodigo(faker.datatype.number())).rejects.toHaveProperty("message", "La Categoria no se encontró");
    });

    it('associateProductosCategoria should update productos list for a Categoria', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city()
      });

      const categoriaModificado: CategoriaEntity = await service.asociarProductosACategoria(categoria.codigo, [newProducto]);
      expect(categoriaModificado.productos.length).toBe(1);
      expect(categoriaModificado.productos[0].codigo).toBe(newProducto.codigo);
      expect(categoriaModificado.productos[0].nombre).toBe(newProducto.nombre);
      expect(categoriaModificado.productos[0].descripcion).toBe(newProducto.descripcion)
      expect(categoriaModificado.productos[0].historia).toBe(newProducto.historia)
    });

    it('associateProductosCategoria should throw an exception for an invalid Categoria', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city()
      });

      await expect(()=> service.asociarProductosACategoria(faker.datatype.number(), [newProducto])).rejects.toHaveProperty("message", "El pais no se encontró");
    });

    it('associateProductosCategoria should throw an exception for an invalid Producto', async () => {
      const newProducto: ProductoEntity = productoList[0];
      newProducto.codigo = faker.datatype.number();

      await expect(()=> service.asociarProductosACategoria(categoria.codigo, [newProducto])).rejects.toHaveProperty("message", "El Producto no se encontró");
    });

    it('deleteproductoToCategoria should remove an producto from a Categoria', async () => {
      const producto: ProductoEntity = productoList[0];

      await service.borrarProductoDeCategoria(categoria.codigo, producto.codigo);

      const storedCategoria: CategoriaEntity = await categoriaRepository.findOne({where: {codigo: categoria.codigo}, relations: ["productos"]});
      const deletedproducto: ProductoEntity = storedCategoria.productos.find(a => a.codigo === producto.codigo);

      expect(deletedproducto).toBeUndefined();

    });

    it('deleteproductoToCategoria should thrown an exception for an invalid Producto', async () => {
      await expect(()=> service.borrarProductoDeCategoria(categoria.codigo, faker.datatype.number())).rejects.toHaveProperty("message", "El producto no se encontró");
    });

    it('deleteproductoToCategoria should thrown an exception for an invalid Categoria', async () => {
      const producto: ProductoEntity = productoList[0];
      await expect(()=> service.borrarProductoDeCategoria(faker.datatype.number(), producto.codigo)).rejects.toHaveProperty("message", "La Categoria no se encontró");
    });

    it('deleteproductoToCategoria should thrown an exception for an non asocciated producto', async () => {
      const newProducto: ProductoEntity = await productoRepository.save({
        codigo: faker.datatype.number(),
        nombre: faker.address.city(),
        descripcion : faker.address.city(),
        historia : faker.address.city()
      });

      await expect(()=> service.borrarProductoDeCategoria(categoria.codigo, newProducto.codigo)).rejects.toHaveProperty("message", "El  producto que desea borrar no esta asociado a la Categoria");
    });

  });
