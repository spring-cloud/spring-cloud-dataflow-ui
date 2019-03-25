import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { ErrorHandler } from '../shared/model/error-handler';
import { Page } from '../shared/model/page';
import { TaskExecution } from './model/task-execution';
import { TaskDefinition } from './model/task-definition';
import { ListDefaultParams, OrderParams } from '../shared/components/shared.interface';
import { HttpUtils } from '../shared/support/http.utils';
import { catchError, map } from 'rxjs/operators';
import { LoggerService } from '../shared/services/logger.service';
import { TaskSchedule } from './model/task-schedule';
import {
  TaskCreateParams, TaskLaunchParams, TaskListParams, TaskScheduleCreateParams
} from './components/tasks.interface';
import { HttpResponse } from '@angular/common/http';
import { Platform, PlatformTask } from '../shared/model/platform';
import { DataflowEncoder } from '../shared/support/encoder.utils';

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
    APP: '/apps/task',
    SCHEDULES: '/tasks/schedules',
    PLATFORM: '/tasks/platforms'
  };

  /**
   * Tasks List context
   * Persist the state of TaskDefinitionsComponent
   */
  public tasksContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'taskName',
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
   * Schedules List context
   * Persist the state of the TaskSchedulesComponent
   */
  public schedulesContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'SCHEDULE_NAME',
    order: OrderParams.DESC,
    itemsSelected: []
  };

  /**
   * Constructor
   *
   * @param {HttpClient} httpClient
   * @param {ErrorHandler} errorHandler
   * @param {LoggerService} loggerService
   */
  constructor(private httpClient: HttpClient,
              private errorHandler: ErrorHandler,
              private loggerService: LoggerService) {
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
    let params = HttpUtils.getPaginationParams(taskListParams.page, taskListParams.size);
    if (taskListParams.q) {
      params = params.append('search', taskListParams.q);
    }
    if (taskListParams.sort && taskListParams.order) {
      params = params.append('sort', `${taskListParams.sort},${taskListParams.order}`);
    }
    return this.httpClient
      .get<any>(TasksService.URL.EXECUTIONS, { params: params })
      .pipe(
        map(TaskExecution.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Calls the Spring Cloud Data Flow server to get paged task executions specified in {@link TaskExecution}
   * for a task.
   *
   * @param {ListDefaultParams} listParams
   * @returns {Observable<Page<TaskExecution>>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getTaskExecutions(listParams: ListDefaultParams): Observable<Page<TaskExecution>> {
    listParams = listParams || { q: '', page: 0, size: 20, sort: null, order: null };
    let params = HttpUtils.getPaginationParams(listParams.page, listParams.size);
    if (listParams.q) {
      params = params.append('name', listParams.q);
    }
    if (listParams.sort && listParams.order) {
      params = params.append('sort', `${listParams.sort},${listParams.order}`);
    }
    return this.httpClient
      .get<any>(TasksService.URL.EXECUTIONS, { params: params })
      .pipe(
        map(TaskExecution.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Get the defails of an execution
   *
   * @param {string} id
   * @returns {Observable<TaskExecution>}
   */
  getExecution(id: string): Observable<TaskExecution> {
    return this.httpClient
      .get<any>(TasksService.URL.EXECUTIONS + '/' + id, {})
      .pipe(
        map(TaskExecution.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Get the details of a definition
   *
   * @param {string} taskname
   * @returns {Observable<TaskDefinition>}
   */
  getDefinition(taskname: string): Observable<TaskDefinition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .get<any>(`${TasksService.URL.DEFINITIONS}/${taskname}`, { headers: headers })
      .pipe(
        map(TaskDefinition.fromJSON),
        catchError(this.errorHandler.handleError)
      );
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
    let params = HttpUtils.getPaginationParams(taskListParams.page, taskListParams.size);
    if (taskListParams.q) {
      params = params.append('search', taskListParams.q);
    }
    if (taskListParams.sort && taskListParams.order) {
      params = params.append('sort', `${taskListParams.sort},${taskListParams.order}`);
    }
    return this.httpClient
      .get<any>(TasksService.URL.DEFINITIONS, { params: params })
      .pipe(
        map(TaskDefinition.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Get sch * Calls the Spring Cloud Data Flow server to get task schedules the specified {@link TaskSchedule}.
   *
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   * @returns {Observable<Page<TaskSchedule>>}
   */
  getSchedules(params: ListDefaultParams): Observable<Page<TaskSchedule>> {
    params = params || { q: '', page: 0, size: 20, sort: null, order: null };
    let url = TasksService.URL.SCHEDULES;
    if (params.q) {
      url = `${url}/instances/${params.q}`;
    }
    return this.httpClient
      .get<any>(url)
      .pipe(
        map(TaskSchedule.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Get the details of a definition
   *
   * @param {string} scheduleName
   * @returns {Observable<TaskDefinition>}
   */
  getSchedule(scheduleName: string): Observable<TaskSchedule> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`${TasksService.URL.SCHEDULES}/${scheduleName}`, { headers: headers })
      .pipe(
        map(TaskSchedule.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Create Schedules
   *
   * @param {TaskScheduleCreateParams[]} taskScheduleCreateParams
   * @returns {Observable<Response[]>}
   */
  createSchedules(taskScheduleCreateParams: TaskScheduleCreateParams[]): Observable<Response[]> {
    return forkJoin(taskScheduleCreateParams.map(schedule => this.createSchedule(schedule)));
  }

  /**
   * Create Schedule
   * @param {TaskScheduleCreateParams} taskScheduleCreateParams
   * @returns {Observable<any>}
   */
  createSchedule(taskScheduleCreateParams: TaskScheduleCreateParams): Observable<any> {
    this.loggerService.log('Create schedule ' + taskScheduleCreateParams.schedulerName, taskScheduleCreateParams);

    // scheduler.cron.expression
    const props = ['scheduler.cron.expression=' + taskScheduleCreateParams.cronExpression];
    props.push(...taskScheduleCreateParams.props.split(','));

    const params = new HttpParams()
      .append('scheduleName', taskScheduleCreateParams.schedulerName)
      .append('taskDefinitionName', taskScheduleCreateParams.task)
      .append('arguments', taskScheduleCreateParams.args)
      .append('properties', props.filter((prop) => !!prop).join(','));

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(TasksService.URL.SCHEDULES, {}, { headers: headers, params: params })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Create a definition
   *
   * @returns {any}
   * @param {TaskCreateParams} taskCreateParams
   */
  createDefinition(taskCreateParams: TaskCreateParams) {
    this.loggerService.log('Create task definition ' + taskCreateParams.definition + ' ' + taskCreateParams.name);
    const params = new HttpParams({ encoder: new DataflowEncoder() })
      .append('definition', taskCreateParams.definition)
      .append('name', taskCreateParams.name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(TasksService.URL.DEFINITIONS, {}, { headers: headers, params: params })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Destroy a definition
   *
   * @param {TaskDefinition} taskDefinition
   * @returns {Observable<Response>}
   */
  destroyDefinition(taskDefinition: TaskDefinition): Observable<HttpResponse<any>> {
    this.loggerService.log('Destroying...', taskDefinition.name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .delete(TasksService.URL.DEFINITIONS + '/' + taskDefinition.name, { headers: headers, observe: 'response' })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Destroy definitions
   *
   * @param {TaskDefinition[]} taskDefinitions
   * @returns {Observable<Response[]>}
   */
  destroyDefinitions(taskDefinitions: TaskDefinition[]): Observable<HttpResponse<any>[]> {
    return forkJoin(taskDefinitions.map(task => this.destroyDefinition(task)));
  }

  /**
   * Destroy a schedule
   *
   * @param {TaskSchedule} taskSchedules
   * @returns {Observable<Response>}
   */
  destroySchedule(taskSchedules: TaskSchedule): Observable<HttpResponse<any>> {
    this.loggerService.log('Destroying...', taskSchedules.name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .delete(TasksService.URL.SCHEDULES + '/' + taskSchedules.name, { headers: headers, observe: 'response' })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Destroy Schedules
   *
   * @param {TaskSchedule[]} taskSchedules
   * @returns {Observable<Response[]>}
   */
  destroySchedules(taskSchedules: TaskSchedule[]): Observable<HttpResponse<any>[]> {
    return forkJoin(taskSchedules.map(schedule => this.destroySchedule(schedule)));
  }

  /**
   * Get Platforms
   */
  getPlatforms() {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>(TasksService.URL.PLATFORM, { params: params, headers: httpHeaders })
      .pipe(
        map(PlatformTask.listFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Launch a task
   *
   * @returns {any}
   * @param {TaskLaunchParams} taskLaunchParams
   */
  launchDefinition(taskLaunchParams: TaskLaunchParams) {
    let params = new HttpParams()
      .append('name', taskLaunchParams.name);
    if (taskLaunchParams.args) {
      params = params.append('arguments', taskLaunchParams.args);
    }
    if (taskLaunchParams.props) {
      params = params.append('properties', taskLaunchParams.props);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(TasksService.URL.EXECUTIONS, {}, { headers: headers, params: params })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }

}
