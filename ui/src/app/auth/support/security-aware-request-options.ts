import { Injectable } from '@angular/core';
import { BaseRequestOptions, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * A custom class extending {@link BaseRequestOptions} to provide
 * the ability to use and set a custom xAuthToken header.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class SecurityAwareRequestOptions extends BaseRequestOptions {

  private xAuthTokenHeaderName = 'x-auth-token';
  public xAuthToken: string;

  constructor() {
    super();
  }

  /**
   * Overrides {@link BaseRequestOptions}'s merge method.
   * If the xAuthToken is set the respective HTTP header will be set.
   */
  merge(options?: RequestOptionsArgs): RequestOptions {
    if (this.xAuthToken) {
      if (options) {
        if (!options.headers) {
          options.headers = new Headers();
        }
        options.headers.append(this.xAuthTokenHeaderName, this.xAuthToken);
      }
    }
    return super.merge(options);
  }
}
