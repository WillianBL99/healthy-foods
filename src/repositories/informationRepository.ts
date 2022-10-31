import { mongoDb } from '@/config';
import { Information } from '@/interfaces';
import { WithId } from 'mongodb';

async function insertInformation(information: Information) {
  await mongoDb.information(async (collection) => {
    await collection.insertOne(information);
  });
}

async function getLastInformation(): Promise<WithId<Information> | null> {
  return mongoDb.information(async (collection) => {
    return await collection.findOne({}, { sort: { date: -1 } }) as WithId<Information> | null;
  });
}

const informationRepository = {
  insertInformation,
  getLastInformation,
};

export { informationRepository };
