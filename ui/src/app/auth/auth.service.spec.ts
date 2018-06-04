import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpUtils } from '../shared/support/http.utils';
import { ErrorHandler } from '../shared/model';

import { AuthService } from './auth.service';
import { SecurityInfo } from '../shared/model/about/security-info.model';
import { LoginRequest } from './model/login-request.model';
import { SecurityAwareRequestOptions } from './support/security-aware-request-options';
import { LoggerService } from '../shared/services/logger.service';

describe('AuthService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
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
    const securityAwareRequestOptions = new SecurityAwareRequestOptions();
    const loggerService = new LoggerService();
    this.authService = new AuthService(this.mockHttp, errorHandler, loggerService, securityAwareRequestOptions);
  });

  describe('loadSecurityInfo', () => {
    it('should call the "security/info" REST endpoint', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      expect(this.authService.securityInfo).toBeUndefined();
      this.authService.loadSecurityInfo();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/security/info', HttpUtils.getDefaultRequestOptions());
    });
  });

  describe('login', () => {
    it('should call the authentication REST endpoint', () => {
      this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
      const loginRequest = new LoginRequest('foo', 'password123');
      this.authService.login(loginRequest);

      expect(this.mockHttp.post).toHaveBeenCalledWith(
        '/authenticate',
        JSON.stringify(loginRequest).trim(),
        HttpUtils.getDefaultRequestOptions());
    });
  });

  describe('logout', () => {
    it('should call logout REST endpoint', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.authService.logout();
      expect(this.mockHttp.get).toHaveBeenCalledWith(
        '/dashboard/logout', HttpUtils.getDefaultRequestOptions());
    });
  });
});
