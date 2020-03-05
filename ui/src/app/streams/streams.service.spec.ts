import { ErrorHandler } from '../shared/model/error-handler';
import { StreamsService } from './streams.service';
import { HttpUtils } from '../shared/support/http.utils';
import { StreamDefinition } from './model/stream-definition';
import { HttpParams } from '@angular/common/http';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

/**
 * Test Streams Services.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsService', () => {

  let mockHttp;
  let jsonData;
  let streamsService;

  beforeEach(() => {
    mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    streamsService = new StreamsService(mockHttp, loggerService, errorHandler);
  });

  describe('getDefinitions', () => {
    it('should call the streams service with the right url to get stream definitions', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      // expect(streamsService.streamDefinitions).toBeDefined();
      streamsService.getDefinitions();

      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/streams/definitions');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('30');

    });

    it('should call the definitions service with the right url [no sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      streamsService.getDefinitions();

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('30');
    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      streamsService.getDefinitions(undefined);

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('30');
    });

    it('should call the definitions service with the right url [asc sort]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      streamsService.getDefinitions({ q: '', page: 0, size: 10, sort: 'dslText', order: 'ASC' });

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');
      expect(httpParams.get('sort')).toEqual('dslText,ASC');
    });

    it('should call the definitions service with the right url [desc sort]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      streamsService.getDefinitions({ q: '', page: 0, size: 10, sort: 'dslText', order: 'DESC' });

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');
      expect(httpParams.get('sort')).toEqual('dslText,DESC');
    });

    it('should call the definitions service with the right url [search desc sort]', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      streamsService.getDefinitions({ q: 'foo', page: 0, size: 10, sort: 'dslText', order: 'DESC' });
      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');
      expect(httpParams.get('search')).toEqual('foo');
      expect(httpParams.get('sort')).toEqual('dslText,DESC');
    });

  });

  describe('getDefinition', () => {

    it('should call the definition service with the right url', () => {
      mockHttp.get.and.returnValue(of({}));
      streamsService.getDefinition('foo');
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/streams/definitions/foo');
    });

  });

  describe('createDefinition', () => {

    it('should call the create and deploy definition with the right url/params', () => {
      mockHttp.post.and.returnValue(of({}));
      streamsService.createDefinition('foobar', 'foo | bar', 'demo-description', true);
      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(httpParams.get('name')).toEqual('foobar');
      expect(httpParams.get('definition')).toEqual('foo | bar');
      expect(httpParams.get('description')).toEqual('demo-description');
      expect(httpParams.get('deploy')).toEqual('true');
    });

    it('should call the create definition with the right url/params', () => {
      mockHttp.post.and.returnValue(of({}));
      streamsService.createDefinition('foobar', 'foo | bar', 'demo-description', false);
      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const httpParams = mockHttp.post.calls.mostRecent().args[2].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(httpParams.get('name')).toEqual('foobar');
      expect(httpParams.get('definition')).toEqual('foo | bar');
      expect(httpParams.get('description')).toEqual('demo-description');
      expect(httpParams.get('deploy')).toBeNull();
    });

  });

  describe('updateDefinition', () => {

    it('should call the update definition with the right url/params', () => {
      mockHttp.post.and.returnValue(of({}));
      const properties = {
        a: 'a',
        b: 'b'
      };
      streamsService.updateDefinition('foobar', properties);
      console.log(mockHttp.post.calls.mostRecent().args[1]);
      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const httpParams = mockHttp.post.calls.mostRecent().args[1];
      expect(httpUri).toEqual('/streams/deployments/update/foobar');
      expect(httpParams['releaseName']).toEqual('foobar');
      expect(JSON.stringify(httpParams['updateProperties'])).toBe(JSON.stringify(properties));

    });

  });

  describe('destroyDefinition', () => {
    it('should call the streams service to destroy stream definition', () => {
      mockHttp.delete.and.returnValue(of(jsonData));

      // expect(streamsService.streamDefinitions).toBeDefined();

      const streamDefinition = new StreamDefinition('test', 'time|log', 'time|log', 'demo-description', 'undeployed');
      streamsService.destroyDefinition(streamDefinition);

      const httpUri = mockHttp.delete.calls.mostRecent().args[0];
      const headerArgs = mockHttp.delete.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/streams/definitions/test');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });


  describe('undeployDefinition', () => {
    it('should call the streams service to undeploy stream definition', () => {
      mockHttp.delete.and.returnValue(of(jsonData));

      // expect(streamsService.streamDefinitions).toBeDefined();

      const streamDefinition = new StreamDefinition('test', 'time|log', 'time|log', 'demo-description', 'deployed');
      streamsService.undeployDefinition(streamDefinition);

      const httpUri = mockHttp.delete.calls.mostRecent().args[0];
      const headerArgs = mockHttp.delete.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/streams/deployments/test');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  describe('deployDefinition', () => {
    it('should call the streams service to deploy stream definition', () => {
      mockHttp.post.and.returnValue(of(jsonData));

      // expect(streamsService.streamDefinitions).toBeDefined();

      streamsService.deployDefinition('test', {});

      const httpUri = mockHttp.post.calls.mostRecent().args[0];
      const headerArgs = mockHttp.post.calls.mostRecent().args[2].headers;
      expect(httpUri).toEqual('/streams/deployments/test');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  describe('deploymentInfo', () => {
    it('should call the streams service to get deployment info', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      expect(streamsService.getDeploymentInfo).toBeDefined();
      streamsService.getDeploymentInfo('test');
      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/streams/deployments/test');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  /*describe('extractDefinition', () => {
    it('should call the streams service to extract stream definition', () => {
      const response = new MockResponse();
      response.body = STREAM_DEFINITIONS;
      let streamDefinitions = streamsService.extractData(response);
      expect(streamDefinitions.pageNumber).toBe(0);
      expect(streamDefinitions.pageSize).toBe(1);
      expect(streamDefinitions.items[0].name).toBe('foo2');

      response.body = {};
      streamDefinitions = streamsService.extractData(response);
      expect(streamDefinitions.items.length).toBe(0);
    });
  });*/

  describe('relatedStreamDefinitions', () => {

    it('should call the streams service to get related stream definitions no nesting', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      expect(streamsService.getRelatedDefinitions).toBeDefined();

      streamsService.getRelatedDefinitions('test');

      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/streams/definitions/test/related');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

    it('should call the streams service to get related stream definitions with nesting', () => {
      mockHttp.get.and.returnValue(of(jsonData));

      expect(streamsService.getRelatedDefinitions).toBeDefined();

      streamsService.getRelatedDefinitions('test', true);
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();
      const params = new HttpParams()
        .append('nested', 'true');


      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions/test/related');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('nested')).toEqual('true');
    });

  });

  describe('streamStatuses', () => {

    it('should call the streams streamStatuses service no stream names specified', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      expect(streamsService.getRuntimeStreamStatuses).toBeDefined();
      streamsService.getRuntimeStreamStatuses();
      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/runtime/streams');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

    it('should call the streams streamStatuses service with stream names specified', () => {
      mockHttp.get.and.returnValue(of(jsonData));
      expect(streamsService.getRuntimeStreamStatuses).toBeDefined();
      streamsService.getRuntimeStreamStatuses(['test1', 'test2']);
      const httpHeaders = HttpUtils.getDefaultHttpHeaders();
      const params = new HttpParams()
        .append('names', 'test1,test2');
      const httpUri = mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/runtime/streams');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('names')).toEqual('test1,test2');

    });

  });

  describe('destroyMultipleStreamDefinitions', () => {
    it('should call the stream definition service with the right url to destroy multiple stream definitions', () => {

      mockHttp.delete.and.returnValue(of(jsonData));
      // expect(streamsService.streamDefinitions).toBeDefined();
      const streamDefinitions = [
        new StreamDefinition('stream1', 'file|filter|ftp', 'file|filter|ftp', 'demo-description', 'deployed'),
        new StreamDefinition('stream2', 'ftp|filter|file', 'ftp|filter|file', 'demo-description', 'deployed')
      ];
      streamsService.destroyMultipleStreamDefinitions(streamDefinitions);

      const httpUri1 = mockHttp.delete.calls.argsFor(0)[0];
      const headerArgs1 = mockHttp.delete.calls.argsFor(0)[1].headers;
      expect(httpUri1).toEqual('/streams/definitions/stream1');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');

      const httpUri2 = mockHttp.delete.calls.argsFor(1)[0];
      const headerArgs2 = mockHttp.delete.calls.argsFor(1)[1].headers;
      expect(httpUri2).toEqual('/streams/definitions/stream2');
      expect(headerArgs2.get('Content-Type')).toEqual('application/json');
      expect(headerArgs2.get('Accept')).toEqual('application/json');

      expect(mockHttp.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('deployMultipleStreamDefinitions', () => {
    it('should call the stream definition service with the right url to deploy multiple stream definitions', () => {
      mockHttp.post.and.returnValue(of(jsonData));
      // expect(streamsService.streamDefinitions).toBeDefined();
      const stream1 = new StreamDefinition('stream1', 'file|filter|ftp', 'file|filter|ftp', 'demo-description', 'undeployed');
      const stream2 = new StreamDefinition('stream2', 'file|filter|ftp', 'file|filter|ftp', 'demo-description', 'undeployed');
      stream1.deploymentProperties = { a: 'a' };
      streamsService.deployMultipleStreamDefinitions([stream1, stream2]);

      const httpUri1 = mockHttp.post.calls.argsFor(0)[0];
      const body1 = mockHttp.post.calls.argsFor(0)[1];
      const headerArgs1 = mockHttp.post.calls.argsFor(0)[2].headers;
      expect(httpUri1).toEqual('/streams/deployments/stream1');
      expect(body1).toEqual(JSON.parse('{ "a": "a" }'));
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');

      const httpUri2 = mockHttp.post.calls.argsFor(1)[0];
      const body2 = mockHttp.post.calls.argsFor(1)[1];
      const headerArgs2 = mockHttp.post.calls.argsFor(1)[2].headers;
      expect(httpUri2).toEqual('/streams/deployments/stream2');
      expect(body2).toEqual({});
      expect(headerArgs2.get('Content-Type')).toEqual('application/json');
      expect(headerArgs2.get('Accept')).toEqual('application/json');

      expect(mockHttp.post).toHaveBeenCalledTimes(2);
    });
  });

  describe('undeployMultipleStreamDefinitions', () => {
    it('should call the stream definition service with the right url to undeploy multiple stream definitions', () => {
      mockHttp.delete.and.returnValue(of(jsonData));
      // expect(streamsService.streamDefinitions).toBeDefined();
      const streamDefinitions = [
        new StreamDefinition('stream1', 'file|filter|ftp', 'file|filter|ftp', 'demo-description', 'deployed'),
        new StreamDefinition('stream2', 'ftp|filter|file', 'ftp|filter|file', 'demo-description', 'deployed')
      ];
      streamsService.undeployMultipleStreamDefinitions(streamDefinitions);

      const httpUri1 = mockHttp.delete.calls.argsFor(0)[0];
      const headerArgs1 = mockHttp.delete.calls.argsFor(0)[1].headers;
      expect(httpUri1).toEqual('/streams/deployments/stream1');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');

      const httpUri2 = mockHttp.delete.calls.argsFor(1)[0];
      const headerArgs2 = mockHttp.delete.calls.argsFor(1)[1].headers;
      expect(httpUri2).toEqual('/streams/deployments/stream2');
      expect(headerArgs2.get('Content-Type')).toEqual('application/json');
      expect(headerArgs2.get('Accept')).toEqual('application/json');

      expect(mockHttp.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('getPlatforms', () => {

    it('should call the platform service with the right url', () => {
      mockHttp.get.and.returnValue(of({}));
      streamsService.getPlatforms();
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/streams/deployments/platform/list');
    });

  });

  describe('getHistory', () => {

    it('should call the history service with the right url', () => {
      mockHttp.get.and.returnValue(of({}));
      streamsService.getHistory('foobar');
      const httpUri1 = mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri1).toEqual('/streams/deployments/history/foobar');
    });

  });

});
