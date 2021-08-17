import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Task, TaskPage} from '../model/task.model';
import {HttpUtils} from '../support/http.utils';
import {TaskExecution, TaskExecutionPage} from '../model/task-execution.model';
import {Platform, PlatformTaskList} from '../model/platform.model';
import {ErrorUtils} from '../support/error.utils';
import {DataflowEncoder} from '../support/encoder.utils';
import {
  ValuedConfigurationMetadataProperty,
  ValuedConfigurationMetadataPropertyList
} from '../model/detailed-app.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(protected httpClient: HttpClient) {}

  getTasks(page: number, size: number, search?: string, sort?: string, order?: string): Observable<TaskPage | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = HttpUtils.getPaginationParams(page, size);
    if (search) {
      params = params.append('search', search);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>('/tasks/definitions', {headers, params})
      .pipe(map(TaskPage.parse), catchError(ErrorUtils.catchError));
  }

  getTask(name: string, manifest = false): Observable<Task | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/tasks/definitions/${name}?manifest=${manifest}`, {headers})
      .pipe(map(Task.parse), catchError(ErrorUtils.catchError));
  }

  createTask(name: string, definition: string, description: string): Observable<any> {
    const params = new HttpParams({encoder: new DataflowEncoder()})
      .append('definition', definition)
      .append('name', name)
      .append('description', description);
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient.post('/tasks/definitions', {}, {headers, params}).pipe(catchError(ErrorUtils.catchError));
  }

  destroyTask(task: Task): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete('/tasks/definitions/' + task.name, {headers, observe: 'response'})
      .pipe(catchError(ErrorUtils.catchError));
  }

  destroyTasks(tasks: Task[]): Observable<any[]> {
    return forkJoin(tasks.map(task => this.destroyTask(task)));
  }

  launch(taskName: string, args: string, props: string): Observable<number | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams().append('name', taskName);
    if (args) {
      params = params.append('arguments', args);
    }
    if (props) {
      params = params.append('properties', props);
    }
    return this.httpClient.post<string>('/tasks/executions', {}, {headers, params}).pipe(
      map(body => {
        const parsed = parseInt(body, 10);
        if (isNaN(parsed)) {
          // sanity check if we get something unexpected
          throw new Error(`Can't parse ${body} as executionId`);
        }
        return parsed;
      }),
      catchError(ErrorUtils.catchError)
    );
  }

  executionStop(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post<any>(`/tasks/executions/${taskExecution.executionId}`, {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  executionClean(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const url = `/tasks/executions/${taskExecution.executionId}?action=REMOVE_DATA`;
    return this.httpClient.delete<any>(url, {headers, observe: 'response'}).pipe(catchError(ErrorUtils.catchError));
  }

  executionsClean(taskExecutions: TaskExecution[]): Observable<any> {
    return forkJoin(taskExecutions.map(execution => this.executionClean(execution)));
  }

  taskExecutionsClean(task: Task, completed: boolean): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const paramCompleted = completed ? '&completed=true' : '';
    const paramTask = task ? `&name=${task.name}` : '';
    const url = `/tasks/executions?action=CLEANUP,REMOVE_DATA${paramCompleted}${paramTask}`;
    return this.httpClient.delete<any>(url, {headers, observe: 'response'}).pipe(catchError(ErrorUtils.catchError));
  }

  getTaskExecutionsCount(task?: Task): Observable<{completed: number; all: number} | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let url = '/tasks/info/executions';
    let url2 = `${url}?completed=true`;
    if (task) {
      url = `/tasks/info/executions?name=${task.name}`;
      url2 = `${url}&completed=true`;
    }
    return this.httpClient.get<any>(url, {headers}).pipe(
      mergeMap(data =>
        this.httpClient.get<any>(url2, {headers}).pipe(
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
      .get<any>('/tasks/executions', {headers, params})
      .pipe(map(TaskExecutionPage.parse), catchError(ErrorUtils.catchError));
  }

  getExecution(executionId: string): Observable<TaskExecution | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/tasks/executions/${executionId}`, {headers})
      .pipe(map(TaskExecution.parse), catchError(ErrorUtils.catchError));
  }

  getExecutionLogs(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let platform = '';
    if (taskExecution.arguments) {
      taskExecution.arguments.forEach(arg => {
        const split = arg.split('=');
        if (split[0] === '--spring.cloud.data.flow.platformname') {
          platform = `?platformName=${split[1]}`;
        }
      });
    }
    return this.httpClient
      .get<any>(`/tasks/logs/${taskExecution.externalExecutionId}${platform}`, {headers})
      .pipe(catchError(ErrorUtils.catchError));
  }

  getPlatforms(): Observable<Platform[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>('/tasks/platforms', {params, headers})
      .pipe(map(PlatformTaskList.parse), catchError(ErrorUtils.catchError));
  }

  getCtrOptions(): Observable<ValuedConfigurationMetadataProperty[] | unknown> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const url = '/tasks/ctr/options';
    return this.httpClient
      .get<any>(url, {headers})
      .pipe(map(ValuedConfigurationMetadataPropertyList.parse), catchError(ErrorUtils.catchError));
  }
}
