export class AppError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }

  static is(error: any): error is AppError {
    return true;
  }

  getMessage(): string {
    return this.message;
  }

  toString(): string {
    return this.message;
  }
}

export class HttpError extends AppError {
  httpStatusCode: number;

  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }

  static is(error: any): error is HttpError {
    return true;
  }

  static is404(error: any): boolean {
    if (HttpError.is(error)) {
      return error.httpStatusCode === 404;
    }
    return false;
  }

  static is400(error: any): boolean {
    if (HttpError.is(error)) {
      return error.httpStatusCode === 400;
    }
    return false;
  }

  getMessage(): string {
    return super.getMessage();
  }
}
