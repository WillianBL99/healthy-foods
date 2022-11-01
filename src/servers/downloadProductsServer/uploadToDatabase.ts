import { productsService } from '../productsServer';
import { productsRepository } from '@/repositories';
import { CountProducts, Product } from '@/interfaces';

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
    const { productsInserted, productsUpdated } =
      await productsService.uploadProduct(product);

    coutUpload.productsUpdated += productsUpdated || 0;
    coutUpload.productsInserted += productsInserted || 0;

    console.log('updateOnDatabase', coutUpload);
  }
}
