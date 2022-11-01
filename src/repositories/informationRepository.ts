import { Models } from '@/config';
import { Information, InformationDB } from '@/interfaces';

async function insertInformation(information: Information) {
  await Models.information().insertOne(information);
}

async function getLastInformation(): Promise<InformationDB | null> {
  return (await Models.information().findOne(
    {},
    { sort: { date: -1 } }
  )) as InformationDB | null;
}

const informationRepository = {
  insertInformation,
  getLastInformation,
};

export { informationRepository };
