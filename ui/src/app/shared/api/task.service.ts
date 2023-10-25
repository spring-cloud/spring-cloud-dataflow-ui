import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Task, TaskPage} from '../model/task.model';
import {HttpUtils} from '../support/http.utils';
import {LaunchResponse, TaskExecution, TaskExecutionPage} from '../model/task-execution.model';
import {Platform, PlatformTaskList} from '../model/platform.model';
import {ErrorUtils} from '../support/error.utils';
import {DataflowEncoder} from '../support/encoder.utils';
import {
  ValuedConfigurationMetadataProperty,
  ValuedConfigurationMetadataPropertyList
} from '../model/detailed-app.model';
import {UrlUtilities} from '../../url-utilities.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(protected httpClient: HttpClient) {}

  getTasks(
    page: number,
    size: number,
    taskName?: string,
    description?: string,
    dslText?: string,
    sort?: string,
    order?: string
  ): Observable<TaskPage | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = HttpUtils.getPaginationParams(page, size);
    if (taskName) {
      params = params.append('taskName', taskName);
    }
    if (description) {
      params = params.append('description', description);
    }
    if (dslText) {
      params = params.append('dslText', dslText);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'tasks/definitions', {headers, params})
      .pipe(map(TaskPage.parse), catchError(ErrorUtils.catchError));
  }

  getTask(name: string, manifest = false): Observable<Task | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `tasks/definitions/${name}?manifest=${manifest}`, {headers})
      .pipe(map(Task.parse), catchError(ErrorUtils.catchError));
  }

  createTask(name: string, definition: string, description: string): Observable<any> {
    const params = new HttpParams({encoder: new DataflowEncoder()})
      .append('definition', definition)
      .append('name', name)
      .append('description', description);
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post(UrlUtilities.calculateBaseApiUrl() + 'tasks/definitions', {}, {headers, params})
      .pipe(catchError(ErrorUtils.catchError));
  }

  destroyTask(task: Task): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete(UrlUtilities.calculateBaseApiUrl() + 'tasks/definitions/' + task.name, {headers, observe: 'response'})
      .pipe(catchError(ErrorUtils.catchError));
  }

  destroyTasks(tasks: Task[]): Observable<any[]> {
    return forkJoin(tasks.map(task => this.destroyTask(task)));
  }

  launch(taskName: string, args: string, props: string): Observable<LaunchResponse | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams({encoder: new DataflowEncoder()}).append('name', taskName);
    if (args) {
      params = params.append('arguments', args);
    }
    if (props) {
      params = params.append('properties', props);
    }
    return this.httpClient
      .post<LaunchResponse>(UrlUtilities.calculateBaseApiUrl() + 'tasks/executions/launch', {}, {headers, params})
      .pipe(map(LaunchResponse.parse), catchError(ErrorUtils.catchError));
  }

  executionStop(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams({encoder: new DataflowEncoder()}).append('schemaTarget', taskExecution?.schemaTarget);
    return this.httpClient
      .post<any>(
        UrlUtilities.calculateBaseApiUrl() + `tasks/executions/${taskExecution.executionId}`,
        {},
        {headers, params}
      )
      .pipe(catchError(ErrorUtils.catchError));
  }

  executionClean(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams({encoder: new DataflowEncoder()}).append('schemaTarget', taskExecution.schemaTarget);
    const url = UrlUtilities.calculateBaseApiUrl() + `tasks/executions/${taskExecution.executionId}?action=REMOVE_DATA`;
    return this.httpClient
      .delete<any>(url, {
        headers,
        params,
        observe: 'response'
      })
      .pipe(catchError(ErrorUtils.catchError));
  }

  executionsClean(taskExecutions: TaskExecution[]): Observable<any> {
    return new Observable<any>(subscriber => {
      this.executionsCleanAll(taskExecutions)
        .then(value => {
          subscriber.next(taskExecutions.length);
          subscriber.complete();
        })
        .catch(reason => {
          subscriber.error(reason);
        });
    });
  }

  private async executionsCleanAll(taskExecutions: TaskExecution[]): Promise<void> {
    const taskExecutionsChildren = taskExecutions.filter(taskExecution => taskExecution.parentExecutionId);
    const taskExecutionsParents = taskExecutions.filter(taskExecution => !taskExecution.parentExecutionId);
    if (taskExecutionsChildren.length > 0) {
      await this.executionsCleanBySchema(taskExecutionsChildren);
    }
    if (taskExecutionsParents.length > 0) {
      await this.executionsCleanBySchema(taskExecutionsParents);
    }
    return Promise.resolve();
  }

  private async executionsCleanBySchema(taskExecutions: TaskExecution[]): Promise<void> {
    const groupBySchemaTarget = taskExecutions.reduce((group, task) => {
      const schemaTarget = task.schemaTarget;
      group[schemaTarget] = group[schemaTarget] ?? [];
      group[schemaTarget].push(task);
      return group;
    }, {});
    for (const schemaTarget in groupBySchemaTarget) {
      if (schemaTarget) {
        const group: TaskExecution[] = groupBySchemaTarget[schemaTarget];
        const ids = group.map(task => task.executionId);
        if (ids.length > 0) {
          await this.taskExecutionsCleanByIds(ids, schemaTarget).toPromise();
        }
      }
    }
    return Promise.resolve();
  }

  taskExecutionsCleanByIds(ids: number[], schemaTarget: string): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const idStr = ids.join(',');
    const url =
      UrlUtilities.calculateBaseApiUrl() +
      `tasks/executions/${idStr}?action=CLEANUP,REMOVE_DATA&schemaTarget=${schemaTarget}`;
    return this.httpClient.delete<any>(url, {headers, observe: 'response'}).pipe(catchError(ErrorUtils.catchError));
  }

  taskExecutionsClean(task: Task, completed: boolean, days: number): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const paramCompleted = completed ? '&completed=true' : '';
    const paramDays = days != null ? '&days=' + days : '';
    const paramTask = task ? `&name=${task.name}` : '';
    const url =
      UrlUtilities.calculateBaseApiUrl() +
      `tasks/executions?action=CLEANUP,REMOVE_DATA${paramCompleted}${paramTask}${paramDays}`;
    return this.httpClient.delete<any>(url, {headers, observe: 'response'}).pipe(catchError(ErrorUtils.catchError));
  }

  getTaskExecutionsCount(task?: Task, days?: number): Observable<{completed: number; all: number} | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let url = UrlUtilities.calculateBaseApiUrl() + 'tasks/info/executions?p=v';

    url += task != null ? '&name=' + task.name : '';
    url += days != null ? '&days=' + days : '';

    return this.httpClient.get<any>(url, {headers}).pipe(
      mergeMap(data =>
        this.httpClient.get<any>(url + '&completed=true', {headers}).pipe(
          map(data2 => ({
            completed: +data2.totalExecutions,
            all: +data.totalExecutions
          }))
        )
      ),
      catchError(ErrorUtils.catchError)
    );
  }

  getExecutions(
    page: number,
    size: number,
    taskName?: string,
    sort?: string,
    order?: string
  ): Observable<TaskExecutionPage | unknown> {
    let params = HttpUtils.getPaginationParams(page, size);
    const headers = HttpUtils.getDefaultHttpHeaders();
    if (taskName) {
      params = params.append('name', taskName);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'tasks/executions', {headers, params})
      .pipe(map(TaskExecutionPage.parse), catchError(ErrorUtils.catchError));
  }

  getExecutionByExternalId(externalExecutionId: string, platform: string = null): Observable<TaskExecution | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams({encoder: new DataflowEncoder()}).append('platform', platform);
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `tasks/executions/external/${externalExecutionId}`, {
        headers,
        params
      })
      .pipe(map(TaskExecution.parse), catchError(ErrorUtils.catchError));
  }

  getExecutionById(executionId: number, schemaTarget: string): Observable<TaskExecution | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams({encoder: new DataflowEncoder()}).set('schemaTarget', schemaTarget ?? 'boot2');
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + `tasks/executions/${executionId ?? 0}`, {
        headers: headers,
        params: params
      })
      .pipe(map(TaskExecution.parse), catchError(ErrorUtils.catchError));
  }

  getExecution(taskExecution: TaskExecution): Observable<TaskExecution | unknown> {
    return this.getExecutionById(taskExecution.executionId, taskExecution.schemaTarget);
  }

  getExecutionLogs(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let platformName = 'default';
    if (taskExecution.arguments) {
      taskExecution.arguments.forEach(arg => {
        const split = arg.split('=');
        if (split[0] === '--spring.cloud.data.flow.platformname' || split[0] === '--platform-name') {
          platformName = split[1];
        }
      });
    }
    const url =
      taskExecution?._links && taskExecution?._links['tasks/logs'] !== undefined
        ? taskExecution?._links['tasks/logs'].href
        : UrlUtilities.calculateBaseApiUrl() +
          `tasks/logs/${taskExecution.externalExecutionId}?platformName=${platformName}&schemaTarget=${taskExecution.schemaTarget}`;
    const params = new HttpParams({encoder: new DataflowEncoder()});
    return this.httpClient
      .get<any>(url, {
        headers,
        params
      })
      .pipe(catchError(ErrorUtils.catchError));
  }

  getPlatforms(): Observable<Platform[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>(UrlUtilities.calculateBaseApiUrl() + 'tasks/platforms', {params, headers})
      .pipe(map(PlatformTaskList.parse), catchError(ErrorUtils.catchError));
  }

  getCtrOptions(): Observable<ValuedConfigurationMetadataProperty[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const url = UrlUtilities.calculateBaseApiUrl() + 'tasks/ctr/options';
    return this.httpClient
      .get<any>(url, {headers})
      .pipe(map(ValuedConfigurationMetadataPropertyList.parse), catchError(ErrorUtils.catchError));
  }
}
