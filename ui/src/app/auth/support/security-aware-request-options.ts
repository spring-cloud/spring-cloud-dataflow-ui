import { Injectable } from '@angular/core';
import { RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';

/**
 * A custom class extending {@link RequestOptions} to provide
 * the ability to use and set a custom xAuthToken header.
 *
 * @author Gunnar Hillert
 */
export class DefaultRequestOptions extends RequestOptions {

  constructor(options: RequestOptionsArgs) {
    super(options);
  }

  private xAuthTokenHeaderName = 'x-auth-token';

  merge(options: RequestOptions) {
    const newRequestOptions = super.merge(options);

    if (ValueHolder.xAuthToken) {
      if (!newRequestOptions.headers) {
        newRequestOptions.headers = new Headers();
      }
      newRequestOptions.headers.append(this.xAuthTokenHeaderName, ValueHolder.xAuthToken);
    }

    return new DefaultRequestOptions({
      method: newRequestOptions.method,
      headers: newRequestOptions.headers,
      body: newRequestOptions.body,
      url: newRequestOptions.url,
      search: newRequestOptions.search,
      withCredentials: newRequestOptions.withCredentials,
      responseType: newRequestOptions.responseType
    });
  }

}

/**
 * A custom class extending {@link DefaultRequestOptions} to provide
 * the ability to use and set a custom xAuthToken header.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class SecurityAwareRequestOptions extends DefaultRequestOptions {

  constructor() {
    super({headers: new Headers()});
  }

  public set xAuthToken(xAuthToken: string) {
    ValueHolder.xAuthToken = xAuthToken;
  }

  public get xAuthToken(): string {
    return ValueHolder.xAuthToken;
  }

  merge(options: RequestOptions) {
    return super.merge(options);
  }
}

/**
 * Work-around to the fact that Angular re-instantiates
 * RequestOptions internally for POST requests. Therefore
 * setting a property does not work and we have to resort
 * to using a static property on this ValueHolder class.
 */
class ValueHolder {
  static xAuthToken: string;
}
