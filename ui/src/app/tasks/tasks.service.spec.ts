import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from '../shared/model/error-handler';
import { TasksService } from './tasks.service';
import { LoggerService } from '../shared/services/logger.service';

describe('TasksService', () => {

  beforeEach(() => {
    this.mockHttp = {
      delete: jasmine.createSpy('delete'),
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post')
    };
    this.jsonData = {};
    const loggerService = new LoggerService();
    const errorHandler = new ErrorHandler();
    this.tasksService = new TasksService(this.mockHttp, errorHandler, loggerService);
  });

  describe('getDefinitions', () => {
    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.tasksService.getDefinitions();

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');

    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.tasksService.getDefinitions(undefined);

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.tasksService.getDefinitions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/definitions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,ASC');
    });
  });

  describe('getExecutions', () => {
    it('should call the executions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      // params.append('type', 'task');

      this.tasksService.getExecutions();

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.tasksService.getExecutions(undefined);

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
    });

    it('should call the executions service with the right url (sort, order)', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.tasksService.getExecutions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });

      const httpUri1 = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs1 = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri1).toEqual('/tasks/executions');
      expect(headerArgs1).toBeUndefined();
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('START_TIME,DESC');
    });
  });
});
