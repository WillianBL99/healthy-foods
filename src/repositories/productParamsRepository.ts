import { Models } from '@/config';
import { ProductParams } from '@/interfaces';
import { ObjectId } from 'mongodb';

type ProductParamsDB = {
  _id: ObjectId;
  params: ProductParams;
};
async function getParams(_id: ObjectId) {
  const paramsFinded = (await Models.paramsUpdated().findOne({
    _id,
  })) as ProductParamsDB | null;
  return paramsFinded?.params || [];
}

async function pushParams(_id: ObjectId, params: ProductParams) {
  await Models.paramsUpdated().updateOne(
    { _id },
    { $push: { params: { $each: params } } },
    { upsert: true }
  );
}

const productParamsRepository = {
  getParams,
  pushParams,
};

export { productParamsRepository };
