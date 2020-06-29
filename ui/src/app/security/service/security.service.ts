import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, flatMap, take } from 'rxjs/operators';
import { HttpUtils } from '../../shared/support/http.utils';
import { ErrorUtils } from '../../shared/support/error.utils';
import { Security } from '../../shared/model/security.model';
import { State, getUsername, getRoles, getEnabled, getShouldProtect, getSecurity } from '../store/security.reducer';
import { loaded, logout, unauthorised } from '../store/security.action';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private http: HttpClient,
    private store: Store<State>
  ) {}

  async canAccess(roles: string[]): Promise<boolean> {
    const securityEnabled = await this.store.pipe(select(getEnabled)).pipe(take(1)).toPromise();
    if (!securityEnabled) {
      return true;
    } else {
      const grantedRoles = await this.store.pipe(select(getRoles)).pipe(take(1)).toPromise();
      return this.arrayContains(grantedRoles, roles);
    }
  }

  private arrayContains(left: string[], right: string[]): boolean {
    if (right.length === 0) {
      return true;
    }
    const [arr1, arr2] = left.length < right.length ? [left, right] : [right, left];
    return arr1.some(i => arr2.includes(i));
  }

  loaded(enabled: boolean, authenticated: boolean, username: string, roles: string[]) {
    this.store.dispatch(loaded({enabled, authenticated, username, roles}));
  }

  unauthorised() {
    this.store.dispatch(unauthorised());
  }

  securityEnabled(): Observable<boolean> {
    return this.store.pipe(select(getEnabled));
  }

  loggedinUser(): Observable<string> {
    return this.store.pipe(select(getUsername));
  }

  roles(): Observable<string[]> {
    return this.store.pipe(select(getRoles));
  }

  shouldProtect(): Observable<boolean> {
    return this.store.pipe(select(getShouldProtect));
  }

  load(): Observable<Security> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.http.get<Security>('/security/info', { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  getSecurity() {
    return this.store.pipe(select(getSecurity));
  }

  logout(): Observable<Security> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.http.get('/logout', { headers: headers, responseType: 'text' })
      .pipe(
        flatMap(() => {
          this.store.dispatch(logout());
          return this.load();
        }),
        catchError(ErrorUtils.catchError)
      );
  }
}
