import { AppsService } from './apps.service';
import { Observable } from 'rxjs/Rx'
import { ErrorHandler } from '../shared/model/error-handler';
import { HttpUtils } from '../shared/support/http.utils'

import { Response, ResponseOptions, URLSearchParams } from '@angular/http';
import { ApplicationType } from './model/application-type';
import { Headers, RequestOptions } from '@angular/http';
import { AppRegistrationImport } from './model/app-registration-import';
import { AppRegistration } from './model/app-registration';

describe('AppsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    this.appsService = new AppsService(this.mockHttp, errorHandler);
  });

  describe('getApps', () => {

    it('should call the apps service with the right url to get all apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.appsService.getApps();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/apps', {});
    });

  });

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

      const requestOptions = HttpUtils.getDefaultRequestOptions()
      const params = new URLSearchParams();

      params.append('uri', 'http://blubba');
      params.append('apps', '');
      params.append('force', 'true');

      requestOptions.params = params;

      const appRegistrationImport = new AppRegistrationImport(true, [], 'http://blubba');
      this.mockHttp.post.and.returnValue(Observable.of(true));
      this.appsService.bulkImportApps(appRegistrationImport);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps', {}, requestOptions);
    });

  });

  describe('unregisterApp', () => {

    it('should call the apps service with the right url to unregister a single app', () => {
      const requestOptions = HttpUtils.getDefaultRequestOptions()
      const appRegistration = new AppRegistration('blubba', ApplicationType.source, 'http://somewhere');
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
      this.appsService.unregisterApp(appRegistration);
      expect(this.mockHttp.delete).toHaveBeenCalledWith('/apps/0/blubba', requestOptions);
    });

  });

  describe('registerApp', () => {

    it('should call the apps service with the right url to register a single app', () => {
      const requestOptions = HttpUtils.getDefaultRequestOptions()
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
      const requestOptions1 = HttpUtils.getDefaultRequestOptions()
      const params1 = new URLSearchParams();

      params1.append('uri', 'http://somewhere');
      params1.append('force', 'false');

      requestOptions1.params = params1;

      const requestOptions2 = HttpUtils.getDefaultRequestOptions()
      const params2 = new URLSearchParams();

      params2.append('uri', 'http://somewhere-else');
      params2.append('force', 'false');

      requestOptions2.params = params2;

      this.mockHttp.post.and.returnValue(Observable.of(true));
      const appRegistrations = [
        new AppRegistration('blubba',  ApplicationType.source, 'http://somewhere'),
        new AppRegistration('blubba2', ApplicationType.sink, 'http://somewhere-else')
      ];

      this.appsService.registerMultipleApps(appRegistrations);

      expect(this.mockHttp.post.calls.allArgs()).toEqual([
        ['/apps/source/blubba', {}, requestOptions1],
        ['/apps/sink/blubba2', {}, requestOptions2]
      ]);

      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps/source/blubba', {}, requestOptions1);
      expect(this.mockHttp.post).toHaveBeenCalledWith('/apps/sink/blubba2', {}, requestOptions2);

      expect(this.mockHttp.post).toHaveBeenCalledTimes(2);
    });
  });
});
