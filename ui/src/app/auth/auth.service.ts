import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { SecurityInfo } from './model/security-info.model';
import { LoginRequest } from './model/login-request.model';
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils } from '../shared/support/http.utils';
import { SecurityAwareRequestOptions } from './support/security-aware-request-options';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
 * The AuthService deals with all security-related services:
 *
 * - Login
 * - Logout
 * - Loading of security meta-information
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AuthService {

  private securityInfoUrl = '/security/info';
  private authenticationUrl = '/authenticate';
  private logoutUrl = '/dashboard/logout';

  private readonly xAuthTokenKeyName = 'xAuthToken';

  public securityInfo: SecurityInfo;
  public securityInfoSubject = new Subject<SecurityInfo>();

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler,
    private options: RequestOptions) {
  }

  /**
   * Loading of security meta-information. E.g. used upon booting
   * up the application in order to determine whether security (login)
   * is needed.
   *
   * @param reconstituteSecurity Shall the logged-in security state
   * be restored from a potentially persisted 'xAuthToken'.
   */
  loadSecurityInfo(reconstituteSecurity = false): Observable<SecurityInfo> {
    console.log(`Loading SecurityInfo - Reconstitute security? ${reconstituteSecurity}`);
    const requestOptions: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
    const options = HttpUtils.getDefaultRequestOptions();

    if (reconstituteSecurity) {
      const xAuthToken = this.retrievePersistedXAuthToken();
      if (xAuthToken) {
        requestOptions.xAuthToken = xAuthToken;
      }
    }

    return this.http.get(this.securityInfoUrl, options)
                    .map(response => {
                      const body = response.json();
                      this.securityInfo = new SecurityInfo().deserialize(body);
                      this.securityInfoSubject.next(this.securityInfo);
                      console.log('SecurityInfo:', this.securityInfo);
                      if (!this.securityInfo.isAuthenticationEnabled
                        && requestOptions.xAuthToken) {
                        requestOptions.xAuthToken = undefined;
                        this.deletePersistedXAuthToken();
                      }
                      return this.securityInfo;
                    })
                    .catch(this.errorHandler.handleError);
  }

  /**
   * Logs in a user based on the provided {@link LoginRequest}. If the login
   * was successful, the retrieved xAuthToken will be persisted (Session
   * Storage) and the the xAuthToken will also be set in
   * {@link SecurityAwareRequestOptions}. Upon login a {@link SecurityInfo}
   * will be returned.
   *
   * @param loginRequest The login-request holding username and password
   */
  login(loginRequest: LoginRequest): Observable<SecurityInfo> {
    console.log(`Logging in user ${loginRequest.username}.`);
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.post(this.authenticationUrl, JSON.stringify(loginRequest), options)
                    .map(response => {
                      return response.json() as string;
                    })
                    .flatMap((id: string) => {
                      console.log('Logging you in ...', this.options);
                      const o: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
                      o.xAuthToken = id;
                      this.persistXAuthToken(id);
                      return this.loadSecurityInfo();
                    })
                    .catch(this.errorHandler.handleError);
  }

  /**
   * Logs out the user. Upon logout a {@link SecurityInfo} will be
   * returned.
   */
  logout(): Observable<SecurityInfo> {
    console.log('Logging out ...');
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.get(this.logoutUrl, options)
                    .map(response => {
                      this.clearLocalSecurity();
                      return response;
                    })
                    .flatMap((response: Response) => {
                      console.log('Retrieving security info ...', this.options);
                      return this.loadSecurityInfo();
                    })
                    .catch(this.errorHandler.handleError);
  }

  /**
   * Clears all security-relevant information from the local application:
   *
   * - Calls `securityInfo.reset()`
   * - Deletes a persisted XAuthToken (Session Storage)
   *
   */
  public clearLocalSecurity() {
    this.securityInfo.reset();
    const o: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
    o.xAuthToken = null;
    this.deletePersistedXAuthToken();
  }

  private retrievePersistedXAuthToken(): string {
    const token = sessionStorage.getItem(this.xAuthTokenKeyName);
    if (token) {
      return JSON.parse(token);
    }
    return undefined;

  }

  private persistXAuthToken(token: string) {
    sessionStorage.setItem(this.xAuthTokenKeyName, JSON.stringify(token));
  }

  private deletePersistedXAuthToken() {
    sessionStorage.removeItem(this.xAuthTokenKeyName);
  }
}
