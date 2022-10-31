import { ProductSchema } from '@/interfaces';
import Joi from 'joi';

const get = Joi.object({
  page: Joi.number().integer().min(0),
  pagination: Joi.number().integer().min(0),
});

const codeParam = Joi.object({
  code: Joi.string().required(),
});

const regexNumber = /^[0-9]+$/;
const update = Joi.object<ProductSchema>({
  brands: Joi.string(),
  categories: Joi.string(),
  cities: Joi.string(),
  image_url: Joi.string(),
  ingredients_text: Joi.string(),
  labels: Joi.string(),
  main_category: Joi.string(),
  nutriscore_grade: Joi.string(),
  nutriscore_score: Joi.string().regex(regexNumber),
  product_name: Joi.string(),
  purchase_places: Joi.string(),
  quantity: Joi.string(),
  serving_quantity: Joi.string().regex(regexNumber),
  serving_size: Joi.string(),
  stores: Joi.string(),
  traces: Joi.string(),
  url: Joi.string(),
}).min(1);

const productsSchema = {
  get,
  update,
  codeParam,
};

export { productsSchema };
