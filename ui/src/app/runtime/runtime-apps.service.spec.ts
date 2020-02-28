import { ErrorHandler } from '../shared/model';
import { RuntimeAppsService } from './runtime-apps.service';
import { RUNTIME_SREAMS } from '../tests/mocks/mock-data';
import { Page } from '../shared/model';
import { of } from 'rxjs';
import { RuntimeStream } from './model/runtime-stream';

describe('RuntimeAppsService', () => {

  let runtimeAppsService: RuntimeAppsService;
  let mockHttp;
  let jsonData;

  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    jsonData = {};
    const errorHandler = new ErrorHandler();
    runtimeAppsService = new RuntimeAppsService(mockHttp, errorHandler);
  });

  describe('getRuntimeApps', () => {

    it('should call the runtime apps service with the right url to get apps', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      runtimeAppsService.getRuntimeStreams({ page: 0, size: 10 });

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/runtime/streams');
      expect(headerArgs).toBeUndefined();
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');

    });

    it('should parse the json', () => {
      mockHttp.get.and.returnValue(of(RUNTIME_SREAMS));
      runtimeAppsService.getRuntimeStreams({ page: 0, size: 10 }).subscribe((page: Page<RuntimeStream>) => {
        expect(page.items.length).toBe(2);
      });
    });

  });

});
