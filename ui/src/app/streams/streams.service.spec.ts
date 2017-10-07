import {ErrorHandler} from '../shared/model/error-handler';
import {StreamsService} from './streams.service';
import {Observable} from 'rxjs/Observable';
import {HttpUtils, URL_QUERY_ENCODER} from '../shared/support/http.utils';
import {StreamDefinition} from './model/stream-definition';
import {URLSearchParams} from '@angular/http';
import {MockResponse} from '../tests/mocks/response';
import {STREAM_DEFINITIONS} from '../tests/mocks/mock-data';

/**
 * Test Streams Services.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamsService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    this.streamsService = new StreamsService(this.mockHttp, errorHandler);
  });

  describe('getDefinitions', () => {
    it('should call the streams service with the right url to get stream definitions', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      expect(this.streamsService.streamDefinitions).toBeDefined();

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;
      this.streamsService.getDefinitions()  ;

      const defaultPageNumber: number = this.streamsService.streamDefinitions.pageNumber;
      const defaultPageSize: number = this.streamsService.streamDefinitions.pageSize;

      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(10);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);

      this.streamsService.streamDefinitions.filter = 'testFilter';
      this.streamsService.getDefinitions();
      expect(this.streamsService.streamDefinitions.filter).toBe('testFilter');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);
    });

    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;
      this.streamsService.getDefinitions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);
    });

    it('should call the definitions service with the right url [null sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;
      this.streamsService.getDefinitions(undefined, undefined);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      params.append('sort', 'DEFINITION,ASC');
      params.append('sort', 'DEFINITION_NAME,DESC');
      this.streamsService.getDefinitions(true, false);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);
    });

    it('should call the definitions service with the right url [asc desc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      params.append('sort', 'DEFINITION,DESC');
      params.append('sort', 'DEFINITION_NAME,ASC');
      this.streamsService.getDefinitions(false, true);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', requestOptionsArgs);
    });
  });

  describe('destroyDefinition', () => {
    it('should call the streams service to destroy stream definition', () => {
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

      expect(this.streamsService.streamDefinitions).toBeDefined();

      const streamDefinition = new StreamDefinition('test', 'time|log', 'undeployed');
      this.streamsService.destroyDefinition(streamDefinition);
      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/definitions/test', requestOptionsArgs);
    });

   describe('undeployDefinition', () => {
      it('should call the streams service to undeploy stream definition', () => {
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.streamDefinitions).toBeDefined();

        const streamDefinition = new StreamDefinition('test', 'time|log', 'deployed');
        this.streamsService.undeployDefinition(streamDefinition);
        const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/deployments/test', requestOptionsArgs);
      });
    });

    describe('deployDefinition', () => {
      it('should call the streams service to deploy stream definition', () => {
        this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.streamDefinitions).toBeDefined();

        this.streamsService.deployDefinition('test', {});
        const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
        expect(this.mockHttp.post).toHaveBeenCalledWith('/streams/deployments/test', {}, requestOptionsArgs);
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
        expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions/test/related', HttpUtils.getDefaultRequestOptions());
      });

      it('should call the streams service to get related stream definitions with nesting', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.getRelatedDefinitions).toBeDefined();

        this.streamsService.getRelatedDefinitions('test', true);
        const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
        const params =  new URLSearchParams('', URL_QUERY_ENCODER);
        params.append('nested', 'true');
        requestOptionsArgs.params = params;
        expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions/test/related', requestOptionsArgs);
      });

    });

    describe('metrics', () => {

      it('should call the streams metrics service no stream names specified', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.metrics).toBeDefined();

        this.streamsService.metrics();
        expect(this.mockHttp.get).toHaveBeenCalledWith('/metrics/streams', HttpUtils.getDefaultRequestOptions());
      });

      it('should call the streams metrics service with stream names specified', () => {
        this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.metrics).toBeDefined();

        this.streamsService.metrics(['test1', 'test2']);
        const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
        const params =  new URLSearchParams('', URL_QUERY_ENCODER);
        params.append('names', 'test1,test2');
        requestOptionsArgs.params = params;
        expect(this.mockHttp.get).toHaveBeenCalledWith('/metrics/streams', requestOptionsArgs);
      });

    });

    describe('destroyMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to destroy multiple stream definitions', () => {
        const options = HttpUtils.getDefaultRequestOptions();
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
        expect(this.streamsService.streamDefinitions).toBeDefined();
        const streamDefinitions = [
          new StreamDefinition('stream1', 'file|filter|ftp', 'deployed'),
          new StreamDefinition('stream2', 'ftp|filter|file', 'deployed')
        ];
        this.streamsService.destroyMultipleStreamDefinitions(streamDefinitions);
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/definitions/stream1', options);
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/definitions/stream2', options);
        expect(this.mockHttp.delete).toHaveBeenCalledTimes(2);
      });
    });

    describe('deployMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to deploy multiple stream definitions', () => {
        const options = HttpUtils.getDefaultRequestOptions();
        this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));
        expect(this.streamsService.streamDefinitions).toBeDefined();
        const stream1 = new StreamDefinition('stream1', 'file|filter|ftp', 'undeployed');
        const stream2 = new StreamDefinition('stream2', 'file|filter|ftp', 'undeployed');
        stream1.deploymentProperties = {a: 'a'};
        this.streamsService.deployMultipleStreamDefinitions([stream1, stream2]);
        expect(this.mockHttp.post).toHaveBeenCalledWith('/streams/deployments/stream1', {a: 'a'}, options);
        expect(this.mockHttp.post).toHaveBeenCalledWith('/streams/deployments/stream2', {}, options);
        expect(this.mockHttp.post).toHaveBeenCalledTimes(2);
      });
    });

    describe('undeployMultipleStreamDefinitions', () => {
      it('should call the stream definition service with the right url to undeploy multiple stream definitions', () => {
        const options = HttpUtils.getDefaultRequestOptions();
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));
        expect(this.streamsService.streamDefinitions).toBeDefined();
        const streamDefinitions = [
          new StreamDefinition('stream1', 'file|filter|ftp', 'deployed'),
          new StreamDefinition('stream2', 'ftp|filter|file', 'deployed')
        ];
        this.streamsService.undeployMultipleStreamDefinitions(streamDefinitions);
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/deployments/stream1', options);
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/deployments/stream2', options);
        expect(this.mockHttp.delete).toHaveBeenCalledTimes(2);
      });
    });

  });
});
