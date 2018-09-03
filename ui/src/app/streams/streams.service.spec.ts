import { ErrorHandler } from '../shared/model/error-handler';
import { StreamsService } from './streams.service';
import { Observable } from 'rxjs/Observable';
import { HttpUtils } from '../shared/support/http.utils';
import { StreamDefinition } from './model/stream-definition';
import { HttpParams } from '@angular/common/http';
import { MockResponse } from '../tests/mocks/response';
import { STREAM_DEFINITIONS } from '../tests/mocks/mock-data';
import { LoggerService } from '../shared/services/logger.service';

/**
 * Test Streams Services.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsService', () => {

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    this.streamsService = new StreamsService(this.mockHttp, loggerService, errorHandler);
  });

  describe('getDefinitions', () => {
    it('should call the streams service with the right url to get stream definitions', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      // expect(this.streamsService.streamDefinitions).toBeDefined();
      this.streamsService.getDefinitions();

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/streams/definitions');
      expect(headerArgs1.get('Content-Type')).toEqual('application/json');
      expect(headerArgs1.get('Accept')).toEqual('application/json');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('30');

    });

    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.streamsService.getDefinitions();

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('30');
    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.streamsService.getDefinitions(undefined);

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('30');
    });

    it('should call the definitions service with the right url [asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.streamsService.getDefinitions({ q: '', page: 0, size: 10, sort: 'DEFINITION', order: 'ASC' });

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');
      expect(httpParams.get('sort')).toEqual('DEFINITION,ASC');
    });

    it('should call the definitions service with the right url [desc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.streamsService.getDefinitions({ q: '', page: 0, size: 10, sort: 'DEFINITION', order: 'DESC' });

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/streams/definitions');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams.get('page')).toEqual('0');
      expect(httpParams.get('size')).toEqual('10');
      expect(httpParams.get('sort')).toEqual('DEFINITION,DESC');
    });
  });

  describe('destroyDefinition', () => {
    it('should call the streams service to destroy stream definition', () => {
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

      // expect(this.streamsService.streamDefinitions).toBeDefined();

      const streamDefinition = new StreamDefinition('test', 'time|log', 'undeployed');
      this.streamsService.destroyDefinition(streamDefinition);

      const httpUri = this.mockHttp.delete.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.delete.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/streams/definitions/test');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

    describe('undeployDefinition', () => {
      it('should call the streams service to undeploy stream definition', () => {
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

        // expect(this.streamsService.streamDefinitions).toBeDefined();

        const streamDefinition = new StreamDefinition('test', 'time|log', 'deployed');
        this.streamsService.undeployDefinition(streamDefinition);

        const httpUri = this.mockHttp.delete.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.delete.calls.mostRecent().args[1].headers;
        expect(httpUri).toEqual('/streams/deployments/test');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
      });
    });

    describe('deployDefinition', () => {
      it('should call the streams service to deploy stream definition', () => {
        this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));

        // expect(this.streamsService.streamDefinitions).toBeDefined();

        this.streamsService.deployDefinition('test', {});

        const httpUri = this.mockHttp.post.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.post.calls.mostRecent().args[2].headers;
        expect(httpUri).toEqual('/streams/deployments/test');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
      });
    });

    describe('deploymentInfo', () => {
      it('should call the streams service to get deployment info', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.getDeploymentInfo).toBeDefined();

        this.streamsService.getDeploymentInfo('test');

        const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
        expect(httpUri).toEqual('/streams/deployments/test');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
      });
    });

    describe('extractDefinition', () => {
      it('should call the streams service to extract stream definition', () => {
        const response = new MockResponse();
        response.body = STREAM_DEFINITIONS;
        let streamDefinitions = this.streamsService.extractData(response);
        expect(streamDefinitions.pageNumber).toBe(0);
        expect(streamDefinitions.pageSize).toBe(1);
        expect(streamDefinitions.items[0].name).toBe('foo2');

        response.body = {};
        streamDefinitions = this.streamsService.extractData(response);
        expect(streamDefinitions.items.length).toBe(0);
      });
    });

    describe('relatedStreamDefinitions', () => {

      it('should call the streams service to get related stream definitions no nesting', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.getRelatedDefinitions).toBeDefined();

        this.streamsService.getRelatedDefinitions('test');

        const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
        expect(httpUri).toEqual('/streams/definitions/test/related');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
    });

      it('should call the streams service to get related stream definitions with nesting', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.getRelatedDefinitions).toBeDefined();

        this.streamsService.getRelatedDefinitions('test', true);
        const httpHeaders = HttpUtils.getDefaultHttpHeaders();
        const params = new HttpParams()
          .append('nested', 'true');


        const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
        const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
        expect(httpUri).toEqual('/streams/definitions/test/related');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
        expect(httpParams.get('nested')).toEqual('true');
      });

    });

    describe('metrics', () => {

      it('should call the streams metrics service no stream names specified', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.metrics).toBeDefined();

        this.streamsService.metrics();

        const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
        expect(httpUri).toEqual('/metrics/streams');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
      });

      it('should call the streams metrics service with stream names specified', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.metrics).toBeDefined();

        this.streamsService.metrics(['test1', 'test2']);
        const httpHeaders = HttpUtils.getDefaultHttpHeaders();
        const params = new HttpParams()
          .append('names', 'test1,test2');

        const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
        const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
        const httpParams = this.mockHttp.get.calls.mostRecent().args[1].params;
        expect(httpUri).toEqual('/metrics/streams');
        expect(headerArgs.get('Content-Type')).toEqual('application/json');
        expect(headerArgs.get('Accept')).toEqual('application/json');
        expect(httpParams.get('names')).toEqual('test1,test2');

      });

    });

    describe('destroyMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to destroy multiple stream definitions', () => {

        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
        // expect(this.streamsService.streamDefinitions).toBeDefined();
        const streamDefinitions = [
          new StreamDefinition('stream1', 'file|filter|ftp', 'deployed'),
          new StreamDefinition('stream2', 'ftp|filter|file', 'deployed')
        ];
        this.streamsService.destroyMultipleStreamDefinitions(streamDefinitions);

        const httpUri1 = this.mockHttp.delete.calls.argsFor(0)[0];
        const headerArgs1 = this.mockHttp.delete.calls.argsFor(0)[1].headers;
        expect(httpUri1).toEqual('/streams/definitions/stream1');
        expect(headerArgs1.get('Content-Type')).toEqual('application/json');
        expect(headerArgs1.get('Accept')).toEqual('application/json');

        const httpUri2 = this.mockHttp.delete.calls.argsFor(1)[0];
        const headerArgs2 = this.mockHttp.delete.calls.argsFor(1)[1].headers;
        expect(httpUri2).toEqual('/streams/definitions/stream2');
        expect(headerArgs2.get('Content-Type')).toEqual('application/json');
        expect(headerArgs2.get('Accept')).toEqual('application/json');

        expect(this.mockHttp.delete).toHaveBeenCalledTimes(2);
      });
    });

    describe('deployMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to deploy multiple stream definitions', () => {
        this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
        // expect(this.streamsService.streamDefinitions).toBeDefined();
        const stream1 = new StreamDefinition('stream1', 'file|filter|ftp', 'undeployed');
        const stream2 = new StreamDefinition('stream2', 'file|filter|ftp', 'undeployed');
        stream1.deploymentProperties = { a: 'a' };
        this.streamsService.deployMultipleStreamDefinitions([stream1, stream2]);

        const httpUri1 = this.mockHttp.post.calls.argsFor(0)[0];
        const body1 = this.mockHttp.post.calls.argsFor(0)[1];
        const headerArgs1 = this.mockHttp.post.calls.argsFor(0)[2].headers;
        expect(httpUri1).toEqual('/streams/deployments/stream1');
        expect(body1).toEqual(JSON.parse('{ "a": "a" }'));
        expect(headerArgs1.get('Content-Type')).toEqual('application/json');
        expect(headerArgs1.get('Accept')).toEqual('application/json');

        const httpUri2 = this.mockHttp.post.calls.argsFor(1)[0];
        const body2 = this.mockHttp.post.calls.argsFor(1)[1];
        const headerArgs2 = this.mockHttp.post.calls.argsFor(1)[2].headers;
        expect(httpUri2).toEqual('/streams/deployments/stream2');
        expect(body2).toEqual({});
        expect(headerArgs2.get('Content-Type')).toEqual('application/json');
        expect(headerArgs2.get('Accept')).toEqual('application/json');

        expect(this.mockHttp.post).toHaveBeenCalledTimes(2);
      });
    });

    describe('undeployMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to undeploy multiple stream definitions', () => {
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
        // expect(this.streamsService.streamDefinitions).toBeDefined();
        const streamDefinitions = [
          new StreamDefinition('stream1', 'file|filter|ftp', 'deployed'),
          new StreamDefinition('stream2', 'ftp|filter|file', 'deployed')
        ];
        this.streamsService.undeployMultipleStreamDefinitions(streamDefinitions);

        const httpUri1 = this.mockHttp.delete.calls.argsFor(0)[0];
        const headerArgs1 = this.mockHttp.delete.calls.argsFor(0)[1].headers;
        expect(httpUri1).toEqual('/streams/deployments/stream1');
        expect(headerArgs1.get('Content-Type')).toEqual('application/json');
        expect(headerArgs1.get('Accept')).toEqual('application/json');

        const httpUri2 = this.mockHttp.delete.calls.argsFor(1)[0];
        const headerArgs2 = this.mockHttp.delete.calls.argsFor(1)[1].headers;
        expect(httpUri2).toEqual('/streams/deployments/stream2');
        expect(headerArgs2.get('Content-Type')).toEqual('application/json');
        expect(headerArgs2.get('Accept')).toEqual('application/json');

        expect(this.mockHttp.delete).toHaveBeenCalledTimes(2);
      });
    });

  });
});
