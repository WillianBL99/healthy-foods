import fs from 'fs';
import zlib from 'zlib';
import request from 'request';
import Types, { FileProduct } from '@/interfaces';
import { mongoDb } from '@/config';

const BASE_URL = 'http://challenges.coode.sh/food/data/json';
const LOCAL_PATH = './src/servers/data';

let listProducts: Types<any>[] = [];

export async function transferPorductsToDatabase(
  filesName: string[],
  porductsPerFile: number = 100
) {
  await mongoDb.connect();

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

  await mongoDb.disconnect();
}

async function saveOnDatabase(listObj: Types<any>[]) {
  await mongoDb.products(async (collection) => {
    await collection.insertMany(listObj);
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
      console.log('end reading file');
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
  const seconds = 1000;

  if (line.length > 0) {
    var obj = JSON.parse(line); // parse the JSON
    const parseObj = filterProperties(obj);
    parseObj.imported_t = new Date().getTime()/seconds;
    parseObj.status = 'draft';
    listProducts.push(parseObj);
  }
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
