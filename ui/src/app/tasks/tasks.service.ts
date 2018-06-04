import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../shared/model/error-handler';
import { Page } from '../shared/model/page';
import { TaskExecution } from './model/task-execution';
import { TaskDefinition } from './model/task-definition';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import * as moment from 'moment';
import { OrderParams } from '../shared/components/shared.interface';
import { TaskCreateParams, TaskLaunchParams, TaskListParams } from './components/tasks.interface';
import { HttpUtils } from '../shared/support/http.utils';
import { map } from 'rxjs/operators';
import { LoggerService } from '../shared/services/logger.service';

/**
 * Provides {@link TaskDefinition} related services.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Alex Boyko
 * @author Damien Vitrac
 *
 */
@Injectable()
export class TasksService {

  /**
   * URL API (definitions, executions, app)
   */
  public static URL = {
    EXECUTIONS: '/tasks/executions',
    DEFINITIONS: '/tasks/definitions',
    APP: '/apps/task'
  };

  /**
   * Tasks List context
   * Persist the state of TaskDefinitionsComponent
   */
  public tasksContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'DEFINITION_NAME',
    order: OrderParams.ASC,
    itemsSelected: []
  };

  /**
   * Executions List context
   * Persist the state of the TaskExecutionsComponent
   */
  public executionsContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'TASK_EXECUTION_ID',
    order: OrderParams.DESC,
    itemsSelected: []
  };

  /**
   * Constructor
   *
   * @param {Http} http
   * @param {ErrorHandler} errorHandler
   * @param {LoggerService} loggerService
   * @param {SharedAppsService} sharedAppsService
   */
  constructor(private http: Http,
              private errorHandler: ErrorHandler,
              private loggerService: LoggerService,
              private sharedAppsService: SharedAppsService) {
  }

  /**
   * Calls the Spring Cloud Data Flow server to get paged task executions specified in {@link TaskExecution}.
   *
   * @param {TaskListParams} taskListParams
   * @returns {Observable<Page<TaskExecution>>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getExecutions(taskListParams: TaskListParams): Observable<Page<TaskExecution>> {
    taskListParams = taskListParams || { q: '', page: 0, size: 20, sort: null, order: null };
    const params = HttpUtils.getPaginationParams(taskListParams.page, taskListParams.size);
    if (taskListParams.q) {
      params.append('search', taskListParams.q);
    }
    if (taskListParams.sort && taskListParams.order) {
      params.append('sort', `${taskListParams.sort},${taskListParams.order}`);
    }
    return this.http.get(TasksService.URL.EXECUTIONS, { search: params })
      .pipe(map((res) => {
        const taskExecutions = new Page<TaskExecution>();
        const body = res.json();
        if (body._embedded && body._embedded.taskExecutionResourceList) {
          taskExecutions.items = body._embedded.taskExecutionResourceList.map(jsonItem => {
            return new TaskExecution(
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
          });
        }
        if (body.page) {
          taskExecutions.pageNumber = body.page.number;
          taskExecutions.pageSize = body.page.size;
          taskExecutions.totalElements = body.page.totalElements;
          taskExecutions.totalPages = body.page.totalPages;
        }
        this.loggerService.log('Extracted Task Executions:', taskExecutions);
        return taskExecutions;
      }))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Get the defails of an execution
   *
   * @param {string} id
   * @returns {Observable<TaskExecution>}
   */
  getExecution(id: string): Observable<TaskExecution> {
    return this.http.get(TasksService.URL.EXECUTIONS + '/' + id, {})
      .pipe(map((item) => {
        const jsonItem = item.json();
        return new TaskExecution(
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
      }))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Get the details of a definition
   *
   * @param {string} taskname
   * @returns {Observable<TaskDefinition>}
   */
  getDefinition(taskname: string): Observable<TaskDefinition> {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${TasksService.URL.DEFINITIONS}/${taskname}`, options)
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
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   * @param {TaskListParams} taskListParams
   */
  getDefinitions(taskListParams: TaskListParams): Observable<Page<TaskDefinition>> {
    taskListParams = taskListParams || { q: '', page: 0, size: 20, sort: null, order: null };
    const params = HttpUtils.getPaginationParams(taskListParams.page, taskListParams.size);
    if (taskListParams.q) {
      params.append('search', taskListParams.q);
    }
    if (taskListParams.sort && taskListParams.order) {
      params.append('sort', `${taskListParams.sort},${taskListParams.order}`);
    }
    return this.http.get(TasksService.URL.DEFINITIONS, { search: params })
      .pipe(map((res) => {
        const taskDefinitions = new Page<TaskDefinition>();
        const body = res.json();
        if (body._embedded && body._embedded.taskDefinitionResourceList) {
          taskDefinitions.items = body._embedded.taskDefinitionResourceList.map(jsonItem => {
            return new TaskDefinition(
              jsonItem.name,
              jsonItem.dslText,
              jsonItem.composed,
              jsonItem.status
            );
          });
        }
        if (body.page) {
          taskDefinitions.pageNumber = body.page.number;
          taskDefinitions.pageSize = body.page.size;
          taskDefinitions.totalElements = body.page.totalElements;
          taskDefinitions.totalPages = body.page.totalPages;
        }
        this.loggerService.log('Extracted Task Definitions:', taskDefinitions);
        return taskDefinitions;
      }))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Create a definition
   *
   * @returns {any}
   * @param {TaskCreateParams} taskCreateParams
   */
  createDefinition(taskCreateParams: TaskCreateParams) {
    this.loggerService.log('Create task definition ' + taskCreateParams.definition + ' ' + taskCreateParams.name);
    const params = new URLSearchParams();
    params.append('definition', taskCreateParams.definition);
    params.append('name', taskCreateParams.name);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, params: params });
    return this.http.post(TasksService.URL.DEFINITIONS, {}, options)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Destroy a definition
   *
   * @param {TaskDefinition} taskDefinition
   * @returns {Observable<Response>}
   */
  destroyDefinition(taskDefinition: TaskDefinition): Observable<Response> {
    this.loggerService.log('Destroying...', taskDefinition.name);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(TasksService.URL.DEFINITIONS + '/' + taskDefinition.name, options)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Destroy definitions
   *
   * @param {TaskDefinition[]} taskDefinitions
   * @returns {Observable<Response[]>}
   */
  destroyDefinitions(taskDefinitions: TaskDefinition[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const taskDefinition of taskDefinitions) {
      observables.push(this.destroyDefinition(taskDefinition));
    }
    return Observable.forkJoin(observables);
  }

  /**
   * Launch a task
   *
   * @returns {any}
   * @param {TaskLaunchParams} taskLaunchParams
   */
  launchDefinition(taskLaunchParams: TaskLaunchParams) {
    const params = new URLSearchParams();
    params.append('name', taskLaunchParams.name);
    if (taskLaunchParams.args) {
      params.append('arguments', taskLaunchParams.args);
    }
    if (taskLaunchParams.props) {
      params.append('properties', taskLaunchParams.props);
    }
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, params: params });
    return this.http.post(TasksService.URL.EXECUTIONS, {}, options)
      .catch(this.errorHandler.handleError);
  }

}
