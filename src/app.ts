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
// const time = process.env.TIME_DATABASE_UPDATE ?? '00:00:00';
// start in 10 seconds
const now = new Date();
const time = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  now.getHours(),
  now.getMinutes(),
  now.getSeconds() + 5
);
const routine = new DatabaseUpdateRoutine(`${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`);
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
