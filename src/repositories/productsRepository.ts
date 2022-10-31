import { mongoDb } from '@/config';
import { Information, Product } from '@/interfaces';
import { WithId } from 'mongodb';

async function getProducts(
  page: number,
  pagination: number
): Promise<WithId<Product>[]> {
  return mongoDb.products(async (collection) => {
    return (await collection
      .find()
      .skip(page * pagination)
      .limit(pagination)
      .toArray()) as WithId<Product>[];
  });
}

async function insertManyProducts(products: Product[]) {
  mongoDb.products(async (collection) => {
    await collection.insertMany(products);
  });
}

async function upsertProduct(
  updatedProduct: Partial<Product>,
  product: Product
): Promise<Partial<Information>> {
  const count = { productUpdated: 0, productInserted: 0 };
  return mongoDb.products(async (collection) => {
    const productUpdated = await collection.updateOne(
      { $or: [{ url: product.url }] },
      { $set: { ...updatedProduct } }
    );

    if (!productUpdated.modifiedCount) {
      await collection.insertOne(product);
      count.productInserted++;
    } else {
      count.productUpdated++;
    }

    return count;
  });
}

async function changeStatusProduct(code: string, status: string) {
  await mongoDb.products(async (collection) => {
    await collection.updateOne({ code }, { $set: { status } });
  });
}

async function findProduct(code: string) {
  return mongoDb.products(async (collection) => {
    return (await collection.findOne({ code })) as WithId<Product> | null;
  });
}

async function hasProducts(): Promise<boolean> {
  return mongoDb.products(async (collection) => {
    return !!(await collection.countDocuments());
  });
}

const productsRepository = {
  insertManyProducts,
  upsertProduct,
  changeStatusProduct,
  findProduct,
  hasProducts,
  getProducts,
};

export { productsRepository };
