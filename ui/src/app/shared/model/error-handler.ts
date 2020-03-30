import { throwError } from 'rxjs';
import { AppError, HttpAppError } from './error.model';
import { LoggerService } from '../services/logger.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
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
    if (error instanceof HttpErrorResponse) {
      let body;
      errorObject.status = error.status;
      try {
        body = error.error || '';
      } catch (e) {
        LoggerService.log('Unparsable json', error);
        errorObject.message = `${error} (Status code: ${error.status})`;
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
      return throwError(new HttpAppError(errorObject.message, errorObject.status));
    } else {
      errorObject.message = error.message ? error.message : error.toString();
      return throwError(new AppError(errorObject.message));
    }
  }

}

