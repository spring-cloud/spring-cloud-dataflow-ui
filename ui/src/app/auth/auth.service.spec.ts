import { Observable } from 'rxjs/Observable';

import { HttpUtils } from '../shared/support/http.utils';
import { ErrorHandler } from '../shared/model';

import { AuthService } from './auth.service';
import { SecurityInfo } from '../shared/model/about/security-info.model';
import { LoginRequest } from './model/login-request.model';
import { LoggerService } from '../shared/services/logger.service';

describe('AuthService', () => {

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {
      'authenticationEnabled': true,
      'authorizationEnabled': true,
      'formLogin': true,
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
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      expect(this.authService.securityInfo).toBeUndefined();
      this.authService.loadSecurityInfo();

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/security/info');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });
  });

  describe('login', () => {
    it('should call the authentication REST endpoint', () => {
      this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
      const loginRequest = new LoginRequest('foo', 'password123');
      this.authService.login(loginRequest);

      const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
      const payload = this.mockHttp.post.calls.mostRecent().args[1];
      const headerArgs = this.mockHttp.post.calls.mostRecent().args[2].headers;
      expect(httpUri).toEqual('/authenticate');
      expect(payload).toEqual(JSON.stringify(loginRequest).trim());
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  describe('logout', () => {
    it('should call logout REST endpoint', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.authService.logout();

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/dashboard/logout');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });
});
