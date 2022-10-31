import { getProducts } from '@/controllers/productsController';
import { validateSchema } from '@/middlewares/validateSchemaMiddleware';
import { productsSchema } from '@/schemas/productsSchema';
import { Router } from 'express';

const productsRoute = Router();

productsRoute.get('/products', validateSchema(productsSchema.get), getProducts);

export { productsRoute };
