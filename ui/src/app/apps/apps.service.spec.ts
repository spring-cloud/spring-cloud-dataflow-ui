import {URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {AppsService} from './apps.service';
import {HttpUtils} from '../shared/support/http.utils';
import {ApplicationType, AppRegistration, ErrorHandler} from '../shared/model';
import {SharedAppsService} from '../shared/services/shared-apps.service';
import {AppsWorkaroundService} from './apps.workaround.service';

describe('AppsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const sharedServices = new SharedAppsService(this.mockHttp, errorHandler);
    const workArroundService = new AppsWorkaroundService(sharedServices);
    this.appsService = new AppsService(this.mockHttp, errorHandler, workArroundService, sharedServices);
  });

  /*
  describe('getApps', () => {

    it('should call the apps service with the right url to get all apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      expect(this.appsService.appRegistrations).toBeUndefined();
      const params = HttpUtils.getPaginationParams(0, 30);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
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

      expect(this.mockHttp.get).toHaveBeenCalledWith(
        '/apps/' + applicationType + '/' + applicationName, HttpUtils.getDefaultRequestOptions());
    });

  });

  describe('bulkImportApps', () => {

    it('should call the apps service with the right url to get all apps', () => {

      const requestOptions = HttpUtils.getDefaultRequestOptions();
      const params = new URLSearchParams();

      params.append('uri', 'http://blubba');
      params.append('apps', '');
      params.append('force', 'true');

      requestOptions.params = params;

      const appRegistrationImport = {force: true, properties: [], uri: 'http://blubba'};
      this.mockHttp.post.and.returnValue(Observable.of(true));
      this.appsService.bulkImportApps(appRegistrationImport);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps', {}, requestOptions);
    });

  });

  describe('unregisterApp', () => {

    it('should call the apps service with the right url to unregister a single app', () => {
      const requestOptions = HttpUtils.getDefaultRequestOptions();
      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'http://somewhere');
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
      this.appsService.unregisterApp(appRegistration);
      expect(this.mockHttp.delete).toHaveBeenCalledWith('/apps/0/blubba', requestOptions);
    });

  });

  describe('registerApp', () => {

    it('should call the apps service with the right url to register a single app', () => {
      const requestOptions = HttpUtils.getDefaultRequestOptions();
      const params = new URLSearchParams();

      params.append('uri', 'http://blubba');
      params.append('force', 'true');

      requestOptions.params = params;

      this.mockHttp.post.and.returnValue(Observable.of(true));

      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'http://blubba');
      appRegistration.force = true;

      this.appsService.registerApp(appRegistration);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps/source/blubba', {}, requestOptions);
    });
  });

  describe('registerMultipleApps', () => {
    it('should call the apps service with the right url to register multiple apps', () => {
      const requestOptions1 = HttpUtils.getDefaultRequestOptions();
      const params1 = new URLSearchParams();

      params1.append('uri', 'http://foo.bar');
      params1.append('force', 'false');

      requestOptions1.params = params1;

      const requestOptions2 = HttpUtils.getDefaultRequestOptions();
      const params2 = new URLSearchParams();

      params2.append('uri', 'http://bar.foo');
      params2.append('force', 'false');

      requestOptions2.params = params2;

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

      expect(this.mockHttp.post.calls.allArgs()).toEqual([
        ['/apps/source/foo', {}, requestOptions1],
        ['/apps/sink/bar', {}, requestOptions2]
      ]);

      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps/source/foo', {}, requestOptions1);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps/sink/bar', {}, requestOptions2);

      expect(this.mockHttp.post).toHaveBeenCalledTimes(2);
    });
  });
});
