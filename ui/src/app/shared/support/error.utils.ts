import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { AppError, HttpError } from '../model/error.model';
import get from 'lodash.get';

export class ErrorUtils {

  public static catchError(error: Response | any) {
    const errorObject = {
      status: 0,
      message: ''
    };
    if (error instanceof HttpErrorResponse) {
      let body;
      errorObject.status = error.status;
      try {
        body = get(error, 'error', '');
        if (get(body, '_embedded.errors')) {
          body = get(body, '_embedded.errors');
        }
      } catch (e) {
        errorObject.message = `${error} (Status code: ${error.status})`;
      }
      if (body) {
        let isFirst = true;
        for (const bodyElement of body) {
          if (!isFirst) {
            errorObject.message += '\n';
          }
          errorObject.message += bodyElement.message;
          isFirst = false;
        }
      }
      return throwError(new HttpError(errorObject.message, errorObject.status));
    } else {
      errorObject.message = error.message ? error.message : error.toString();
      return throwError(new AppError(errorObject.message));
    }
  }

}
