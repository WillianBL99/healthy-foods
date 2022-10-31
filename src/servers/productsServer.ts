import AppError from '@/config/error';
import { Product } from '@/interfaces';
import { productsRepository } from '@/repositories';
import { getObjectWithout } from '@/utils/getObjectWithout';
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

async function updateProduct(id: string, product: Product): Promise<void> {
  const productExists = await productsRepository.findProductById(id);

  const { imported_t, ...updatableProperties } = product;
  updatableProperties.code = product.code === '200' ? '' : product.code;
  const updatedProduct = getObjectWithout(updatableProperties, '');

  if (!productExists) {
    throw new AppError(
      'Product not found',
      httpStatus.NOT_FOUND,
      'Product not found',
      'verify if the product exists or if the code is correct'
    );
  }

  await productsRepository.updateProduct(id, updatedProduct);
}

const productsService = {
  getProducts,
  updateProduct,
  getProductById,
  deleteProductById,
};

export { productsService };
