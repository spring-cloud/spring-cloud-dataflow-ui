import { Headers, RequestOptions } from '@angular/http';

/**
 * Contains common HTTP-related helper methods.
 *
 * @author Gunnar Hillert
 */
export class HttpUtils {
  public static getDefaultRequestOptions() {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return options;
  }
}
