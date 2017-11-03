import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorHandler } from '../shared/model/error-handler';
import { Page } from '../shared/model/page';
import { TaskExecution } from './model/task-execution';
import { TaskDefinition } from './model/task-definition';
import { AppInfo } from './model/app-info';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { AppRegistration } from '../shared/model/app-registration.model';

import { PageRequest } from '../shared/model/pagination/page-request.model';
import { ApplicationType } from '../shared/model/application-type';
import * as moment from 'moment';

@Injectable()
export class TasksService {

  private taskExecutionsUrl = '/tasks/executions';
  private appInfoUrl = '/apps/task';
  private taskDefinitionsUrl = '/tasks/definitions';
  public taskExecutions: Page<TaskExecution>;
  public taskDefinitions: Page<TaskDefinition>;
  public appRegistrations: Page<AppRegistration>;

  constructor(private http: Http, private errorHandler: ErrorHandler, private sharedAppsService: SharedAppsService) {
    this.taskExecutions = new Page<TaskExecution>();
    this.taskDefinitions = new Page<TaskDefinition>();
    this.appRegistrations = new Page<AppRegistration>();
  }

  /**
   * Calls the Spring Cloud Data Flow server to get paged task executions specified in {@link TaskExecution}.
   *
   * If sort order is defined as true, desc order is used and if false, as order is used.
   * If method is called without parameter or as undefined, sort properties are not added
   * to the request.
   *
   * @param {boolean} executionIdSort the sort for TASK_EXECUTION_ID
   * @param {boolean} taskNameSort the sort for TASK_NAME
   * @param {boolean} startTimeSort the sort for START_TIME
   * @param {boolean} endTimeSort the sort for END_TIME
   * @param {boolean} exitCodeSort the sort for EXIT_CODE
   * @returns {Observable<Page<TaskExecution>>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getExecutions(executionIdSort?: boolean, taskNameSort?: boolean, startTimeSort?: boolean, endTimeSort?: boolean,
      exitCodeSort?: boolean): Observable<Page<TaskExecution>> {
    const params = new URLSearchParams();
    params.append('page', this.taskExecutions.pageNumber.toString());
    params.append('size', this.taskExecutions.pageSize.toString());

    if (startTimeSort !== undefined) {
      if (startTimeSort) {
        params.append('sort', 'START_TIME,DESC');
      } else {
        params.append('sort', 'START_TIME,ASC');
      }
    }
    if (endTimeSort !== undefined) {
      if (endTimeSort) {
        params.append('sort', 'END_TIME,DESC');
      } else {
        params.append('sort', 'END_TIME,ASC');
      }
    }
    if (exitCodeSort !== undefined) {
      if (exitCodeSort) {
        params.append('sort', 'EXIT_CODE,DESC');
      } else {
        params.append('sort', 'EXIT_CODE,ASC');
      }
    }
    if (executionIdSort !== undefined) {
      if (executionIdSort) {
        params.append('sort', 'TASK_EXECUTION_ID,DESC');
      } else {
        params.append('sort', 'TASK_EXECUTION_ID,ASC');
      }
    }
    if (taskNameSort !== undefined) {
      if (taskNameSort) {
        params.append('sort', 'TASK_NAME,DESC');
      } else {
        params.append('sort', 'TASK_NAME,ASC');
      }
    }

    if (this.taskExecutions.filter && this.taskExecutions.filter.length > 0) {
      params.append('search', this.taskExecutions.filter);
    }
    return this.http.get(this.taskExecutionsUrl, {search: params})
      .map(this.extractPagedData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  getExecution(id: string): Observable<TaskExecution> {
    return this.http.get(this.taskExecutionsUrl + '/' + id, {})
      .map(this.extractData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  getAppInfo(id: string): Observable<AppInfo> {
    const params = new URLSearchParams();
    params.append('unprefixedPropertiesOnly', 'true');
    return this.http.get(this.appInfoUrl + '/' + id, {search: params})
      .map(this.extractAppInfoData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  getTaskAppRegistrations(): Observable<Page<AppRegistration>> {
    return this.sharedAppsService.getApps(
      new PageRequest(this.appRegistrations.pageNumber, this.appRegistrations.pageSize), ApplicationType.task).map(
        appRegistrations => {
          this.appRegistrations = appRegistrations;
          return appRegistrations;
        });
  }

  getDefinition(taskname: string): Observable<TaskDefinition> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.get(`${this.taskDefinitionsUrl}/${taskname}`, options)
      .map(res => {
        const json = res.json();
        return new TaskDefinition(
          json.name,
          json.dslText,
          json.composed,
          json.status
        );
      })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Calls the Spring Cloud Data Flow server to get task definitions the specified {@link TaskDefinition}.
   *
   * If sort order is defined as true, desc order is used and if false, as order is used.
   * If method is called without parameter or as null, sort properties are not added
   * to the request.
   *
   * @param definitionNameSort the sort for DEFINITION_NAME
   * @param definitionSort the sort for DEFINITION
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getDefinitions(definitionNameSort?: boolean, definitionSort?: boolean): Observable<Page<TaskDefinition>> {
    const params = new URLSearchParams();
    params.append('page', this.taskDefinitions.pageNumber.toString());
    params.append('size', this.taskDefinitions.pageSize.toString());

    // we can have asc and desc with multiple fields
    // if sort param is sent multiple times.
    // we put sort by definition first as
    // names are always unique, making primary
    // sort by name pointless.
    if (definitionSort != null) {
      if (definitionSort) {
        params.append('sort', 'DEFINITION,DESC');
      } else {
        params.append('sort', 'DEFINITION,ASC');
      }
    }
    if (definitionNameSort != null) {
      if (definitionNameSort) {
        params.append('sort', 'DEFINITION_NAME,DESC');
      } else {
        params.append('sort', 'DEFINITION_NAME,ASC');
      }
    }

    if (this.taskDefinitions.filter && this.taskDefinitions.filter.length > 0) {
      params.append('search', this.taskDefinitions.filter);
    }
    return this.http.get(this.taskDefinitionsUrl, {search: params})
      .map(this.extractDefinitionsData.bind(this))
      .catch(this.errorHandler.handleError);
  }

  createDefinition(definition: string, name: string) {
    console.log('Create task definition ' + definition + ' ' + name);
    const params = new URLSearchParams();
    params.append('definition', definition);
    params.append('name', name);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers, params: params});

    return this.http.post(this.taskDefinitionsUrl, {}, options)
      .catch(this.errorHandler.handleError);
  }

  destroyDefinition(name: string) {
    console.log('Destroying...', name);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.delete('/tasks/definitions/' + name, options)
      .catch(this.errorHandler.handleError);
  }

  launchDefinition(name: string, taskArguments?: string, taskProperties?: string) {
    const params = new URLSearchParams();
    params.append('name', name);
    if (taskArguments) {
      params.append('arguments', taskArguments);
    }
    if (taskProperties) {
      params.append('properties', taskProperties);
    }
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers, params: params});
    return this.http.post(this.taskExecutionsUrl, {}, options)
      .catch(this.errorHandler.handleError);
  }

  private extractAppInfoData(res: Response): AppInfo {
    const body = res.json();
    const appInfo: AppInfo = body as AppInfo;
    return appInfo;
  }

  private extractData(res: Response): TaskExecution {
    const jsonItem = res.json();
    const taskExecution: TaskExecution = new TaskExecution(
      jsonItem.executionId,
      jsonItem.exitCode,
      jsonItem.taskName,
      moment.utc(jsonItem.startTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]'),
      moment.utc(jsonItem.endTime, 'Y-MM-DD[T]HH:mm:ss.SSS[Z]'),
      jsonItem.exitMessage,
      jsonItem.arguments,
      jsonItem.jobExecutionIds,
      jsonItem.errorMessage,
      jsonItem.externalExecutionId
    );
    return taskExecution;
  }

  private extractPagedData(res: Response): Page<TaskExecution> {
    const body = res.json();
    let items: TaskExecution[];
    if (body._embedded && body._embedded.taskExecutionResourceList) {
      items = body._embedded.taskExecutionResourceList.map(jsonItem => {
        const taskExecution: TaskExecution = new TaskExecution(
          jsonItem.executionId,
          jsonItem.exitCode,
          jsonItem.taskName,
          jsonItem.startTime,
          jsonItem.endTime,
          jsonItem.exitMessage,
          jsonItem.arguments,
          jsonItem.jobExecutionIds,
          jsonItem.errorMessage,
          jsonItem.externalExecutionId
        );
        return taskExecution;
      });
    } else {
      items = [];
    }

    if (body.page) {
      console.log('BODY', body.page);
      this.taskExecutions.pageNumber = body.page.number;
      this.taskExecutions.pageSize = body.page.size;
      this.taskExecutions.totalElements = body.page.totalElements;
      this.taskExecutions.totalPages = body.page.totalPages;
    }

    this.taskExecutions.items = items;

    console.log('Extracted Task Executions:', this.taskExecutions);
    return this.taskExecutions;
  }

  private extractDefinitionsData(res: Response): Page<TaskDefinition> {
    const body = res.json();
    let items: TaskDefinition[];
    if (body._embedded && body._embedded.taskDefinitionResourceList) {
      items = body._embedded.taskDefinitionResourceList.map(jsonItem => {
        const taskDefinition: TaskDefinition = new TaskDefinition(
          jsonItem.name,
          jsonItem.dslText,
          jsonItem.composed,
          jsonItem.status
        );
        return taskDefinition;
      });
    } else {
      items = [];
    }

    if (body.page) {
      console.log('BODY', body.page);
      this.taskDefinitions.pageNumber = body.page.number;
      this.taskDefinitions.pageSize = body.page.size;
      this.taskDefinitions.totalElements = body.page.totalElements;
      this.taskDefinitions.totalPages = body.page.totalPages;
    }

    this.taskDefinitions.items = items;

    console.log('Extracted Task Definitions:', this.taskDefinitions);
    return this.taskDefinitions;
  }

}
