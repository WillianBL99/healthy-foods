import AppError from '@/config/error';
import { Product } from '@/interfaces';
import { productsRepository } from '@/repositories';
import httpStatus from 'http-status';
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

async function deleteProductById(id: string): Promise<void> {
  const product = await productsRepository.findProductById(id);
  if (!product) {
    throw new AppError(
      'Product not found',
      httpStatus.NOT_FOUND,
      'Product not found',
      'verify if the product exists or if the code is correct'
    );
  }

  if (product.status === 'trash') {
    throw new AppError(
      'Product already deleted',
      httpStatus.CONFLICT,
      'Product already deleted',
      'products with status trash cannot be deleted again'
    );
  }

  await productsRepository.changeStatusProduct(id, 'trash');
}

const productsService = {
  getProducts,
  getProductById,
  deleteProductById,
};

export { productsService };
