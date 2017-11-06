import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { HttpUtils } from '../support/http.utils';
import { ApplicationType, AppRegistration, ErrorHandler } from '../model';
import { PageRequest } from '../model/pagination/page-request.model';
import { SharedAppsService } from './shared-apps.service';

describe('SharedAppsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['get']);
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    this.sharedServices = new SharedAppsService(this.mockHttp, errorHandler);
  });

  describe('getApps', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params = HttpUtils.getPaginationParams(0, 10);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;

      const pageRequest = new PageRequest(0, 10);

      this.sharedServices.getApps(pageRequest);

      expect(this.mockHttp.get).toHaveBeenCalledWith('/apps', requestOptionsArgs);
    });

  });

  describe('getAppInfo', () => {

    it('should call the shared apps service with the right url to get all apps', () => {
      const applicationType = 'source';
      const applicationName = 'blubba';

      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.sharedServices.getAppInfo(applicationType, applicationName);

      expect(this.mockHttp.get).toHaveBeenCalledWith(
        '/apps/' + applicationType + '/' + applicationName, HttpUtils.getDefaultRequestOptions());
    });

  });
});
