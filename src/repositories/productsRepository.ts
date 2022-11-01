import { Models } from '@/config';
import { CountProducts, Product, ProductDB } from '@/interfaces';
import { ObjectId } from 'mongodb';

async function getProducts(
  page: number,
  pagination: number
): Promise<ProductDB[]> {
  return (await Models.products()
    .find()
    .skip(page * pagination)
    .limit(pagination)
    .toArray()) as ProductDB[];
}

async function insertManyProducts(products: Product[]) {
  await Models.products().insertMany(products);
  console.log('insertManyProducts', products.length);
}

async function upsertProduct(
  updatedProduct: Partial<Product>,
  product: Product
): Promise<CountProducts> {
  const count: CountProducts = { productsUpdated: 0, productsInserted: 0 };

  const productsUpdated = await Models.products().updateOne(
    { url: product.url },
    { $set: { ...updatedProduct } }
  );

  if (!productsUpdated.matchedCount) {
    await Models.products().insertOne(product);
    count.productsInserted++;
  } else {
    count.productsUpdated++;
  }

  return count;
}

async function changeStatusProduct(id: string, status: string) {
  const _id = new ObjectId(id);
  await Models.products().updateOne({ _id }, { $set: { status } });
}

async function findProductById(id: string) {
  const _id = new ObjectId(id);
  return (await Models.products().findOne({ _id })) as ProductDB | null;
}

async function hasProducts(): Promise<boolean> {
  return !!(await Models.products().countDocuments());
}

async function updateProduct(id: string, updatedProduct: Partial<Product>) {
  const _id = new ObjectId(id);
  await Models.products().updateOne({ _id }, { $set: { ...updatedProduct } });
}

const productsRepository = {
  hasProducts,
  getProducts,
  updateProduct,
  upsertProduct,
  findProductById,
  insertManyProducts,
  changeStatusProduct,
};

export { productsRepository };
