import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorHandler } from '../shared/model/error-handler';
import { Page } from '../shared/model/page';
import { TaskExecution } from './model/task-execution';
import { TaskDefinition } from './model/task-definition';
import { ListDefaultParams, OrderParams } from '../shared/components/shared.interface';
import { HttpUtils } from '../shared/support/http.utils';
import { map } from 'rxjs/operators';
import { LoggerService } from '../shared/services/logger.service';
import { TaskSchedule } from './model/task-schedule';
import {
  TaskCreateParams, TaskLaunchParams, TaskListParams, TaskScheduleCreateParams
} from './components/tasks.interface';
import { HttpResponse } from '@angular/common/http';

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
    SCHEDULES: '/tasks/schedules'
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
    return this.httpClient.get<any>(TasksService.URL.EXECUTIONS, { params: params })
      .pipe(map((body) => {
        const taskExecutions = new Page<TaskExecution>();
        if (body._embedded && body._embedded.taskExecutionResourceList) {
          taskExecutions.items = body._embedded.taskExecutionResourceList.map(TaskExecution.fromJSON);
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
    return this.httpClient.get<any>(TasksService.URL.EXECUTIONS, { params: params })
      .pipe(map((body) => {
        const taskExecutions = new Page<TaskExecution>();
        if (body._embedded && body._embedded.taskExecutionResourceList) {
          taskExecutions.items = body._embedded.taskExecutionResourceList.map(TaskExecution.fromJSON);
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
    return this.httpClient.get<any>(TasksService.URL.EXECUTIONS + '/' + id, {})
      .pipe(map(TaskExecution.fromJSON))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Get the details of a definition
   *
   * @param {string} taskname
   * @returns {Observable<TaskDefinition>}
   */
  getDefinition(taskname: string): Observable<TaskDefinition> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`${TasksService.URL.DEFINITIONS}/${taskname}`, { headers: headers })
      .map(TaskDefinition.fromJSON)
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
    let params = HttpUtils.getPaginationParams(taskListParams.page, taskListParams.size);
    if (taskListParams.q) {
      params = params.append('search', taskListParams.q);
    }
    if (taskListParams.sort && taskListParams.order) {
      params = params.append('sort', `${taskListParams.sort},${taskListParams.order}`);
    }
    return this.httpClient.get<any>(TasksService.URL.DEFINITIONS, { params: params })
      .pipe(map((body) => {
        const taskDefinitions = new Page<TaskDefinition>();
        if (body._embedded && body._embedded.taskDefinitionResourceList) {
          taskDefinitions.items = body._embedded.taskDefinitionResourceList.map(TaskDefinition.fromJSON);
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
    return this.httpClient.get<any>(url)
      .pipe(map((body) => {
        const page = new Page<TaskSchedule>();
        if (body._embedded && body._embedded.scheduleInfoResourceList) {
          page.items = body._embedded.scheduleInfoResourceList.map(TaskSchedule.fromJSON);
        }
        if (body.page) {
          page.pageNumber = body.page.number;
          page.pageSize = body.page.size;
          page.totalElements = body.page.totalElements;
          page.totalPages = body.page.totalPages;
        }
        this.loggerService.log('Extracted Task Schedules:', page);
        return page;
      })).catch(this.errorHandler.handleError);
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
      .pipe(map(TaskSchedule.fromJSON))
      .catch(this.errorHandler.handleError);
  }

  /**
   * Create Schedules
   *
   * @param {TaskScheduleCreateParams[]} taskScheduleCreateParams
   * @returns {Observable<Response[]>}
   */
  createSchedules(taskScheduleCreateParams: TaskScheduleCreateParams[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
    for (const params of taskScheduleCreateParams) {
      observables.push(this.createSchedule(params));
    }
    return Observable.forkJoin(observables);
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
    const options = { headers: headers, params: params };
    return this.httpClient.post(TasksService.URL.SCHEDULES, {}, options)
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
    const params = new HttpParams()
      .append('definition', taskCreateParams.definition)
      .append('name', taskCreateParams.name);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, params: params };
    return this.httpClient.post(TasksService.URL.DEFINITIONS, {}, options)
      .catch(this.errorHandler.handleError);
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

    return this.httpClient.delete(TasksService.URL.DEFINITIONS + '/' + taskDefinition.name, {
      headers: headers,
      observe: 'response'
    }).catch(this.errorHandler.handleError);
  }

  /**
   * Destroy definitions
   *
   * @param {TaskDefinition[]} taskDefinitions
   * @returns {Observable<Response[]>}
   */
  destroyDefinitions(taskDefinitions: TaskDefinition[]): Observable<HttpResponse<any>[]> {
    const observables: Observable<HttpResponse<any>>[] = [];
    for (const taskDefinition of taskDefinitions) {
      observables.push(this.destroyDefinition(taskDefinition));
    }
    return Observable.forkJoin(observables);
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
    return this.httpClient.delete(TasksService.URL.SCHEDULES + '/' + taskSchedules.name, {
      headers: headers,
      observe: 'response'
    })
      .catch(this.errorHandler.handleError);
  }

  /**
   * Destroy Schedules
   *
   * @param {TaskSchedule[]} taskSchedules
   * @returns {Observable<Response[]>}
   */
  destroySchedules(taskSchedules: TaskSchedule[]): Observable<HttpResponse<any>[]> {
    const observables: Observable<HttpResponse<any>>[] = [];
    for (const taskSchedule of taskSchedules) {
      observables.push(this.destroySchedule(taskSchedule));
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
    let params = new HttpParams()
      .append('name', taskLaunchParams.name);
    if (taskLaunchParams.args) {
      params = params.append('arguments', taskLaunchParams.args);
    }
    if (taskLaunchParams.props) {
      params = params.append('properties', taskLaunchParams.props);
    }
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const options = { headers: headers, params: params };
    return this.httpClient.post(TasksService.URL.EXECUTIONS, {}, options)
      .catch(this.errorHandler.handleError);
  }

}
