import {ErrorHandler} from '../shared/model/error-handler';
import {StreamsService} from './streams.service';
import {Observable} from 'rxjs/Observable';
import {HttpUtils} from '../shared/support/http.utils';
import {StreamDefinition} from './model/stream-definition';
import {Headers, RequestOptions} from '@angular/http';
import {MockResponse} from '../tests/mocks/response';
import {STREAM_DEFINITIONS} from '../tests/mocks/mock-data';

/**
 * Test Streams Services.
 *
 * @author Glenn Renfro
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

      this.streamsService.getDefinitions();

      const defaultPageNumber: number = this.streamsService.streamDefinitions.pageNumber;
      const defaultPageSize: number = this.streamsService.streamDefinitions.pageSize;

      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(10);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', {search: params});

      this.streamsService.streamDefinitions.filter = 'testFilter';
      this.streamsService.getDefinitions();
      expect(this.streamsService.streamDefinitions.filter).toBe('testFilter');
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', {search: params});
    });

    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);

      this.streamsService.getDefinitions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', { search: params });
    });

    it('should call the definitions service with the right url [null sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      this.streamsService.getDefinitions(undefined, undefined);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', { search: params });
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'DEFINITION,ASC');
      tocheck.append('sort', 'DEFINITION_NAME,DESC');
      this.streamsService.getDefinitions(true, false);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', { search: tocheck });
    });

    it('should call the definitions service with the right url [asc desc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'DEFINITION,DESC');
      tocheck.append('sort', 'DEFINITION_NAME,ASC');
      this.streamsService.getDefinitions(false, true);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/streams/definitions', { search: tocheck });
    });
  });

  describe('destroyDefinition', () => {
    it('should call the streams service to destroy stream definition', () => {
      this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

      expect(this.streamsService.streamDefinitions).toBeDefined();

      const streamDefinition = new StreamDefinition('test', 'time|log', 'undeployed');
      this.streamsService.destroyDefinition(streamDefinition);
      const headers = new Headers({'Content-Type': 'application/json'});
      const options = new RequestOptions({headers: headers});
      expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/definitions/test', options);
    });

   describe('undeployDefinition', () => {
      it('should call the streams service to undeploy stream definition', () => {
        this.mockHttp.delete.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.streamDefinitions).toBeDefined();

        const streamDefinition = new StreamDefinition('test', 'time|log', 'deployed');
        this.streamsService.undeployDefinition(streamDefinition);
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        expect(this.mockHttp.delete).toHaveBeenCalledWith('/streams/deployments/test', options);
      });
    });

    describe('deployDefinition', () => {
      it('should call the streams service to deploy stream definition', () => {
        this.mockHttp.post.and.returnValue(Observable.of(this.jsonData));

        expect(this.streamsService.streamDefinitions).toBeDefined();

        this.streamsService.deployDefinition('test', {});
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        expect(this.mockHttp.post).toHaveBeenCalledWith('/streams/deployments/test', {}, options);
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
  });
});
