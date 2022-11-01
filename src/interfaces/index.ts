import fs from 'fs';
import { WithId } from 'mongodb';

type Types<V> = { [key: string]: V };
export default Types;

export type FileProduct = {
  buffer: string;
  countRows: number;
  stream: fs.ReadStream;
};

export type Product = {
  code: string;
  url: string;
  creator: string;
  created_t: number;
  last_modified_t: number;
  product_name: string;
  quantity: string;
  brands: string;
  categories: string;
  labels: string;
  cities: string;
  purchase_places: string;
  stores: string;
  ingredients_text: string;
  traces: string;
  serving_size: string;
  serving_quantity: string;
  nutriscore_score: string;
  nutriscore_grade: string;
  main_category: string;
  image_url: string;
  imported_t: number;
  status: string;
};

export type ProductDB = WithId<Product>;

export type ProductSchema = Omit<
  Product,
  'imported_t' | 'creator' | 'last_modified_t' | 'created_t' | 'code'
>;

export type Information = {
  date: Date;
  productUpdated: number;
  productInserted: number;
  arquivesToRead: string[];
  arquivesReaded: string[];
};

export type ResposneInformation = {
  connection: string;
  databaseRead: string;
  databaseWrite: string;
  lastUpdate: string;
  upTime: string;
  memoryUsage: string;
};
