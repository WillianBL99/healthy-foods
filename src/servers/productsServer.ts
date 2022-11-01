import { CountProducts, Product, ProductDB, ProductParams } from '@/interfaces';
import { productParamsRepository, productsRepository } from '@/repositories';
import { CONFLICT_DELETE, NOT_FOUND } from '@/events';
import { removeParams } from '@/utils';
import { ObjectId } from 'mongodb';

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

  if (!productExists) {
    throw NOT_FOUND();
  }

  const paramsToRemove: ProductParams = ['imported_t'];
  if (product.code === '200') paramsToRemove.push('code');

  const updatedProduct = removeParams(product, paramsToRemove);
  const paramsToPush = Object.keys(updatedProduct) as ProductParams;

  productParamsRepository.pushParams(new ObjectId(id), paramsToPush);
  await productsRepository.updateProduct(id, updatedProduct);
}

async function uploadProduct(product: Product): Promise<CountProducts> {
  const count: CountProducts = { productsUpdated: 0, productsInserted: 0 };
  let listParamsToRemove: ProductParams = ['imported_t', 'status'];
  if (product.code === '200') listParamsToRemove.push('code');

  const productFinded = await productsRepository.getProduct('url', product.url);
  if (productFinded) {
    const params =
      (await productParamsRepository.getParams(productFinded._id)) || [];
    listParamsToRemove = [...listParamsToRemove, ...params];
    const updatedProduct = removeParams(product, listParamsToRemove);

    await productsRepository.updateOne(productFinded._id, updatedProduct);
    count.productsUpdated++;
    return count;
  }

  await productsRepository.insertOneProduct(product);
  count.productsInserted++;
  return count;
}

const productsService = {
  getProducts,
  uploadProduct,
  updateProduct,
  getProductById,
  deleteProductById,
};

export { productsService };
