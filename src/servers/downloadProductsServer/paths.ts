const BASE_URL = 'http://challenges.coode.sh/food/data/json';
const LOCAL_PATH = './src/servers/data';
const filesName = [
  'products_01.json.gz',
  'products_02.json.gz',
  // 'products_03.json.gz',
  // 'products_04.json.gz',
  // 'products_05.json.gz',
  // 'products_06.json.gz',
  // 'products_07.json.gz',
  // 'products_08.json.gz',
  // 'products_09.json.gz',
];

const zipFileUrl = (fileName: string) => `${BASE_URL}/${fileName}`;
const jsonFileLocalPath = (fileName: string) =>
  `${LOCAL_PATH}/${fileName.replace('.gz', '')}`;

const paths = {
  BASE_URL,
  LOCAL_PATH,
  filesName,
  zipFileUrl,
  jsonFileLocalPath,
};

export { paths };
