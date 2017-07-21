import { Injectable } from '@angular/core';
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ErrorHandler } from "../shared/model/error-handler";
import { Page } from '../shared/model/page';
import { TaskExecution } from './model/task-execution';
import { TaskDefinition } from './model/task-definition';
import { AppInfo, AppInfoOptions } from './model/app-info';

@Injectable()
export class TasksService {

  private taskExecutionsUrl = '/tasks/executions';
  private appInfoUrl = '/apps/task';
  private taskDefinitionsUrl = '/tasks/definitions';
  public taskExecutions: Page<TaskExecution>;
  public taskDefinitions: Page<TaskDefinition>;

  constructor(private http: Http, private errorHandler: ErrorHandler) {
    this.taskExecutions = new Page<TaskExecution>();
    this.taskDefinitions = new Page<TaskDefinition>();
  }

  getExecutions(): Observable<Page<TaskExecution>> {
    const params = new URLSearchParams();
    params.append('page', this.taskExecutions.pageNumber.toString());
    params.append('size', this.taskExecutions.pageSize.toString());

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

  getDefinitions(): Observable<Page<TaskDefinition>> {
    const params = new URLSearchParams();
    params.append('page', this.taskDefinitions.pageNumber.toString());
    params.append('size', this.taskDefinitions.pageSize.toString());

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
      .map(data => {
      })
      .catch(this.errorHandler.handleError);
  }

  launchDefinition(name: string) {
    // TODO: add arguments and properties
    // POST http://localhost:9393/tasks/executions?arguments=&name=bartask2&properties=
    const params = new URLSearchParams();
    params.append('name', name);
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
      jsonItem.startTime,
      jsonItem.endTime,
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
    }
    else {
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
    }
    else {
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
