import 'express-async-errors';
import express, { json } from 'express';
import ExceptionHandler from './events/AppError';
import cors from 'cors';
import { informationRoute } from '@/routes';

const app = express()
  .use(json())
  .use(cors())
  .use(informationRoute)
  .use(ExceptionHandler);

export default app;
