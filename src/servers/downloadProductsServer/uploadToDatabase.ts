import { productsService } from '../productsServer';
import { productsRepository } from '@/repositories';
import { CountProducts, Product } from '@/interfaces';
import AppLog from '@/events/AppLog';

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
    AppLog('Service', coutUpload);
  }
}
