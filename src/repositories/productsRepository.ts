import { mongoDb } from '@/config';
import { Information, Product } from '@/interfaces';
import { ObjectId, WithId } from 'mongodb';

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

async function changeStatusProduct(id: string, status: string) {
  await mongoDb.products(async (collection) => {
    const _id = new ObjectId(id);
    await collection.updateOne({ _id }, { $set: { status } });
  });
}

async function findProductById(id: string) {
  return mongoDb.products(async (collection) => {
    const _id = new ObjectId(id);
    return (await collection.findOne({ _id })) as WithId<Product> | null;
  });
}

async function hasProducts(): Promise<boolean> {
  return mongoDb.products(async (collection) => {
    return !!(await collection.countDocuments());
  });
}

async function updateProduct(id: string, updatedProduct: Partial<Product>) {
  await mongoDb.products(async (collection) => {
    const _id = new ObjectId(id);
    await collection.updateOne({ _id }, { $set: { ...updatedProduct } });
  });
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
