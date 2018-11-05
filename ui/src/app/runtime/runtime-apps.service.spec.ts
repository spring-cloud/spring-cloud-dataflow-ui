import { ErrorHandler } from '../shared/model';
import { RuntimeAppsService } from './runtime-apps.service';
import { RUNTIME_APPS } from '../tests/mocks/mock-data';
import { RuntimeApp } from './model/runtime-app';
import { Page } from '../shared/model';
import { of } from 'rxjs';

describe('RuntimeAppsService', () => {

  let runtimeAppsService: RuntimeAppsService;

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    runtimeAppsService = new RuntimeAppsService(this.mockHttp, errorHandler);
  });

  describe('getRuntimeApps', () => {

    it('should call the runtime apps service with the right url to get apps', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      runtimeAppsService.getRuntimeApps({page: 0, size: 10});

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/runtime/apps');
      expect(headerArgs).toBeUndefined();
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');

    });

    it('should parse the json', () => {
      this.mockHttp.get.and.returnValue(of(RUNTIME_APPS));
      runtimeAppsService.getRuntimeApps({page: 0, size: 10}).subscribe((page: Page<RuntimeApp>) => {
        expect(page.items.length).toBe(2);
      });
    });

  });

});
