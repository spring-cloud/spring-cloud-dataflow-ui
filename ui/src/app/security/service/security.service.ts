import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HttpUtils } from '../../shared/support/http.utils';
import { ErrorUtils } from '../../shared/support/error.utils';
import { Security } from '../../shared/model/security.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly xAuthTokenKeyName = 'xAuthToken';
  private securitySubject = new BehaviorSubject<Security>(undefined);
  xAuthToken = '';
  security: Security;

  constructor(private http: HttpClient) {
  }

  load(reconstituteSecurity = false): Observable<Security> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    if (reconstituteSecurity) {
      const xAuthToken = this.retrievePersistedXAuthToken();
      if (xAuthToken) {
        this.xAuthToken = xAuthToken;
      }
    }
    return this.http.get<any>('/security/info', { headers })
      .pipe(
        map(Security.parse),
        map((security: Security) => {
          this.securitySubject.next(security);
          if (!security.isAuthenticationEnabled && this.xAuthToken) {
            this.xAuthToken = undefined;
            this.deletePersistedXAuthToken();
          }
          this.security = security;
          return security;
        }),
        catchError(ErrorUtils.catchError)
      );
  }

  logout(): Observable<Security> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.http.get('/dashboard/logout', { headers })
      .pipe(
        map(response => {
          this.clearLocalSecurity();
          return response;
        }),
        flatMap(() => {
          return this.load();
        }),
        catchError(ErrorUtils.catchError)
      );
  }

  clearLocalSecurity() {
    this.security.reset();
    this.xAuthToken = null;
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
