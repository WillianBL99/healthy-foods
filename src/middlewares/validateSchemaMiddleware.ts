import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import AppError from '@/config/error';

export function validateBody(schema: ObjectSchema) {
  return validate(schema, 'body');
}

export function validateParams(schema: ObjectSchema) {
  return validate(schema, 'params');
}

function validate(schema: ObjectSchema, type: 'body' | 'params') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[type], { abortEarly: false });

    if (error) {
      const message = error.details.map(handleErrorDetails);

      throw new AppError(
        'Bad body request',
        422,
        message.join(' | '),
        'Make sure to send a correct body request'
      );
    }

    next();
  };
}

function handleErrorDetails(detail: any) {
  const { message } = detail;
  const regex = /"/g;

  const textReplaced = message.replace(regex, "'").replace(regex, "'");
  return textReplaced;
}
