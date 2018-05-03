/**
 * Generic App Error
 */
export class AppError {

  /**
   * Message
   */
  message: string;

  /**
   * Constructor
   * @param {string} message
   */
  constructor(message: string) {
    this.message = message;
  }

  /**
   * Verify the object is an HttpAppError
   *
   * @param error
   * @returns {boolean}
   */
  static is(error): error is AppError {
    return true;
  }

  /**
   * Get message
   *
   * @returns {string}
   */
  getMessage() {
    return this.message;
  }
}

/**
 * API Error
 */
export class HttpAppError extends AppError {

  /**
   * Status code
   */
  httpStatusCode: number;

  /**
   * Constructor
   * @param {string} message
   * @param {number} httpStatusCode
   */
  constructor(message: string, httpStatusCode: number) {
    super(message);
    this.httpStatusCode = httpStatusCode;
  }

  /**
   * Verify the object is an HttpAppError
   *
   * @param error
   * @returns {boolean}
   */
  static is(error): error is HttpAppError {
    return true;
  }

  /**
   * Verify the object is an HttpAppError
   * and the status code equal to 404
   *
   * @param error
   * @returns {boolean}
   */
  static is404(error): error is HttpAppError {
    return error.httpStatusCode === 404;
  }

  /**
   * Verify the object is an HttpAppError
   * and the status code equal to 400
   *
   * @param error
   * @returns {boolean}
   */
  static is400(error): error is HttpAppError {
    return error.httpStatusCode === 400;
  }

  /**
   * Get message
   *
   * @returns {string}
   */
  getMessage() {
    return super.getMessage();
  }

}
