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

const ERROR_UNZIP_AND_SAVE_FILE = (error: Error) => {
  return new AppError(
    error,
    httpStatus.INTERNAL_SERVER_ERROR,
    'Error on unzip and save file'
  );
};

const ERROR_ON_DOWNLOAD_FILE = (error: Error) => {
  return new AppError(
    error,
    httpStatus.INTERNAL_SERVER_ERROR,
    'Error on download file',
    'verify if the url is correct'
  );
};

export {
  NOT_FOUND,
  CONFLICT_DELETE,
  ERROR_UNZIP_AND_SAVE_FILE,
  ERROR_ON_DOWNLOAD_FILE,
};
