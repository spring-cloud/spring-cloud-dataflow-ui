import { HttpUtils } from '../support/http.utils';
import { ErrorHandler } from '../model';
import { PageRequest } from '../model/pagination/page-request.model';
import { SharedAppsService } from './shared-apps.service';
import { LoggerService } from './logger.service';
import { of } from 'rxjs';

describe('SharedAppsService', () => {

  let mockHttp;
  let jsonData;
  let sharedServices;
  beforeEach(() => {
    mockHttp = {
      get: jasmine.createSpy('get')
    };
    jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    sharedServices = new SharedAppsService(mockHttp, loggerService, errorHandler);
  });

  describe('getApps', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      const params = HttpUtils.getPaginationParams(0, 10);
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();

      const pageRequest = new PageRequest(0, 10);

      sharedServices.getApps(pageRequest);

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });

  });

  describe('getAppInfo', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      const applicationType = 'source';
      const applicationName = 'blubba';

      mockHttp.get.and.returnValue(of(jsonData));
      sharedServices.getAppInfo(applicationType, applicationName);

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/' + applicationType + '/' + applicationName);
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

  });
});
