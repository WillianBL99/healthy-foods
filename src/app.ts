import 'express-async-errors';
import express, { json } from 'express';
import ExceptionHandler from './events/AppError';
import cors from 'cors';

const app = express()
  .use(json())
  .use(cors())
  .use(ExceptionHandler);

export default app;