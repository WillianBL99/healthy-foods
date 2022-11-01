import { Models } from '@/config';
import { ObjectId } from 'mongodb';
import { Product, ProductDB } from '@/interfaces';

async function getProduct(
  param: keyof Product,
  value: any
): Promise<ProductDB | null> {
  return (await Models.products().findOne({
    [param]: value,
  })) as ProductDB | null;
}

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

async function findProductById(id: string): Promise<ProductDB | null> {
  const _id = new ObjectId(id);
  return (await Models.products().findOne({ _id })) as ProductDB | null;
}

async function insertOneProduct(product: Product): Promise<void> {
  await Models.products().insertOne(product);
}

async function insertManyProducts(products: Product[]): Promise<void> {
  await Models.products().insertMany(products);
  console.log('insertManyProducts', products.length);
}

async function changeStatusProduct(id: string, status: string): Promise<void> {
  const _id = new ObjectId(id);
  await updateOne(_id, { status });
}

async function hasProducts(): Promise<boolean> {
  return !!(await Models.products().countDocuments());
}

async function updateOne(
  _id: ObjectId,
  updatedProduct: Partial<Product>
): Promise<void> {
  await Models.products().updateOne({ _id }, { $set: { ...updatedProduct } });
}

async function updateProduct(
  id: string,
  updatedProduct: Partial<Product>
): Promise<void> {
  const _id = new ObjectId(id);
  await updateOne(_id, updatedProduct);
  console.log({ updatedProduct });
}

const productsRepository = {
  hasProducts,
  getProducts,
  getProduct,
  updateOne,
  updateProduct,
  findProductById,
  insertManyProducts,
  insertOneProduct,
  changeStatusProduct,
};

export { productsRepository };
