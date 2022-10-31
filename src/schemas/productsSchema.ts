import Joi from "joi";

const get = Joi.object({
  page: Joi.number().integer().min(0),
  pagination: Joi.number().integer().min(0),
})

const productsSchema = {
  get,
};

export { productsSchema };