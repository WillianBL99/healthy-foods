import { ObjectSchema } from 'joi';
import { NextFunction, Request, Response } from 'express';
import AppError from '@/config/error';

export function validateSchema(schema: ObjectSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { body } = req;
    const { error } = schema.validate(body, { abortEarly: false });

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

  const textReplaced = message.replace(regex, '\'').replace(regex, '\'');
  return textReplaced;
}
