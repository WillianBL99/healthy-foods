import { Models } from '@/config';
import { ProductParams } from '@/interfaces';
import { ObjectId } from 'mongodb';

async function getParams(_id: ObjectId) {
  const params = await Models.paramsUpdated().findOne({ _id });
  return params as ProductParams | null;
}

async function pushParams(_id: string, params: ProductParams) {
  await Models.paramsUpdated().updateOne(
    { _id },
    { $push: { params: { $each: params } } }
  );
}

const productParamsRepository = {
  getParams,
  pushParams,
};

export { productParamsRepository };
