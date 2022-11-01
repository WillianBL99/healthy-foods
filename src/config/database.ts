import AppLog from '@/events/AppLog';
import { Information, Product, ProductParams } from '@/interfaces';
import dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';
dotenv.config();

const uri = process.env.MONGO_URI || '';

export let database: Db;
let client: MongoClient;

export async function connect() {
  try {
    client = new MongoClient(uri);
    await client.connect();
    database = client.db('healthy-foods');
    AppLog('Database', 'Connected');
  } catch (error) {
    AppLog('Database', error);
    process.exit(1);
  }
}

export async function disconnect() {
  try {
    await client.close();
    AppLog('Database', 'Disconnected');
  } catch (error) {
    AppLog('Database', error);
  }
}

export async function connectionTest() {
  try {
    if (!database) return undefined;
    await database.collection('test').insertOne({ test: 'test' });
    const result = await database.collection('test').findOne({ test: 'test' });
    await database.collection('test').deleteOne({ test: 'test' });
    return {
      connection: true,
      write: result ? true : false,
      read: result ? true : false,
    };
  } catch (error) {
    AppLog('Database', error);
    return undefined;
  }
}

export class Models {
  static information() {
    return database.collection<Information>('information');
  }

  static products() {
    return database.collection<Product>('products');
  }

  static paramsUpdated() {
    return database.collection<ProductParams>('paramsUpdated');
  }
}

export const mongoDb = {
  connect,
  disconnect,
  connectionTest,
};
