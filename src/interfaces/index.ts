import fs from 'fs';

type Types<V> = { [key: string]: V };
export default Types;

export type FileProduct = {
  buffer: string;
  countRows: number;
  stream: fs.ReadStream;
}

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
  serving_quantity: number;
  nutriscore_score: number;
  nutriscore_grade: string;
  main_category: string;
  image_url: string;
  imported_t: number;
  status: string;
}

export type Information = {
  date: Date;
  products_updated: number;
  products_inserted: number;
  arquives_to_read: number;
  arquives_readed: string[];
}

export type ResposneInformation = {
  connection: string;
  databaseRead: string;
  databaseWrite: string;
  lastUpdate: string;
  upTime: string;
  memoryUsage: string;
}
