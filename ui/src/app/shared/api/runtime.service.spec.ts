import { RuntimeService } from './runtime.service';
import { of } from 'rxjs';

describe('shared/api/runtime.service.ts', () => {
  let mockHttp;
  let runtimeService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    runtimeService = new RuntimeService(mockHttp);
  });

  it('getRuntime', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    runtimeService.getRuntime(0, 100);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('100');
    expect(httpUri).toEqual('/runtime/streams');
  });
});
