
import AppLog from '@/events/AppLog';
import { Collection, Document, MongoClient } from 'mongodb'

const uri = "mongodb+srv://root:root@cluster0.drmdthq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


export function products(callback: (collection: Collection<Document>) => void) {
  try {
    const db = client.db('healthy-foods');
    const collection = db.collection('products');

    AppLog('Database', 'Connected to database');
    callback(collection);

  } catch (error: any) {
    throw new Error(error);

  } finally {
    AppLog('Database', 'Connection closed');
    client.close();
  }
}