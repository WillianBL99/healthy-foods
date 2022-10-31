import { NextFunction, Request, Response } from 'express';
import AppError from '@/config/error';
import AppLog from '@/events/AppLog';
import { BSONTypeError } from 'bson';

function ExceptionHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { log, statusCode, message, detail } = error;

  AppLog('Error', log || error);

  if (error instanceof AppError) {
    return res.status(statusCode).send({ message, detail });
  } else if (error instanceof BSONTypeError) {
    return res
      .status(400)
      .send({
        message: 'Invalid ObjectID',
        detail: 'make sure you are using a valid ObjectID',
      });
  } else {
    return res.status(500).send({
      message: 'Internal server error',
    });
  }
}

export { AppError };
export default ExceptionHandler;
