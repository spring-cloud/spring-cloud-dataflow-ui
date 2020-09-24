import { StreamService } from './stream.service';
import { of } from 'rxjs';
import { Stream, StreamHistory } from '../model/stream.model';

describe('shared/api/stream.service.ts', () => {

  let mockHttp;
  let streamService;
  let jsonData = {};
  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
    };
    jsonData = {};
    streamService = new StreamService(mockHttp);
  });

  it('getStreams', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getStreams(0, 20, 'bar', 'name', 'DESC');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpParams.get('sort')).toEqual('name,DESC');
    expect(httpParams.get('search')).toEqual('bar');
    expect(httpParams.get('page')).toEqual('0');
    expect(httpParams.get('size')).toEqual('20');
    expect(httpUri).toEqual('/streams/definitions');
  });

  it('getStream', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getStream('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/streams/definitions/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('destroyStream', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    streamService.destroyStream(Stream.parse({ name: 'foo' }));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/streams/definitions/foo');
  });

  it('destroyStreams', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    streamService.destroyStreams([
      Stream.parse({ name: 'foo' }),
      Stream.parse({ name: 'bar' })
    ]);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/streams/definitions/foo');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/streams/definitions/bar');
  });

  it('undeployStream', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    streamService.undeployStream(Stream.parse({ name: 'foo' }));
    const httpUri = mockHttp.delete.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/streams/deployments/foo');
  });

  it('undeployStream', () => {
    mockHttp.delete.and.returnValue(of(jsonData));
    streamService.undeployStreams([
      Stream.parse({ name: 'foo' }),
      Stream.parse({ name: 'bar' })
    ]);
    let httpUri = mockHttp.delete.calls.argsFor(0)[0];
    expect(httpUri).toEqual('/streams/deployments/foo');
    httpUri = mockHttp.delete.calls.argsFor(1)[0];
    expect(httpUri).toEqual('/streams/deployments/bar');
  });

  it('createStream', () => {
    mockHttp.post.and.returnValue(of({}));
    streamService.createStream('foo', 'foo | bar', 'demo-description');
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
    expect(httpUri).toEqual('/streams/definitions');
    expect(httpParams.get('name')).toEqual('foo');
    expect(httpParams.get('definition')).toEqual('foo | bar');
    expect(httpParams.get('description')).toEqual('demo-description');
  });

  it('getDeploymentInfo', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getDeploymentInfo('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/streams/deployments/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getDeploymentInfo using reuse-deployment-properties flag)', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getDeploymentInfo('foo', true);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/streams/deployments/foo?reuse-deployment-properties=true');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getPlatforms', () => {
    mockHttp.get.and.returnValue(of({}));
    streamService.getPlatforms();
    const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri1).toEqual('/streams/deployments/platform/list');
  });

  it('getStreamHistory', () => {
    mockHttp.get.and.returnValue(of({}));
    streamService.getStreamHistory('foo');
    const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
    expect(httpUri1).toEqual('/streams/deployments/history/foo');
  });

  it('updateStream', () => {
    mockHttp.post.and.returnValue(of({}));
    const properties = {
      a: 'a',
      b: 'b'
    };
    streamService.updateStream('foo', properties);
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const httpParams = mockHttp.post.calls.mostRecent().args[1];
    expect(httpUri).toEqual('/streams/deployments/update/foo');
    expect(httpParams['releaseName']).toEqual('foo');
    expect(JSON.stringify(httpParams['updateProperties'])).toBe(JSON.stringify(properties));
  });

  it('deployStream', () => {
    mockHttp.post.and.returnValue(of(jsonData));
    streamService.deployStream('foo', {});
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
    expect(httpUri).toEqual('/streams/deployments/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getStreamsRelated', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getStreamsRelated('foo', true);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpUri).toEqual('/streams/definitions/foo/related');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('nested')).toEqual('true');
  });

  it('getLogs', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getLogs('foo');
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    expect(httpUri).toEqual('/streams/logs/foo');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
  });

  it('getRuntimeStreamStatuses', () => {
    mockHttp.get.and.returnValue(of(jsonData));
    streamService.getRuntimeStreamStatuses(['foo', 'bar']);
    const httpUri = mockHttp.get.calls.mostRecent().args[0];
    const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
    const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
    expect(httpUri).toEqual('/runtime/streams');
    expect(headerArgs.get('Content-Type')).toEqual('application/json');
    expect(headerArgs.get('Accept')).toEqual('application/json');
    expect(httpParams.get('names')).toEqual('foo,bar');
  });

  it('rollbackStream', () => {
    mockHttp.post.and.returnValue(of({}));
    streamService.rollbackStream(StreamHistory.parse({ name: 'foo', version: '2' }));
    const httpUri = mockHttp.post.calls.mostRecent().args[0];
    expect(httpUri).toEqual('/streams/deployments/rollback/foo/2');
  });

});
