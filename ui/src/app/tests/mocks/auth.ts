import { Observable, Subject, of } from 'rxjs';
import { SecurityInfo } from '../../shared/model/about/security-info.model';

/**
 * Mock for AuthService.
 *
 * @author Gunnar Hillert
 */
export class MockAuthService {

  public securityInfo = new SecurityInfo();
  public securityInfoSubject = new Subject<SecurityInfo>();

  logout(): Observable<SecurityInfo> {
    this.securityInfo.reset();
    return of(this.securityInfo);
  }

  public clearLocalSecurity() {
    this.securityInfo.reset();
  }
}
