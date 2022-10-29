import AppLog from '@/events/AppLog';
import dotenv from 'dotenv';
import { Collection, Db, Document, MongoClient } from 'mongodb';
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

export async function products<T extends Document, R>(
  callback: (collection: Collection<T>) => Promise<R>
) {
  return await callback(database.collection('products'));
}

export const mongoDb = {
  connect,
  disconnect,
  products,
};
