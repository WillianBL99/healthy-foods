import fs from 'fs';
import zlib from 'zlib';
import request from 'request';
import Types, { FileProduct, Product } from '@/interfaces';
import { productsRepository } from '@/repositories';
import { removeFromObject } from '@/utils/removeFromObject';

const BASE_URL = 'http://challenges.coode.sh/food/data/json';
const LOCAL_PATH = './src/servers/data';
const filesName = [
  'products_01.json.gz',
  'products_02.json.gz',
  'products_03.json.gz',
  'products_04.json.gz',
  'products_05.json.gz',
  'products_06.json.gz',
  'products_07.json.gz',
  'products_08.json.gz',
  'products_09.json.gz',
];

let listProducts: Product[] = [];

export async function transferPorductsToDatabase(
  porductsPerFile: number = 100
) {
  for (const fileName of filesName) {
    // download zip file
    const urlZipFile = `${BASE_URL}/${fileName}`;
    const uriZipFilePath = `${LOCAL_PATH}/${fileName}`;
    await downloadFile(urlZipFile, uriZipFilePath);

    // unzip file
    const uriJsonFilePath = `${LOCAL_PATH}/${fileName.replace('.gz', '')}`;
    await parseJsonFile(uriZipFilePath, uriJsonFilePath);

    // delete zip file
    fs.unlink(uriZipFilePath, () => {});

    // read json file
    await readJsonFileStream(uriJsonFilePath, porductsPerFile);

    // delete json file
    fs.unlink(uriJsonFilePath, () => {});

    // save on database
    await saveOnDatabase(listProducts);
    listProducts = [];
  }
}

async function saveOnDatabase(listProduct: Product[]) {
  if (await productsRepository.hasProducts()) {
    await updateOnDatabase(listProduct);
  } else {
    await productsRepository.insertManyProducts(listProduct);
  }
}

async function updateOnDatabase(listProduct: Product[]) {
  listProduct.forEach(async (product) => {
    const { code, last_modified_t, status, ...updatedProduct } = product;
    removeFromObject(updatedProduct, "");
    await productsRepository.upsertProduct(updatedProduct, product);
  });
}

async function downloadFile(url: string, uriZipFile: string) {
  return new Promise<void>((resolve, __reject) => {
    request(url)
      .pipe(fs.createWriteStream(uriZipFile))
      .on('finish', () => {
        console.log(`downloaded ${uriZipFile}`);
        resolve();
      });
  });
}

async function parseJsonFile(uriZipFile: string, uriJsonFile: string) {
  return new Promise<void>((resolve, __reject) => {
    fs.createReadStream(uriZipFile)
      .pipe(zlib.createGunzip())
      .pipe(fs.createWriteStream(uriJsonFile))
      .on('finish', () => {
        console.log(`unziped ${uriZipFile}`);
        resolve();
      });
  });
}

async function readJsonFileStream(
  uriJsonFile: string,
  porductsPerFile: number
) {
  return new Promise<void>((resolve, __reject) => {
    const arquive = {
      stream: fs.createReadStream(uriJsonFile, {
        flags: 'r',
        encoding: 'utf-8',
      }),
      buffer: '',
      countRows: 0,
    };

    arquive.stream.on('data', async function (chunk) {
      arquive.buffer += chunk.toString();
      processBuffer(arquive, porductsPerFile);
    });

    arquive.stream.on('close', () => {
      console.log('product rows readed', arquive.countRows);
      resolve();
    });

    arquive.stream.on('end', () => {
      console.log('end reading file', arquive.countRows);
      resolve();
    });
  });
}

function processBuffer(arquive: FileProduct, porductsPerFile: number): Boolean {
  var pos;

  while ((pos = arquive.buffer.indexOf('\n')) >= 0) {
    // got a full line
    if (pos == 0) {
      arquive.buffer = arquive.buffer.slice(1);
      continue;
    }

    processLine(arquive.buffer.slice(0, pos));

    arquive.countRows++;
    // delete the processed line
    arquive.buffer = arquive.buffer.slice(pos + 1);

    if (arquive.countRows >= porductsPerFile) {
      arquive.stream.pause();
      arquive.stream.destroy();
      return true;
    }
  }
  return true;
}

function processLine(line: string) {
  if (line[line.length - 1] == '\r') line = line.substr(0, line.length - 1);

  if (line.length > 0) {
    const product = parseNewProduct(JSON.parse(line));
    listProducts.push(product);
  }
}

function parseNewProduct(line: any) {
  const milliseconds = 1000;
  const seconds = new Date().getTime() / milliseconds;
  const parseObj = filterProperties(line);
  parseObj.imported_t = seconds.toFixed(0);
  parseObj.status = 'publisher';
  return parseObj as Product;
}

function filterProperties(obj: any): Types<any> {
  const {
    code,
    url,
    creator,
    created_t,
    last_modified_t,
    product_name,
    quantity,
    brands,
    categories,
    labels,
    cities,
    purchase_places,
    stores,
    ingredients_text,
    traces,
    serving_size,
    serving_quantity,
    nutriscore_score,
    nutriscore_grade,
    main_category,
    image_url,
  } = obj;
  return {
    code,
    url,
    creator,
    created_t,
    last_modified_t,
    product_name,
    quantity,
    brands,
    categories,
    labels,
    cities,
    purchase_places,
    stores,
    ingredients_text,
    traces,
    serving_size,
    serving_quantity,
    nutriscore_score,
    nutriscore_grade,
    main_category,
    image_url,
  };
}
