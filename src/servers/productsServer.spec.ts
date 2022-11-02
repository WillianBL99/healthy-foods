import { productParamsRepository, productsRepository } from '@/repositories';
import { describe, test, expect, vi, afterEach } from 'vitest';
import { productFactory } from '@/../tests/factories/productFactory';
import { productsService } from './productsServer';
import { Product } from '@/interfaces';

vi.mock('mongodb', () => ({
  ObjectId: vi.fn((id: string) => id),
}));

describe('productsServer', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getting products', async () => {
    test('passing page and pagination params, should return products', async () => {
      const spy = vi
        .spyOn(productsRepository, 'getProducts')
        .mockImplementationOnce(async () => productFactory.getProducts(0, 10));

      const products = await productsService.getProducts(0, 10);

      expect(products.length).toBeLessThanOrEqual(10);
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('getting product by id', async () => {
    test('passing id, if product exists, should return a product', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      const spy = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementationOnce(async () => productMoked);

      const product = await productsService.getProductById('1');

      expect(product).toBeTruthy();
      expect(spy).toBeCalledTimes(1);
      expect(product?._id).toBe(productMoked._id);
    });

    test('passing id, if product does not exists, should return null', async () => {
      const spy = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementationOnce(async () => Promise.resolve(null));

      const product = await productsService.getProductById('1');

      expect(product).toBeNull();
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('deleting product by id', async () => {
    test('passing id, if product exists, should change status to trash', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      productMoked.status = 'published';
      const spyFindProduct = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementationOnce(async () => productMoked);
      const spyChangeStatus = vi
        .spyOn(productsRepository, 'changeStatusProduct')
        .mockImplementationOnce(async () => {
          productMoked.status = 'trash';
        });

      await productsService.deleteProductById('1');

      expect(spyFindProduct).toBeCalledTimes(1);
      expect(spyChangeStatus).toBeCalledTimes(1);
      expect(productMoked.status).toBe('trash');
    });

    test('passing id, if product does not exists, should throw NOT_FOUND error', async () => {
      const spy = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementation(async () => Promise.resolve(null));

      await productsService.deleteProductById('1').catch((error) => {
        expect(error).toBeTruthy();
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('Product not found');
      });

      expect(spy).toBeCalledTimes(1);
    });

    test('passing id, if product exists and status is trash, should throw CONFLICT_DELETE error', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      productMoked.status = 'trash';
      const spy = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementation(async () => productMoked);

      await productsService.deleteProductById('1').catch((error) => {
        expect(error).toBeTruthy();
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe('Product already deleted');
      });

      expect(spy).toBeCalledTimes(1);
    });
  });

  describe('updating product by id', async () => {
    test('passing id and params to update, if product exists, should update product', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      const spyFindProduct = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementation(async () => productMoked);
      const spyPushParams = vi
        .spyOn(productParamsRepository, 'pushParams')
        .mockImplementation(async () => Promise.resolve());
      const spyUpdateProduct = vi
        .spyOn(productsRepository, 'updateProduct')
        .mockImplementation(async () => Promise.resolve());

      const paramsToUpdate: Partial<Product> = {
        brands: 'brands',
      };
      await productsService.updateProduct('idproduct', paramsToUpdate);

      expect(spyFindProduct).toBeCalledTimes(1);
      expect(spyPushParams).toBeCalledTimes(1);
      expect(spyUpdateProduct).toBeCalledTimes(1);
    });

    test('passing id and params to update, if product does not exists, should throw NOT_FOUND error', async () => {
      const spy = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementation(async () => Promise.resolve(null));

      const paramsToUpdate: Partial<Product> = {
        brands: 'brands',
      };
      await productsService
        .updateProduct('idproduct', paramsToUpdate)
        .catch((error) => {
          expect(error).toBeTruthy();
          expect(error.statusCode).toBe(404);
          expect(error.message).toBe('Product not found');
        });

      expect(spy).toBeCalledTimes(1);
    });

    test('passing id and params to update, if code = 200, should call paramsToRemove.push("code")', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      productMoked.code = '200';
      const spyFindProduct = vi
        .spyOn(productsRepository, 'findProductById')
        .mockImplementation(async () => productMoked);
      const spyPushParams = vi
        .spyOn(productParamsRepository, 'pushParams')
        .mockImplementation(async () => Promise.resolve());
      const spyUpdateProduct = vi
        .spyOn(productsRepository, 'updateProduct')
        .mockImplementation(async () => Promise.resolve());

      await productsService.updateProduct('idproduct', productMoked);

      expect(spyFindProduct).toBeCalledTimes(1);
      expect(spyPushParams).toBeCalledTimes(1);
      expect(spyUpdateProduct).toBeCalledTimes(1);
    });
  });

  describe('uploading a product', async () => {
    test('passing a product, if the product has not been uploaded, should insert the product', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      const spyFindProduct = vi
        .spyOn(productsRepository, 'getProduct')
        .mockImplementation(async () => Promise.resolve(null));
      const spyInsertProduct = vi
        .spyOn(productsRepository, 'insertOneProduct')
        .mockImplementation(async () => Promise.resolve());

      await productsService.uploadProduct(productMoked);

      expect(spyFindProduct).toBeCalledTimes(1);
      expect(spyInsertProduct).toBeCalledTimes(1);
    });

    test('passing a product, if the product has been uploaded, should update the product', async () => {
      const productMoked = productFactory.getProducts(0, 1)[0];
      const spyFindProduct = vi
        .spyOn(productsRepository, 'getProduct')
        .mockImplementation(async () => Promise.resolve(productMoked));
      const spyGetParams = vi
        .spyOn(productParamsRepository, 'getParams')
        .mockImplementation(async () => Promise.resolve([]));
      const spyUpdateProduct = vi
        .spyOn(productsRepository, 'updateOne')
        .mockImplementation(async () => Promise.resolve());

      await productsService.uploadProduct(productMoked);

      expect(spyFindProduct).toBeCalledTimes(1);
      expect(spyGetParams).toBeCalledTimes(1);
      expect(spyUpdateProduct).toBeCalledTimes(1);
    });
  });
});
