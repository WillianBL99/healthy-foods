import httpStatus from 'http-status';
import { AppError } from './AppError';

const NOT_FOUND = () => {
  return new AppError(
    'Product not found',
    httpStatus.NOT_FOUND,
    'Product not found',
    'verify if the product exists or if the code is correct'
  );
};

const CONFLICT_DELETE = () => {
  return new AppError(
    'Product already deleted',
    httpStatus.CONFLICT,
    'Product already deleted',
    'products with status trash cannot be deleted again'
  );
};

export { NOT_FOUND, CONFLICT_DELETE };
