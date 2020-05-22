export class AppError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  static is(error): error is AppError {
    return true;
  }

  getMessage() {
    return this.message;
  }

  toString() {
    return this.message;
  }
}

export class HttpError extends AppError {

  httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }

  static is(error): error is HttpError {
    return true;
  }

  static is404(error): boolean {
    if (HttpError.is(error)) {
      return error.httpStatusCode === 404;
    }
    return false;
  }

  static is400(error): boolean {
    if (HttpError.is(error)) {
      return error.httpStatusCode === 400;
    }
    return false;
  }

  getMessage() {
    return super.getMessage();
  }

}
