import { HttpHeaders, HttpParams } from '@angular/common/http';

/**
 * Contains common HTTP-related helper methods.
 *
 * @author Gunnar Hillert
 */
export class HttpUtils {

  public static getDefaultHttpHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return headers;
  }

  public static getPaginationParams(page: number, size: number): HttpParams {
    const params = new HttpParams()
      .append('page', page.toString())
      .append('size', size.toString());

    return params;
  }
}
