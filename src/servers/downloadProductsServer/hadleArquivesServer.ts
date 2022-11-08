import Types, { Product } from '@/interfaces';
import { createGunzip, Gunzip } from 'zlib';
import { ERROR_ON_DOWNLOAD_FILE } from '@/events';
import Axios from 'axios';
import ndjson from 'ndjson';
import { paths } from './paths';
//import through from 'through';

type ParseArrayObject = {
  count: number;
  quantity: number;
};
export class HadleArquivesServer {
  private listProducts: Product[] = [];

  static async importFilesName() {
    const filesNameArquive = await Axios({
      method: 'GET',
      url: paths.FILES_URL,
    });
    console.log(paths.FILES_URL);
    const filesNameArray: string[] = filesNameArquive.data.split('\n');
    return filesNameArray.filter((fileName) => fileName.endsWith('.gz'));
  }

  async download(fileUrl: string, quantity: number = 100): Promise<Product[]> {
    const unzip = createGunzip();

    const opt = {
      count: 0,
      quantity,
      bufer: '',
    };

    return new Promise<Product[]>((resolve) => {
      Axios({ method: 'GET', url: fileUrl, responseType: 'stream' })
        .then(async (response) => {
          response.data
            .pipe(unzip)
            .pipe(ndjson.parse())
            .on('data', (data: Object) => {
              this.parseObjectToList(data, opt, unzip);
            });

          unzip.on('error', (err) => {
            console.log(err);
            unzip.destroy();
            throw ERROR_ON_DOWNLOAD_FILE(err);
          });

          unzip.on('end', () => {
            resolve(this.listProducts);
          });

          unzip.on('close', () => {
            unzip.destroy();
            console.log('close');
            resolve(this.listProducts);
            return;
          });
        })
        .catch((error) => {
          throw ERROR_ON_DOWNLOAD_FILE(error);
        });
    });
  }

  private parseObjectToList(
    obj: any,
    opt: ParseArrayObject,
    previusPipe: Gunzip
  ) {
    if (opt.count >= opt.quantity) {
      previusPipe.close();
    } else {
      this.listProducts.push(this.parseNewProduct(obj));
      opt.count++;
    }
  }

  private parseNewProduct(line: any) {
    const milliseconds = 1000;
    const seconds = new Date().getTime() / milliseconds;
    const parseObj = this.filterProperties(line);
    parseObj.imported_t = seconds.toFixed(0);
    parseObj.status = 'publisher';
    return parseObj as Product;
  }

  private filterProperties(obj: any): Types<any> {
    const {
      url,
      code,
      cities,
      brands,
      labels,
      traces,
      stores,
      creator,
      quantity,
      image_url,
      created_t,
      categories,
      product_name,
      serving_size,
      main_category,
      purchase_places,
      last_modified_t,
      ingredients_text,
      serving_quantity,
      nutriscore_score,
      nutriscore_grade,
    } = obj;

    return {
      code,
      brands,
      cities,
      labels,
      stores,
      traces,
      creator,
      image_url,
      created_t,
      categories,
      product_name,
      serving_size,
      main_category,
      last_modified_t,
      purchase_places,
      ingredients_text,
      nutriscore_score,
      nutriscore_grade,
      url: url.replace(/\"/g, ''),
      quantity: parseInt(quantity),
      serving_quantity: parseInt(serving_quantity),
    };
  }
}
