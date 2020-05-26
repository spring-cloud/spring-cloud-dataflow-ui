import { of } from 'rxjs';
import { AppService } from './app.service';
import { App, ApplicationType } from '../model/app.model';
import { GET_APP_VERSIONS } from '../../tests/data/app';


describe('shared/api/app.service.ts', () => {

  let mockHttp;
  let appService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    appService = new AppService(mockHttp);
  });

  it('unregisterApps', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    appService.unregisterApps([
      App.parse({ name: 'foo', type: 'source' }),
      App.parse({ name: 'bar', type: 'processor' })
    ]);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/apps/source/foo');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/apps/processor/bar');
  });

  it('getApp', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    appService.getApp('foo', ('processor' as any) as ApplicationType);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/apps/processor/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getApp with version', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    appService.getApp('foo', ('processor' as any) as ApplicationType, '1.0.0');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/apps/processor/foo/1.0.0');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('importUri', () => {
    mockHttp.post.and.returnValue(of(true));
    appService.importUri('https://uri.foo.bar', true);
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/apps');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('uri')).toEqual('https://uri.foo.bar');
    expect(httpParams.get('force')).toEqual('true');
  });

  it('unregisterApp', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    appService.unregisterApp(App.parse({ name: 'foo', type: 'source' }));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    const headerArgs = mockHttp.delete.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/apps/source/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('unregisterApp with version', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    appService.unregisterApp(App.parse({ name: 'foo', type: 'source', version: '1.0.0' }));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    const headerArgs = mockHttp.delete.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/apps/source/foo/1.0.0');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });


  it('importProps', () => {
    mockHttp.post.and.returnValue(of(true));
    appService.importProps('foo', true);
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/apps');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('apps')).toEqual('foo');
    expect(httpParams.get('force')).toEqual('true');
  });

  it('registerApp', () => {
    mockHttp.post.and.returnValue(of(true));
    appService.registerProp({
      name: 'foo',
      uri: 'https://uri.foo.bar',
      metaDataUri: 'https://metaDataUri.foo.bar',
      type: ApplicationType.processor,
      force: true
    });
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/apps/processor/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('uri')).toEqual('https://uri.foo.bar');
    expect(httpParams.get('metadata-uri')).toEqual('https://metaDataUri.foo.bar');
    expect(httpParams.get('force')).toEqual('true');
  });

  it('registerProps', () => {
    mockHttp.post.and.returnValue(of(true));
    const props = [
      {
        name: 'foo',
        uri: 'https://uri.foo',
        metaDataUri: 'https://metaDataUri.foo',
        type: ApplicationType.processor,
        force: true
      },
      {
        name: 'bar',
        uri: 'https://uri.bar',
        metaDataUri: 'https://metaDataUri.bar',
        type: ApplicationType.sink,
        force: false
      }
    ];
    appService.registerProps(props);
    const httpUri1 = mockHttp.post.calls.argsFor(0)[0];
    const headerArgs1 = mockHttp.post.calls.argsFor(0)[2].headers;
    const httpParams1 = mockHttp.post.calls.argsFor(0)[2].params;
    const httpUri2 = mockHttp.post.calls.argsFor(1)[0];
    const headerArgs2 = mockHttp.post.calls.argsFor(1)[2].headers;
    const httpParams2 = mockHttp.post.calls.argsFor(1)[2].params;
    expect(httpUri1).toEqual('/apps/processor/foo');
    expect(headerArgs1.get('Content-Type')).toEqual('application/json');
    expect(headerArgs1.get('Accept')).toEqual('application/json');
    expect(httpParams1.get('uri')).toEqual('https://uri.foo');
    expect(httpParams1.get('metadata-uri')).toEqual('https://metaDataUri.foo');
    expect(httpParams1.get('force')).toEqual('true');
    expect(httpUri2).toEqual('/apps/sink/bar');
    expect(headerArgs2.get('Content-Type')).toEqual('application/json');
    expect(headerArgs2.get('Accept')).toEqual('application/json');
    expect(httpParams2.get('uri')).toEqual('https://uri.bar');
    expect(httpParams2.get('metadata-uri')).toEqual('https://metaDataUri.bar');
    expect(httpParams2.get('force')).toEqual('false');
    expect(mockHttp.post).toHaveBeenCalledTimes(2);
  });

  it('defaultVersion', () => {
    mockHttp.put.and.returnValue(of(jsonData));
    appService.defaultVersion(App.parse({ name: 'foo', type: 'source', version: '1.0.0' }));
    const httpUri1 = mockHttp.put.calls.mostRecent().args[0];
    expect(httpUri1).toEqual('/apps/source/foo/1.0.0');
  });

  it('getApps', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    appService.getApps(0, 20, 'bar', ('processor' as any) as ApplicationType, 'name', 'DESC');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('sort')).toEqual('name,DESC');
    expect(httpParams.get('search')).toEqual('bar');
    expect(httpParams.get('type')).toEqual('processor');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpUri).toEqual('/apps');
  });

  it('getAppVersions', async (done) => {
    mockHttp.get.and.returnValue(of(GET_APP_VERSIONS));
    await appService.getAppVersions('aggregator', ('processor' as any) as ApplicationType).subscribe();
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('search')).toEqual('aggregator');
    expect(httpParams.get('type')).toEqual('processor');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('10000');
    expect(httpUri).toEqual('/apps');
    done();
  });

});
