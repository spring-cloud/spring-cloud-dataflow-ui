import { AppsService } from './apps.service';
import { HttpUtils } from '../shared/support/http.utils';
import { ApplicationType, AppRegistration, ErrorHandler } from '../shared/model';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { AppsWorkaroundService } from './apps.workaround.service';
import { LoggerService } from '../shared/services/logger.service';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

describe('AppsService', () => {

  let mockHttp;
  let appsService;
  let jsonData = {};
  beforeEach(() => {

    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };

    jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    const sharedServices = new SharedAppsService(mockHttp, loggerService, errorHandler);
    const workArroundService = new AppsWorkaroundService(sharedServices);
    appsService = new AppsService(mockHttp, errorHandler, loggerService, workArroundService, sharedServices);
  });

  describe('setAppDefaultVersion', () => {

    it('should call the apps service with the right url to get all apps', () => {
      mockHttp.put.and.returnValue(of(jsonData));
      appsService.setAppDefaultVersion('foo', 'bar', '1.0.0');
      const httpUri1 = mockHttp.put.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/apps/foo/bar/1.0.0');
    });

  });

  describe('unregisterAppVersion', () => {

    it('should call the unregisterAppVersion service with the right url to get all apps', () => {
      mockHttp.delete.and.returnValue(of(jsonData));
      appsService.unregisterAppVersion({ name: 'foo', type: 'bar' }, '1.0.0');
      const httpUri1 = mockHttp.delete.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/apps/bar/foo/1.0.0');
    });

  });

  describe('unregisterApps', () => {

    it('should call the unregisterAppVersion service with the right url to get all apps', () => {
      mockHttp.delete.and.returnValue(of(jsonData));
      appsService.unregisterApps([
        { name: 'foo', type: 'bar' },
        { name: 'foo2', type: 'bar2' }
      ]);
      let httpUri = mockHttp.delete.calls.argsFor(0)[0];
      expect(httpUri).toEqual('/apps/bar/foo');
      httpUri = mockHttp.delete.calls.argsFor(1)[0];
      expect(httpUri).toEqual('/apps/bar2/foo2');
    });

  });

  describe('getAppInfo', () => {

    it('should call the apps service with the right url to get all apps', () => {
      const applicationType = 'source';
      const applicationName = 'blubba';

      mockHttp.get.and.returnValue(of(jsonData));
      appsService.getAppInfo(applicationType, applicationName);

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/' + applicationType + '/' + applicationName);
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

  });

  describe('bulkImportApps', () => {

    it('should call the apps service with the right url to get all apps', () => {

      const appRegistrationImport = { force: true, properties: [], uri: 'https://blubba' };
      mockHttp.post.and.returnValue(of(true));
      appsService.bulkImportApps(appRegistrationImport);

      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
      const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/apps');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('uri')).toEqual('https://blubba');
      expect(httpParams.get('apps')).toEqual('');
      expect(httpParams.get('force')).toEqual('true');
    });

  });

  describe('unregisterApp', () => {

    it('should call the apps service with the right url to unregister a single app', () => {
      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'https://somewhere');
      mockHttp.delete.and.returnValue(of(jsonData));
      appsService.unregisterApp(appRegistration);

      const httpUri = mockHttp.delete.calls.mostRecent().args[0];
      const headerArgs = mockHttp.delete.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/1/blubba');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });

  });

  describe('registerApp', () => {

    it('should call the apps service with the right url to register a single app', () => {
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();
      const params = new HttpParams()
        .append('uri', 'https://blubba')
        .append('force', 'true');

      mockHttp.post.and.returnValue(of(true));

      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'https://blubba');
      appRegistration.force = true;

      appsService.registerApp(appRegistration);

      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
      const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/apps/source/blubba');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('uri')).toEqual('https://blubba');
      expect(httpParams.get('force')).toEqual('true');

    });
  });

  describe('registerMultipleApps', () => {
    it('should call the apps service with the right url to register multiple apps', () => {
      const httpHeaders1 = HttpUtils.getDefaultHttpHeaders();
      const params1 = new HttpParams()
        .append('uri', 'https://foo.bar')
        .append('force', 'false');

      const httpHeaders2 = HttpUtils.getDefaultHttpHeaders();
      const params2 = new HttpParams()
        .append('uri', 'https://bar.foo')
        .append('force', 'false');

      mockHttp.post.and.returnValue(of(true));
      const appRegistrations = [
        {
          name: 'foo',
          type: ApplicationType.source,
          uri: 'https://foo.bar',
          force: false
        },
        {
          name: 'bar',
          type: ApplicationType.sink,
          uri: 'https://bar.foo',
          force: false
        }
      ];

      appsService.registerApps(appRegistrations);

      const httpUri1 = mockHttp.post.calls.argsFor(0)[0];
      const headerArgs1 = mockHttp.post.calls.argsFor(0)[2].headers;
      const httpParams1 = mockHttp.post.calls.argsFor(0)[2].params;

      const httpUri2 = mockHttp.post.calls.argsFor(1)[0];
      const headerArgs2 = mockHttp.post.calls.argsFor(1)[2].headers;
      const httpParams2 = mockHttp.post.calls.argsFor(1)[2].params;

      expect(httpUri1).toEqual('/apps/source/foo');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');
      expect(httpParams1.get('uri')).toEqual('https://foo.bar');
      expect(httpParams1.get('force')).toEqual('false');

      expect(httpUri2).toEqual('/apps/sink/bar');
      expect(headerArgs2.get('Content-Type')).toEqual('application/json');
      expect(headerArgs2.get('Accept')).toEqual('application/json');
      expect(httpParams2.get('uri')).toEqual('https://bar.foo');
      expect(httpParams2.get('force')).toEqual('false');

      expect(mockHttp.post).toHaveBeenCalledTimes(2);
    });
  });
});
