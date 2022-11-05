import { unlink } from 'fs';
import { createGunzip } from 'zlib';
import { createReadStream } from 'fs';
import Types, { FileProductStream, Product } from '@/interfaces';
import { AppError, ERROR_ON_DOWNLOAD_FILE } from '@/events';

import Axios from 'axios';
import httpStatus from 'http-status';

export class HadleArquivesServer {
  private static listProducts: Product[] = [];
  static async download(fileUrl: string, outputLocationPath: string) {
    console.log(`Downloading file from ${outputLocationPath}`);
    const unzip = createGunzip();

    const arquive = {
      buffer: '',
      countRows: 0,
    };

    return Axios({ method: 'GET', url: fileUrl, responseType: 'stream' })
      .then(async (response) => {
        response.data.pipe(unzip).on('data', (chunk: any) => {
          arquive.buffer += chunk.toString();

          let pos;
          while ((pos = arquive.buffer.indexOf('\n')) >= 0) {
            // got a full line
            if (pos == 0) {
              arquive.buffer = arquive.buffer.slice(1);
              continue;
            }

            HadleArquivesServer.processLine(arquive.buffer.slice(0, pos));

            arquive.countRows++;
            arquive.buffer = arquive.buffer.slice(pos + 1);
          }
        });

        if (arquive.countRows >= 2) {
          unzip.close();
          return true;
        }
      })
      .catch((error) => {
        throw ERROR_ON_DOWNLOAD_FILE(error);
      });
  }

  static async deleteFile(uriFile: string) {
    unlink(uriFile, () => {});
  }

  static async readJsonFileStream(
    uriJsonFile: string,
    porductsPerFile: number
  ): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      const arquive = {
        stream: createReadStream(uriJsonFile, {
          flags: 'r',
          encoding: 'utf-8',
        }),
        buffer: '',
        countRows: 0,
      };

      arquive.stream.on('data', async function (chunk) {
        arquive.buffer += chunk.toString();
        HadleArquivesServer.processBuffer(arquive, porductsPerFile);
      });

      const finish = () => {
        resolve(this.listProducts);
        this.deleteFile(uriJsonFile);
        this.listProducts = [];
      };

      arquive.stream.on('close', finish);
      arquive.stream.on('end', finish);

      arquive.stream.on('error', (error) => {
        reject(error);
        this.listProducts = [];
        throw new AppError(
          error,
          httpStatus.INTERNAL_SERVER_ERROR,
          'Error on read file',
          'Error during the reading a product file'
        );
      });
    });
  }

  private static processBuffer(
    arquive: FileProductStream,
    porductsPerFile: number
  ): Boolean {
    var pos;

    while ((pos = arquive.buffer.indexOf('\n')) >= 0) {
      // got a full line
      if (pos == 0) {
        arquive.buffer = arquive.buffer.slice(1);
        continue;
      }

      this.processLine(arquive.buffer.slice(0, pos));

      arquive.countRows++;
      arquive.buffer = arquive.buffer.slice(pos + 1);

      if (arquive.countRows >= porductsPerFile) {
        arquive.stream.pause();
        arquive.stream.destroy();
        return true;
      }
    }
    return true;
  }

  private static processLine(line: string) {
    if (line[line.length - 1] == '\r') line = line.substr(0, line.length - 1);

    if (line.length > 0) {
      const product = this.parseNewProduct(JSON.parse(line));
      //this.listProducts.push(product);
      console.log({ product });
    }
  }

  private static parseNewProduct(line: any) {
    const milliseconds = 1000;
    const seconds = new Date().getTime() / milliseconds;
    const parseObj = HadleArquivesServer.filterProperties(line);
    parseObj.imported_t = seconds.toFixed(0);
    parseObj.status = 'publisher';
    return parseObj as Product;
  }

  private static filterProperties(obj: any): Types<any> {
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
}
