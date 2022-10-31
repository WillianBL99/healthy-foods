import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(0),
  pagination: Joi.number().integer().min(0),
})

const codeParam = Joi.object({
  code: Joi.string().required(),
})

const productsSchema = {
  get,
  codeParam,
};

export { productsSchema };