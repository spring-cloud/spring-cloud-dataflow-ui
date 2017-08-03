import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

export class ErrorHandler {

    /**
     * Generate the error message that will be used and throw the appropriate exception.
     * @param error the exception that was thrown by the http post.
     * @returns {any} Exception to be thrown by the Observable
     */
    public handleError(error: Response | any) {
        let errMsg = '';
        if (error instanceof Response) {
            let body;
            try {
              body = error.json() || '';
            } catch (e) {
              console.log('Unparsable json', error);
              errMsg = `${error.text()} (Status code: ${error.status})`;
            }
            if (body) {
                let isFirst = true;
                for (const bodyElement of body) {
                    if (!isFirst) {
                        errMsg += '\n';
                    } else {
                        isFirst = false;
                    }
                    errMsg += bodyElement.message;
                }
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}

