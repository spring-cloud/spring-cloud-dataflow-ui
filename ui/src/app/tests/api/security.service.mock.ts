import {SecurityService} from '../../security/service/security.service';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ErrorUtils} from '../../shared/support/error.utils';
import {Security} from '../../shared/model/security.model';
import {LOAD} from '../data/security';

export class SecurityServiceMock {
  static mock: SecurityServiceMock = null;

  constructor() {}

  async canAccess(roles: string[]): Promise<boolean> {
    return true;
  }

  load(): Observable<Security> {
    return of(LOAD as Security);
  }

  logout(): Observable<Security | unknown> {
    return of(LOAD as Security).pipe(catchError(ErrorUtils.catchError));
  }

  loggedinUser(): Observable<string> {
    return of(undefined);
  }

  clearLocalSecurity(): void {}

  static get provider(): any {
    if (!SecurityServiceMock.mock) {
      SecurityServiceMock.mock = new SecurityServiceMock();
    }
    return {provide: SecurityService, useValue: SecurityServiceMock.mock};
  }
}
