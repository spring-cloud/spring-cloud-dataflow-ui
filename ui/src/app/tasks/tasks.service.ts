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
import { HttpUtils } from '../shared/support/http.utils';
import { map } from 'rxjs/operators';
import { LoggerService } from '../shared/services/logger.service';
import { TaskSchedule } from './model/task-schedule';
import {
  TaskCreateParams, TaskLaunchParams, TaskListParams, TaskScheduleCreateParams,
  TaskScheduleListParams
} from './components/tasks.interface';

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

  static MOCK_SCHEDULES = {
    '_embedded': {
      'scheduleInfoResourceList': [{
        'scheduleName': 'FOO',
        'taskDefinitionName': 'task1',
        'scheduleProperties': {
          'spring.cloud.scheduler.cron.expression': '00 41 17 ? * *'
        },
        '_links': {
          'self': {
            'href': 'http://localhost:9393/tasks/schedules/FOO'
          }
        }
      }, {
        'scheduleName': 'BAR',
        'taskDefinitionName': 'task1',
        'scheduleProperties': {
          'spring.cloud.scheduler.cron.expression': '00 10 * ? * *'
        },
        '_links': {
          'self': {
            'href': 'http://localhost:9393/tasks/schedules/BAR'
          }
        }
      }]
    },
    '_links': {
      'self': {
        'href': 'http://localhost:9393/tasks/schedules?page=0&size=10'
      }
    },
    'page': {
      'size': 10,
      'totalElements': 2,
      'totalPages': 1,
      'number': 0
    }
  };

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
    task: '',
    page: 0,
    size: 30,
    sort: 'SCHEDULE_NAME',
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
   * Calls the Spring Cloud Data Flow server to get paged task executions specified in {@link TaskExecution}
   * for a task.
   *
   * @param {TaskScheduleListParams} taskScheduleListParams
   * @returns {Observable<Page<TaskExecution>>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getTaskExecutions(taskScheduleListParams: TaskScheduleListParams): Observable<Page<TaskExecution>> {
    taskScheduleListParams = taskScheduleListParams || { task: '', page: 0, size: 20, sort: null, order: null };
    const params = HttpUtils.getPaginationParams(taskScheduleListParams.page, taskScheduleListParams.size);
    if (taskScheduleListParams.task) {
      params.append('name', taskScheduleListParams.task);
    }
    if (taskScheduleListParams.sort && taskScheduleListParams.order) {
      params.append('sort', `${taskScheduleListParams.sort},${taskScheduleListParams.order}`);
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
   * Get sch * Calls the Spring Cloud Data Flow server to get task schedules the specified {@link TaskSchedule}.
   *
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   * @returns {Observable<Page<TaskSchedule>>}
   */
  getSchedules(taskScheduleListParams: TaskScheduleListParams): Observable<Page<TaskSchedule>> {
    taskScheduleListParams = taskScheduleListParams || { task: '', page: 0, size: 20, sort: null, order: null };
    const params = HttpUtils.getPaginationParams(taskScheduleListParams.page, taskScheduleListParams.size);
    let url = TasksService.URL.SCHEDULES;
    if (taskScheduleListParams.task) {
      // params.append('search', taskScheduleListParams.task);
      url = `${url}/instances/${taskScheduleListParams.task}`;
    }
    return this.http.get(url)
      .pipe(map((res) => {
        const page = new Page<TaskSchedule>();
        const body = res.json();
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
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${TasksService.URL.SCHEDULES}/${scheduleName}`, options)
      .pipe(map(res => res.json()))
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
    const params = new URLSearchParams();

    // scheduler.cron.expression
    const props = ['scheduler.cron.expression=' + taskScheduleCreateParams.cronExpression];
    props.push(...taskScheduleCreateParams.props.split(','));

    console.log(props);

    params.append('scheduleName', taskScheduleCreateParams.schedulerName);
    params.append('taskDefinitionName', taskScheduleCreateParams.task);
    params.append('arguments', taskScheduleCreateParams.args);
    params.append('properties', props.filter((prop) => !!prop).join(','));

    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers, params: params });
    return this.http.post(TasksService.URL.SCHEDULES, {}, options)
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
   * Destroy a schedule
   *
   * @param {TaskSchedule} taskSchedules
   * @returns {Observable<Response>}
   */
  destroySchedule(taskSchedules: TaskSchedule): Observable<Response> {
    this.loggerService.log('Destroying...', taskSchedules.name);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(TasksService.URL.SCHEDULES + '/' + taskSchedules.name, options)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Destroy Schedules
   *
   * @param {TaskSchedule[]} taskSchedules
   * @returns {Observable<Response[]>}
   */
  destroySchedules(taskSchedules: TaskSchedule[]): Observable<Response[]> {
    const observables: Observable<Response>[] = [];
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
