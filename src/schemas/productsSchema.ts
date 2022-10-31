import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(0),
  pagination: Joi.number().integer().min(0),
})

const getOne = Joi.object({
  code: Joi.string().required(),
})

const productsSchema = {
  get,
  getOne,
};

export { productsSchema };