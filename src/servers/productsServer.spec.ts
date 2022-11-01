import { productsRepository } from '@/repositories';
import { productFactory } from '../factories/productFactory';
import { productsService } from './productsServer';

describe('Get proudcts', async () => {
  test('The user can see the products information', async () => {
    jest
      .spyOn(productsRepository, 'getProducts')
      .mockResolvedValue(productFactory.getProducts());
  });

  const products = await productsService.getProducts(1, 10);

  expect(products.length).toBe(productFactory.getProducts().length);
});
