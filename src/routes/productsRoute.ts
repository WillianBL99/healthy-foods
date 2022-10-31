import {
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '@/controllers/productsController';
import { validateBody, validateParams } from '@/middlewares/validateSchemaMiddleware';
import { productsSchema } from '@/schemas/productsSchema';
import { Router } from 'express';

const productsRoute = Router();

productsRoute.get('/products', getProducts);
productsRoute.get(
  '/products/:code',
  validateParams(productsSchema.codeParam),
  getProduct
);
productsRoute.delete(
  '/products/:code',
  validateParams(productsSchema.codeParam),
  deleteProduct
);
productsRoute.put(
  '/products/:code',
  validateParams(productsSchema.codeParam),
  validateBody(productsSchema.update),
  updateProduct
);

export { productsRoute };
