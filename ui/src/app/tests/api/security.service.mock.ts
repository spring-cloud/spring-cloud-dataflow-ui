import { SecurityService } from '../../security/service/security.service';
import { Observable, of } from 'rxjs';
import { Security } from '../../shared/model/security.model';
import { LOAD } from '../data/security';

export class SecurityServiceMock {

  static mock: SecurityServiceMock = null;

  constructor() {
  }

  async canAccess(roles: string[]): Promise<boolean> {
    return true;
  }

  load(): Observable<Security> {
    return of(LOAD as Security);
  }

  logout(): Observable<any> {
    return of(LOAD as Security);
  }

  loggedinUser(): Observable<string> {
    return of(undefined);
  }

  clearLocalSecurity() {
  }

  static get provider() {
    if (!SecurityServiceMock.mock) {
      SecurityServiceMock.mock = new SecurityServiceMock();
    }
    return { provide: SecurityService, useValue: SecurityServiceMock.mock };
  }
}
