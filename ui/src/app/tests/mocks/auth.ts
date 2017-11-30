import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { SecurityInfo } from '../../auth/model/security-info.model';
import { LoginRequest } from '../../auth/model/login-request.model';

/**
 * Mock for AuthService.
 *
 * @author Gunnar Hillert
 */
export class MockAuthService {

  public securityInfo = new SecurityInfo();
  public securityInfoSubject = new Subject<SecurityInfo>();

  login(loginRequest: LoginRequest): Observable<SecurityInfo> {

    this.securityInfo.isAuthenticationEnabled = true;
    this.securityInfo.isAuthorizationEnabled = true;
    this.securityInfo.isFormLogin = true;
    this.securityInfo.isAuthenticated = true;
    this.securityInfo.username = 'Pele';
    this.securityInfo.roles = ['ROLE_VIEW', 'ROLE_CREATE', 'ROLE_MANAGE'];

    return Observable.of(this.securityInfo);
  }

  logout(): Observable<SecurityInfo> {
    this.securityInfo.reset();
    return Observable.of(this.securityInfo);
  }
}
