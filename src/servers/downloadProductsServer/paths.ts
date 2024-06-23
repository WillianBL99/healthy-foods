const BASE_URL = 'http://challenges.coode.sh/food/data/json';
const FILES_URL = `${BASE_URL}/index.txt`;

const zipFileUrl = (fileName: string) => `${BASE_URL}/${fileName}`;

const paths = {
  BASE_URL,
  FILES_URL,
  zipFileUrl,
};

export { paths };
