import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store, select, props} from '@ngrx/store';
import {Observable} from 'rxjs';
import {catchError, mergeMap, take} from 'rxjs/operators';
import {HttpUtils} from '../../shared/support/http.utils';
import {ErrorUtils} from '../../shared/support/error.utils';
import {Security} from '../../shared/model/security.model';
import {
  State,
  getUsername,
  getRoles,
  getEnabled,
  getShouldProtect,
  getSecurity,
  getClientRegistrations,
  isOAuth2
} from '../store/security.reducer';
import {loaded, logout, unauthorised} from '../store/security.action';
import {UrlUtilities} from '../../url-utilities.service';

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

  loaded(enabled: boolean, authenticated: boolean, username: string, roles: string[], clientRegistrations: string[]): void {
    this.store.dispatch(loaded({enabled, authenticated, username, roles, clientRegistrations}));
  }

  unauthorised(): void {
    this.store.dispatch(
      unauthorised({
        authenticated: false,
        enabled: false,
        username: '',
        roles: [],
        clientRegistrations: []
    }));
  }

  securityEnabled(): Observable<boolean> {
    return this.store.pipe(select(getEnabled));
  }

  loggedinUser(): Observable<string> {
    return this.store.pipe(select(getUsername));
  }

  clientRegistrations(): Observable<string[]> {
    return this.store.pipe(select(getClientRegistrations));
  }

  roles(): Observable<string[]> {
    return this.store.pipe(select(getRoles));
  }

  shouldProtect(): Observable<boolean> {
    return this.store.pipe(select(getShouldProtect));
  }

  isOAuth2(): Observable<boolean> {
    return this.store.pipe(select(isOAuth2));
  }

  load(): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.http
      .get<Security>(UrlUtilities.calculateBaseApiUrl() + 'security/info', {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  getSecurity(): Observable<any> {
    return this.store.pipe(select(getSecurity));
  }

  logout(): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.http.get(UrlUtilities.calculateBaseApiUrl() + 'logout', {headers: headers, responseType: 'text'}).pipe(
      mergeMap(() => {
        const observable = this.load();
        observable.pipe().subscribe(securityContext => this.store.dispatch(logout(securityContext)));
        return observable;
      }),
      catchError(ErrorUtils.catchError)
    );
  }
}
