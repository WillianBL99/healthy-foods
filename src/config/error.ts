class AppError {
  log: string | Error;
  statusCode: number;
  message: string;
  detail: string;

  constructor(
    log: string | Error = 'Something went wrong',
    statusCode = 400,
    message = 'Something went wrong',
    detail = 'An unexpected error occurred'
  ) {
    this.log = log;
    this.statusCode = statusCode;
    this.message = message;
    this.detail = detail;
  }
}

export default AppError;
