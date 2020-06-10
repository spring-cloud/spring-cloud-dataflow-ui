import { SecurityService } from '../../security/service/security.service';
import { Observable, of } from 'rxjs';
import { Security } from '../../shared/model/security.model';
import { LOAD } from '../data/security';

export class SecurityServiceMock {

  static mock: SecurityServiceMock = null;
  security: Security = Security.parse(LOAD);

  constructor() {
  }

  load(reconstituteSecurity = false): Observable<Security> {
    return of(Security.parse(LOAD));
  }

  logout(): Observable<any> {
    return of(Security.parse(LOAD));
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
