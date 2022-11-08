import { CountProducts } from '@/interfaces';
import { uploadToDatabase } from './uploadToDatabase';
import { informationRepository } from '@/repositories/informationRepository';
import { paths, HadleArquivesServer } from '@/servers/downloadProductsServer';
import AppLog from '@/events/AppLog';


let arquivesReaded: string[] = [];
const countProducts: CountProducts = {
  productsInserted: 0,
  productsUpdated: 0,
};

export async function upadateDatabaseServer(productsPerFile: number = 100) {
  const promisies: Promise<void>[] = [];
  const filesName = await HadleArquivesServer.importFilesName();
  console.log({ filesName });

  for (const fileName of filesName) {
    promisies.push(
      new Promise(async (resolve) => {
        const zipFileUrl = paths.zipFileUrl(fileName);

        const hadleArquivesServer = new HadleArquivesServer();
        const listProducts = await hadleArquivesServer.download(
          zipFileUrl,
          productsPerFile
        );

        AppLog('Service', `Readed ${fileName}`);
        arquivesReaded.push(fileName);
        await uploadToDatabase(listProducts, countProducts);
        AppLog('Service', `Uploaded ${fileName}`);
        resolve();
      })
    );
  }

  await Promise.all(promisies).then(() => {
    informationRepository.insertInformation({
      ...countProducts,
      arquivesReaded,
      arquivesToRead: filesName,
      date: new Date(),
    });

    return;
  });
}
