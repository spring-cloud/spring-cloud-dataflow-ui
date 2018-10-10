import {Observable} from 'rxjs/Observable';

import {AppsService} from './apps.service';
import {HttpUtils} from '../shared/support/http.utils';
import {ApplicationType, AppRegistration, ErrorHandler} from '../shared/model';
import {SharedAppsService} from '../shared/services/shared-apps.service';
import {AppsWorkaroundService} from './apps.workaround.service';
import { LoggerService } from '../shared/services/logger.service';
import { HttpParams } from '@angular/common/http';

describe('AppsService', () => {

  beforeEach(() => {

    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };

    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    const sharedServices = new SharedAppsService(this.mockHttp, loggerService, errorHandler);
    const workArroundService = new AppsWorkaroundService(sharedServices);
    this.appsService = new AppsService(this.mockHttp, errorHandler, loggerService, workArroundService, sharedServices);
  });

  /*
  describe('getApps', () => {

    it('should call the apps service with the right url to get all apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      expect(this.appsService.appRegistrations).toBeUndefined();
      const params = HttpUtils.getPaginationParams(0, 30);
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();
      requestOptionsArgs.search = params;
      this.appsService.getApps();
      const defaultPageNumber: number = this.appsService.applicationsContext.page;
      const defaultPageSize: number = this.appsService.applicationsContext.size;
      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(30);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/apps', requestOptionsArgs);
    });

  });
  */

  describe('getAppInfo', () => {

    it('should call the apps service with the right url to get all apps', () => {
      const applicationType = 'source';
      const applicationName = 'blubba';

      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.appsService.getAppInfo(applicationType, applicationName);

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/' + applicationType + '/' + applicationName);
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  describe('bulkImportApps', () => {

    it('should call the apps service with the right url to get all apps', () => {

      const appRegistrationImport = {force: true, properties: [], uri: 'http://blubba'};
      this.mockHttp.post.and.returnValue(Observable.of(true));
      this.appsService.bulkImportApps(appRegistrationImport);

      const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.post.calls.mostRecent().args[2].headers;
      const httpParams = this.mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/apps');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('uri')).toEqual('http://blubba');
      expect(httpParams.get('apps')).toEqual('');
      expect(httpParams.get('force')).toEqual('true');
    });

  });

  describe('unregisterApp', () => {

    it('should call the apps service with the right url to unregister a single app', () => {
      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'http://somewhere');
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
      this.appsService.unregisterApp(appRegistration);

      const httpUri = this.mockHttp.delete.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.delete.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/apps/1/blubba');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');

    });

  });

  describe('registerApp', () => {

    it('should call the apps service with the right url to register a single app', () => {
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();
      const params = new HttpParams()
        .append('uri', 'http://blubba')
        .append('force', 'true');

      this.mockHttp.post.and.returnValue(Observable.of(true));

      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'http://blubba');
      appRegistration.force = true;

      this.appsService.registerApp(appRegistration);

      const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.post.calls.mostRecent().args[2].headers;
      const httpParams = this.mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/apps/source/blubba');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('uri')).toEqual('http://blubba');
      expect(httpParams.get('force')).toEqual('true');

    });
  });

  describe('registerMultipleApps', () => {
    it('should call the apps service with the right url to register multiple apps', () => {
      const httpHeaders1 = HttpUtils.getDefaultHttpHeaders();
      const params1 = new HttpParams()
        .append('uri', 'http://foo.bar')
        .append('force', 'false');

      const httpHeaders2 = HttpUtils.getDefaultHttpHeaders();
      const params2 = new HttpParams()
        .append('uri', 'http://bar.foo')
        .append('force', 'false');

      this.mockHttp.post.and.returnValue(Observable.of(true));
      const appRegistrations = [
        {
          name: 'foo',
          type: ApplicationType.source,
          uri: 'http://foo.bar',
          force: false
        },
        {
          name: 'bar',
          type: ApplicationType.sink,
          uri: 'http://bar.foo',
          force: false
        }
      ];

      this.appsService.registerApps(appRegistrations);

      const httpUri1 = this.mockHttp.post.calls.argsFor(0)[0];
      const headerArgs1 = this.mockHttp.post.calls.argsFor(0)[2].headers;
      const httpParams1 = this.mockHttp.post.calls.argsFor(0)[2].params;

      const httpUri2 = this.mockHttp.post.calls.argsFor(1)[0];
      const headerArgs2 = this.mockHttp.post.calls.argsFor(1)[2].headers;
      const httpParams2 = this.mockHttp.post.calls.argsFor(1)[2].params;

      expect(httpUri1).toEqual('/apps/source/foo');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');
      expect(httpParams1.get('uri')).toEqual('http://foo.bar');
      expect(httpParams1.get('force')).toEqual('false');

      expect(httpUri2).toEqual('/apps/sink/bar');
      expect(headerArgs2.get('Content-Type')).toEqual('application/json');
      expect(headerArgs2.get('Accept')).toEqual('application/json');
      expect(httpParams2.get('uri')).toEqual('http://bar.foo');
      expect(httpParams2.get('force')).toEqual('false');

      expect(this.mockHttp.post).toHaveBeenCalledTimes(2);
    });
  });
});
