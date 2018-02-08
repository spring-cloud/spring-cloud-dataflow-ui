import {Observable} from 'rxjs/Observable';
import {ErrorHandler} from '../shared/model/error-handler';
import {RuntimeAppsService} from './runtime-apps.service';
import {RUNTIME_APPS} from '../tests/mocks/mock-data';
import {RuntimeApp} from './model/runtime-app';
import {Page} from '../shared/model/page';

describe('RuntimeAppsService', () => {

  let runtimeAppsService: RuntimeAppsService;

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    runtimeAppsService = new RuntimeAppsService(this.mockHttp, errorHandler);
  });

  describe('getRuntimeApps', () => {

    it('should call the runtime apps service with the right url to get apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      runtimeAppsService.getRuntimeApps({page: 0, size: 10});
      expect(this.mockHttp.get).toHaveBeenCalledWith('/runtime/apps', {params: {page: 0, size: 10}});
    });

    it('should parse the json', () => {
      this.jsonData = {json: () => RUNTIME_APPS};
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      runtimeAppsService.getRuntimeApps({page: 0, size: 10}).subscribe((page: Page<RuntimeApp>) => {
        expect(page.items.length).toBe(2);
      });
    });

  });

});
