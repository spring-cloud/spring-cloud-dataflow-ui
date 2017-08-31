import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ErrorHandler } from '../shared/model/error-handler';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { TasksService } from './tasks.service';
import { HttpUtils } from '../shared/support/http.utils';

describe('TasksService', () => {

  beforeEach(() => {
    this.mockHttp = jasmine.createSpyObj('mockHttp', ['delete', 'get', 'post']);
    this.jsonData = { };
    const errorHandler = new ErrorHandler();
    const sharedServices = new SharedAppsService(this.mockHttp, errorHandler);
    this.tasksService = new TasksService(this.mockHttp, errorHandler, sharedServices);
  });

  describe('getTaskAppRegistrations', () => {
    it('should call the apps service with the right url to get task apps', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      expect(this.tasksService.appRegistrations).toBeDefined();

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      params.append('type', 'task');

      const requestOptionsArgs = HttpUtils.getDefaultRequestOptions();
      requestOptionsArgs.search = params;

      this.tasksService.getTaskAppRegistrations();

      const defaultPageNumber: number = this.tasksService.appRegistrations.pageNumber;
      const defaultPageSize: number = this.tasksService.appRegistrations.pageSize;

      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(10);

      expect(this.mockHttp.get).toHaveBeenCalledWith('/apps', requestOptionsArgs);
    });
  });

  describe('getDefinitions', () => {
    it('should call the definitions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      // params.append('type', 'task');

      this.tasksService.getDefinitions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: params });
    });

    it('should call the definitions service with the right url [null sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      this.tasksService.getDefinitions(null, null);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: params });
    });

    it('should call the definitions service with the right url [desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'DEFINITION,ASC');
      tocheck.append('sort', 'DEFINITION_NAME,DESC');
      this.tasksService.getDefinitions(true, false);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: tocheck });
    });

    it('should call the definitions service with the right url [asc desc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'DEFINITION,DESC');
      tocheck.append('sort', 'DEFINITION_NAME,ASC');
      this.tasksService.getDefinitions(false, true);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/definitions', { search: tocheck });
    });
  });

  describe('getExecutions', () => {
    it('should call the executions service with the right url [no sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));

      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      // params.append('type', 'task');

      this.tasksService.getExecutions();
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: params });
    });

    it('should call the executions service with the right url [null sort params]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      this.tasksService.getExecutions(null, null, null, null, null);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: params });
    });

    it('should call the executions service with the right url [desc desc desc asc desc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'START_TIME,DESC');
      tocheck.append('sort', 'END_TIME,DESC');
      tocheck.append('sort', 'EXIT_CODE,DESC');
      tocheck.append('sort', 'TASK_EXECUTION_ID,ASC');
      tocheck.append('sort', 'TASK_NAME,DESC');
      this.tasksService.getExecutions(false, true, true, true, true);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: tocheck });
    });

    it('should call the executions service with the right url [asc asc asc desc asc sort]', () => {
      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      const params: URLSearchParams = HttpUtils.getPaginationParams(0, 10);
      const tocheck = params;
      tocheck.append('sort', 'START_TIME,ASC');
      tocheck.append('sort', 'END_TIME,ASC');
      tocheck.append('sort', 'EXIT_CODE,ASC');
      tocheck.append('sort', 'TASK_EXECUTION_ID,DESC');
      tocheck.append('sort', 'TASK_NAME,ASC');
      this.tasksService.getExecutions(true, false, false, false, false);
      expect(this.mockHttp.get).toHaveBeenCalledWith('/tasks/executions', { search: tocheck });
    });
  });
});
