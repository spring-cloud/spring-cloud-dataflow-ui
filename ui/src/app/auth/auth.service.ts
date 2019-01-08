import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { SecurityInfo } from '../shared/model/about/security-info.model';
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils } from '../shared/support/http.utils';
import { LoggerService } from '../shared/services/logger.service';
import { catchError, flatMap, map } from 'rxjs/operators';

/**
 * The AuthService deals with all security-related services:
 * Logout, loading of security meta-information
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AuthService {

  /**
   * URL API
   */
  public static URL = {
    SECURITY_INFO: '/security/info',
    AUTHENTICATION: '/authenticate',
    LOGOUT: '/dashboard/logout'
  };

  /**
   * Current Auth Token
   * @type {string}
   */
  public xAuthToken = '';

  /**
   * Auth Token key name
   * @type {string}
   */
  private readonly xAuthTokenKeyName = 'xAuthToken';

  /**
   * Current Security Info
   */
  public securityInfo: SecurityInfo;

  /**
   * Observable Security Info
   * @type {Subject<SecurityInfo>}
   */
  public securityInfoSubject = new Subject<SecurityInfo>();

  /**
   * Constructor
   *
   * @param {HttpClient} http
   * @param {ErrorHandler} errorHandler
   * @param {LoggerService} loggerService
   */
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandler,
              private loggerService: LoggerService) {
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
    this.loggerService.log(`Loading SecurityInfo - Reconstitute security? ${reconstituteSecurity}`);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();

    if (reconstituteSecurity) {
      const xAuthToken = this.retrievePersistedXAuthToken();
      if (xAuthToken) {
        this.xAuthToken = xAuthToken;
      }
    }

    return this.http
      .get<any>(AuthService.URL.SECURITY_INFO, { headers: httpHeaders })
      .pipe(
        map(body => {
          this.securityInfo = new SecurityInfo().deserialize(body);
          this.securityInfoSubject.next(this.securityInfo);
          this.loggerService.log('SecurityInfo:', this.securityInfo);
          if (!this.securityInfo.isAuthenticationEnabled && this.xAuthToken) {
            this.xAuthToken = undefined;
            this.deletePersistedXAuthToken();
          }
          return this.securityInfo;
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Logs out the user. Upon logout a {@link SecurityInfo} will be
   * returned.
   */
  logout(): Observable<SecurityInfo> {
    this.loggerService.log('Logging out ...');
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    return this.http.get(AuthService.URL.LOGOUT, { headers: httpHeaders })
      .pipe(
        map(response => {
          this.clearLocalSecurity();
          return response;
        }),
        flatMap(() => {
          this.loggerService.log('Retrieving security info ...', httpHeaders);
          return this.loadSecurityInfo();
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Clears all security-relevant information from the local application:
   * - Calls `securityInfo.reset()`
   * - Deletes a persisted XAuthToken (Session Storage)
   */
  public clearLocalSecurity() {
    this.securityInfo.reset();
    this.xAuthToken = null;
    this.deletePersistedXAuthToken();
  }

  /**
   * Get the persisted Auth Token
   * @returns {string}
   */
  private retrievePersistedXAuthToken(): string {
    const token = sessionStorage.getItem(this.xAuthTokenKeyName);
    if (token) {
      return JSON.parse(token);
    }
    return undefined;
  }

  /**
   * Persist the Auth Token
   * @param {string} token
   */
  private persistXAuthToken(token: string) {
    sessionStorage.setItem(this.xAuthTokenKeyName, JSON.stringify(token));
  }

  /**
   * Clear the Auth Token
   */
  private deletePersistedXAuthToken() {
    sessionStorage.removeItem(this.xAuthTokenKeyName);
  }

}
