import { mongoDb } from '@/config';
import { Product } from '@/interfaces';
import { WithId } from 'mongodb';

async function insertManyProducts(products: Product[]) {
  mongoDb.products(async (collection) => {
    await collection.insertMany(products);
  });
}

async function upsertProduct(
  updatedProduct: Partial<Product>,
  product: Product
) {
  mongoDb.products(async (collection) => {
    const productUpdated = await collection.updateOne(
      { $or: [{ url: product.url }] },
      { $set: { ...updatedProduct } }
    );

    if (!productUpdated.modifiedCount) {
      await collection.insertOne(product);
    }
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
};

export { productsRepository };
