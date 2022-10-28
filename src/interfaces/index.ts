import fs from 'fs';

type Types<V> = { [key: string]: V };
export default Types;

export type FileProduct = {
  buffer: string;
  countRows: number;
  stream: fs.ReadStream;
}