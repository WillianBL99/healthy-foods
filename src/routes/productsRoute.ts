import {
  deleteProduct,
  getProduct,
  getProducts,
} from '@/controllers/productsController';
import { validateParams } from '@/middlewares/validateSchemaMiddleware';
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

export { productsRoute };
