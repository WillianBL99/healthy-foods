import 'express-async-errors';
import express, { Express, json } from 'express';
import ExceptionHandler from './events/AppError';
import cors from 'cors';
import { informationRoute } from '@/routes';
import { DatabaseUpdateRoutine } from './servers/databaseUpdateRoutine';
import { mongoDb } from './config';
const routine = new DatabaseUpdateRoutine(13, 16, 0);
routine.start();

const app = express()
  .use(json())
  .use(cors())
  .use(informationRoute)
  .use(ExceptionHandler);

export async function init(): Promise<Express> {
  await mongoDb.connect();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  return await mongoDb.disconnect();
}

export default app;
