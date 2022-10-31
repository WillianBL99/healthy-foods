import { Product } from '@/interfaces';
import { productsRepository } from '@/repositories';
import { WithId } from 'mongodb';

async function getProducts(
  page: number,
  pagination: number
): Promise<WithId<Product>[]> {
  return await productsRepository.getProducts(page, pagination);
}

async function getProductById(id: string): Promise<WithId<Product> | null> {
  return await productsRepository.findProductById(id);
}

const productsService = {
  getProducts,
  getProductById,
};

export { productsService };
