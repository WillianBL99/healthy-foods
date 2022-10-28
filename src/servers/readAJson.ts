import { transferPorductsToDatabase } from "./downloadProductsServer";

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

// show minutes of execution
(async () => {
  console.time('transferPorductsToDatabase testeeeeee');
  await transferPorductsToDatabase(filesName, 100);
  console.timeEnd('transferPorductsToDatabase testeeeeee');
})();
