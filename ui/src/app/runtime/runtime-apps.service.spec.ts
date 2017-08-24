import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../shared/model/error-handler';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { RuntimeAppsService } from './runtime-apps.service';
import { PageInfo } from '../shared/model/pageInfo';

describe('RuntimeAppsService', () => {

  let runtimeAppsService: RuntimeAppsService;

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    const sharedServices = new SharedAppsService(this.mockHttp, errorHandler);
    runtimeAppsService = new RuntimeAppsService(this.mockHttp, errorHandler);
  });

  describe('getRuntimeApps', () => {
    it('should call the runtime apps service with the right url to get apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      runtimeAppsService.getRuntimeApps(new PageInfo());
      expect(this.mockHttp.get).toHaveBeenCalledWith('/runtime/apps', {params: {page: '0', size: '10'}});
    });
  });
});
