import { InformationDB } from '@/interfaces';
import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';

const listArquives = [
  'product1.json.gz',
  'product2.json.gz',
  'product3.json.gz',
  'product4.json.gz',
];

const information: InformationDB = {
  _id: new ObjectId(faker.database.mongodbObjectId()),
  arquivesToRead: listArquives,
  arquivesReaded: listArquives,
  productsInserted: faker.datatype.number(),
  productsUpdated: faker.datatype.number(),
  date: new Date(faker.date.past()),
};

function getInformation(): InformationDB | null {
  return information;
}

const informationFactory = {
  getInformation,
};

export { informationFactory };
