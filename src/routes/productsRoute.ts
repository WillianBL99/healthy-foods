import { getProduct, getProducts } from '@/controllers/productsController';
import { validateParams } from '@/middlewares/validateSchemaMiddleware';
import { productsSchema } from '@/schemas/productsSchema';
import { Router } from 'express';

const productsRoute = Router();

productsRoute.get('/products', getProducts);
productsRoute.get(
  '/products/:code',
  validateParams(productsSchema.getOne),
  getProduct
);

export { productsRoute };
