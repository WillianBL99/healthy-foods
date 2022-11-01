import { CountProducts, Product } from '@/interfaces';
import { productsRepository } from '@/repositories';
import { getObjectWithout } from '@/utils/getObjectWithout';

export async function uploadToDatabase(
  listProduct: Product[],
  countUpload: CountProducts
) {
  if (await productsRepository.hasProducts()) {
    await updateOnDatabase(listProduct, countUpload);
  } else {
    await productsRepository.insertManyProducts(listProduct);
    countUpload.productsInserted += listProduct.length;
  }
  console.log('uploadToDatabase', countUpload);
}

async function updateOnDatabase(
  listProduct: Product[],
  coutUpload: CountProducts
) {
  for (const product of listProduct) {
    const { imported_t, status, ...updatableProperties } = product;
    updatableProperties.code = product.code === '200' ? '' : product.code;
    const updatedProduct = getObjectWithout(updatableProperties, '');

    const { productsInserted, productsUpdated } =
      await productsRepository.upsertProduct(updatedProduct, product);
    coutUpload.productsUpdated += productsUpdated || 0;
    coutUpload.productsInserted += productsInserted || 0;
    console.log('updateOnDatabase', coutUpload);
  }
}
