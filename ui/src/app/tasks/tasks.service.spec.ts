import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from '../shared/model/error-handler';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { TasksService } from './tasks.service';
import { HttpUtils } from '../shared/support/http.utils';

describe('TasksService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const sharedServices = new SharedAppsService(this.mockHttp, errorHandler);
    this.tasksService = new TasksService(this.mockHttp, errorHandler, sharedServices);
  });
  
  describe('getDefinitions', () => {
    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);

      this.tasksService.getDefinitions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: params });
    });

    it('should call the definitions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);
      this.tasksService.getDefinitions(undefined);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: params });
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);
      const tocheck = params;
      tocheck.append('sort', 'START_TIME,ASC');
      this.tasksService.getDefinitions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'ASC' });
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: tocheck });
    });
  });

  describe('getExecutions', () => {
    it('should call the executions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);
      // params.append('type', 'task');

      this.tasksService.getExecutions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: params });
    });

    it('should call the executions service with the right url [undefined sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);
      this.tasksService.getExecutions(undefined);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: params });
    });

    it('should call the executions service with the right url (sort, order)', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 20);
      const tocheck = params;
      tocheck.append('sort', 'START_TIME,DESC');
      this.tasksService.getExecutions({ q: '', page: 0, size: 20, sort: 'START_TIME', order: 'DESC' });
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: tocheck });
    });

  });


});
