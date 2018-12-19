import { Observable, Subject, of } from 'rxjs';
import { SecurityInfo } from '../../shared/model/about/security-info.model';
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
    this.securityInfo.isAuthenticated = true;
    this.securityInfo.username = 'Pele';
    this.securityInfo.roles = ['ROLE_VIEW', 'ROLE_CREATE', 'ROLE_MANAGE'];
    return of(this.securityInfo);
  }

  logout(): Observable<SecurityInfo> {
    this.securityInfo.reset();
    return of(this.securityInfo);
  }

  public clearLocalSecurity() {
    this.securityInfo.reset();
  }
}
