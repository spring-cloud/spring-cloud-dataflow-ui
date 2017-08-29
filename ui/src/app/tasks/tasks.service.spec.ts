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

      this.tasksService.getTaskAppRegistrations();

      const defaultPageNumber: number = this.tasksService.appRegistrations.pageNumber;
      const defaultPageSize: number = this.tasksService.appRegistrations.pageSize;

      expect(defaultPageNumber).toBe(0);
      expect(defaultPageSize).toBe(10);

      expect(this.mockHttp.get).toHaveBeenCalledWith('/apps', { search: params });
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

});
