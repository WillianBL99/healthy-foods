import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import ExceptionHandler from './events/AppError';
import { mongoDb } from './config';
import { informationRoute } from '@/routes';
import { DatabaseUpdateRoutine } from './servers/databaseUpdateRoutine';
import express, { Express, json } from 'express';
import { productsRoute } from './routes/productsRoute';

dotenv.config();
//const time = process.env.TIME_DATABASE_UPDATE ?? '00:00:00';
const t  = new Date();
const time = `${t.getHours()}:${t.getMinutes()}:${t.getSeconds() + 5}`;
const routine = new DatabaseUpdateRoutine(time);
routine.start();

const app = express()
  .use(json())
  .use(cors())
  .use(informationRoute)
  .use(productsRoute)
  .use(ExceptionHandler);

export async function init(): Promise<Express> {
  await mongoDb.connect();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  return await mongoDb.disconnect();
}

export default app;
