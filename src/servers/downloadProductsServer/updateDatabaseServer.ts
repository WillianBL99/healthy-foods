import { CountProducts } from '@/interfaces';
import { uploadToDatabase } from './uploadToDatabase';
import { informationRepository } from '@/repositories/informationRepository';
import { paths, HadleArquivesServer } from '@/servers/downloadProductsServer';

const { filesName } = paths;

let arquivesReaded: string[] = [];
const countProducts: CountProducts = {
  productsInserted: 0,
  productsUpdated: 0,
};

export async function upadateDatabaseServer(porductsPerFile: number = 100) {
  for (const fileName of filesName) {
    const zipFileUrl = paths.zipFileUrl(fileName);
    const jsonFileLocalPath = paths.jsonFileLocalPath(fileName);

    await HadleArquivesServer.download(zipFileUrl, jsonFileLocalPath);
    const listProducts = await HadleArquivesServer.readJsonFileStream(
      jsonFileLocalPath,
      porductsPerFile
    );
    console.log('downloaded', fileName);
    arquivesReaded.push(fileName);
    await uploadToDatabase(listProducts, countProducts);
    console.log('uploaded', fileName);
  }

  informationRepository.insertInformation({
    ...countProducts,
    arquivesReaded,
    arquivesToRead: filesName,
    date: new Date(),
  });
}
