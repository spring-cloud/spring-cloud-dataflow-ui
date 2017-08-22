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

@Injectable()
export class AuthService {

  private securityInfoUrl = '/security/info';
  private authenticationUrl = '/authenticate';
  private logoutUrl = '/dashboard/logout';

  public securityInfo: SecurityInfo;

  constructor(
    private http: Http,
    private errorHandler: ErrorHandler,
    private options: RequestOptions) {
    console.log('Constructing authService');
  }

  loadSecurityInfo(reconstituteSecurity = false): Observable<SecurityInfo> {
    console.log(`Loading SecurityInfo - Reconstitute security? ${reconstituteSecurity}`);

    if (reconstituteSecurity) {
      const xAuthToken = this.retrievePersistedXAuthToken();
      if (xAuthToken) {
        const o: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
        o.xAuthToken = xAuthToken;
        console.log('o.xAuthToken', o.xAuthToken);
      }
    }

    return this.http.get(this.securityInfoUrl)
                    .map(this.extractData.bind(this))
                    .catch(this.errorHandler.handleError);
  }

  login(loginRequest: LoginRequest): Observable<SecurityInfo> {
    console.log('loadSecurityInfo');
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.post(this.authenticationUrl, loginRequest, options)
                    .map(this.extractData.bind(this))
                    .flatMap((id: string) => {
                      console.log('Logging you in ...', this.options);
    const o: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
    o.xAuthToken = id;
    this.persistXAuthToken(id);

                      console.log(id);
                      return this.loadSecurityInfo();
                    })
                    .catch(this.errorHandler.handleError);
  }

  logout(): Observable<SecurityInfo> {
    console.log('loadSecurityInfo');
    const options = HttpUtils.getDefaultRequestOptions();
    return this.http.get(this.logoutUrl, options)
                    .map(response => {
                      this.securityInfo.reset();
                      const o: SecurityAwareRequestOptions = this.options as SecurityAwareRequestOptions;
                      o.xAuthToken = null;
                      return response;
                    })
                    .flatMap((response: Response) => {
                      console.log('Retrieving security info ...', this.options);
                      return this.loadSecurityInfo();
                    })
                    .catch(this.errorHandler.handleError);
  }

  private retrievePersistedXAuthToken(): string {

    const token = sessionStorage.getItem('xAuthToken');

    if (token) {
      return JSON.parse(token);
    }
    return undefined;

  }

  private persistXAuthToken(token: string) {
    sessionStorage.setItem('xAuthToken', JSON.stringify(token));
  }

  private deletePersistedXAuthToken() {
    sessionStorage.removeItem('xAuthToken');
  }

  private extractData(res: Response): SecurityInfo {
    const body = res.json();
    this.securityInfo = new SecurityInfo(
      body.authenticationEnabled,
      body.authorizationEnabled,
      body.formLogin,
      body.authenticated,
      body.username,
      body.roles as string[]);
    console.log('SecurityInfo:', this.securityInfo);
    return body;
  }
}
