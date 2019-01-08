import { ErrorHandler } from '../shared/model';
import { AuthService } from './auth.service';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

describe('AuthService', () => {

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {
      'authenticationEnabled': true,
      'authenticated': true,
      'username': 'foo',
      'roles':
      [
      ],
      '_links':
      {
        'self':
          {
            'href': 'http://localhost:9393/security/info'
          }
        }
      };

    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    this.authService = new AuthService(this.mockHttp, errorHandler, loggerService);
  });

  describe('loadSecurityInfo', () => {
    it('should call the "security/info" REST endpoint', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));

      expect(this.authService.securityInfo).toBeUndefined();
      this.authService.loadSecurityInfo();

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/security/info');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });
  });

  describe('logout', () => {
    it('should call logout REST endpoint', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.authService.logout();

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/dashboard/logout');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });
});
