import { Headers, RequestOptions, URLSearchParams } from '@angular/http';

/**
 * Contains common HTTP-related helper methods.
 *
 * @author Gunnar Hillert
 */
export class HttpUtils {
  public static getDefaultRequestOptions() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const options = new RequestOptions({ headers: headers });

    return options;
  }

  public static getPaginationParams(page: number, size: number): URLSearchParams {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('size', size.toString());

    return params;
  }
}
