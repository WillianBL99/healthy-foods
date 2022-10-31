import { Product, ProductDB } from '@/interfaces';
import { getObjectWithout } from '@/utils/getObjectWithout';
import { productsRepository } from '@/repositories';
import { CONFLICT_DELETE, NOT_FOUND } from '@/events';

async function getProducts(
  page: number,
  pagination: number
): Promise<ProductDB[]> {
  return await productsRepository.getProducts(page, pagination);
}

async function getProductById(id: string): Promise<ProductDB | null> {
  return await productsRepository.findProductById(id);
}

async function deleteProductById(id: string): Promise<void> {
  const product = await productsRepository.findProductById(id);
  if (!product) {
    throw NOT_FOUND();
  }

  if (product.status === 'trash') {
    throw CONFLICT_DELETE();
  }

  await productsRepository.changeStatusProduct(id, 'trash');
}

async function updateProduct(id: string, product: Product): Promise<void> {
  const productExists = await productsRepository.findProductById(id);

  const { imported_t, ...updatableProperties } = product;
  updatableProperties.code = product.code === '200' ? '' : product.code;
  const updatedProduct = getObjectWithout(updatableProperties, '');

  if (!productExists) {
    throw NOT_FOUND();
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
