import { HttpUtils } from '../support/http.utils';
import { ErrorHandler } from '../model';
import { PageRequest } from '../model/pagination/page-request.model';
import { SharedAppsService } from './shared-apps.service';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';

describe('SharedAppsService', () => {

  beforeEach(() => {
    this.mockHttp = {
      get: jasmine.createSpy('get')
    };
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    this.sharedServices = new SharedAppsService(this.mockHttp, loggerService, errorHandler);
  });

  describe('getApps', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));

      const params = HttpUtils.getPaginationParams(0, 10);
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();

      const pageRequest = new PageRequest(0, 10);

      this.sharedServices.getApps(pageRequest);

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });

  });

  describe('getAppInfo', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      const applicationType = 'source';
      const applicationName = 'blubba';

      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.sharedServices.getAppInfo(applicationType, applicationName);

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/' + applicationType + '/' + applicationName);
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

  });
});
