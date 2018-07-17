import { Observable } from 'rxjs/Observable';
import { AppError, HttpAppError } from './error.model';
import { LoggerService } from '../services/logger.service';

export class ErrorHandler {

  /**
   * Generate the error message that will be used and throw the appropriate exception.
   * @param error the exception that was thrown by the http post.
   * @returns {any} Exception to be thrown by the Observable
   */
  public handleError(error: Response | any) {
    const errorObject = {
      status: 0,
      message: ''
    };

    if (error instanceof Response) {
      let body;
      errorObject.status = error.status;
      try {
        body = error.json() || '';
      } catch (e) {
        LoggerService.log('Unparsable json', error);
        errorObject.message = `${error.text()} (Status code: ${error.status})`;
      }
      if (body) {
        let isFirst = true;
        for (const bodyElement of body) {
          if (!isFirst) {
            errorObject.message += '\n';
          } else {
            isFirst = false;
          }
          errorObject.message += bodyElement.message;
        }
      }
      return Observable.throwError(new HttpAppError(errorObject.message, errorObject.status));
    } else {
      errorObject.message = error.message ? error.message : error.toString();
      return Observable.throwError(new AppError(errorObject.message));
    }
  }

}

