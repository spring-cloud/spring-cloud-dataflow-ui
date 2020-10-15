import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task, TaskPage } from '../model/task.model';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpUtils } from '../support/http.utils';
import { catchError, delay, map } from 'rxjs/operators';
import { TaskExecution, TaskExecutionPage } from '../model/task-execution.model';
import { Platform, PlatformTaskList } from '../model/platform.model';
import { ErrorUtils } from '../support/error.utils';
import { DataflowEncoder } from '../support/encoder.utils';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(protected httpClient: HttpClient) {
  }

  getTasks(page: number, size: number, search?: string, sort?: string, order?: string): Observable<TaskPage> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = HttpUtils.getPaginationParams(page, size);
    if (search) {
      params = params.append('search', search);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>('/tasks/definitions', { headers, params })
      .pipe(
        map(TaskPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getTask(name: string, manifest = false): Observable<Task> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/tasks/definitions/${name}?manifest=${manifest}`, { headers })
      .pipe(
        map(Task.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  createTask(name: string, definition: string, description: string): Observable<any> {
    const params = new HttpParams({ encoder: new DataflowEncoder() })
      .append('definition', definition)
      .append('name', name)
      .append('description', description);
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post('/tasks/definitions', {}, { headers, params })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  destroyTask(task: Task): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete('/tasks/definitions/' + task.name, { headers, observe: 'response' })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  destroyTasks(tasks: Task[]): Observable<any[]> {
    return forkJoin(tasks.map(task => this.destroyTask(task)));
  }

  launch(taskName: string, args: string, props: string): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let params = new HttpParams().append('name', taskName);
    if (args) {
      params = params.append('arguments', args);
    }
    if (props) {
      params = params.append('properties', props);
    }
    return this.httpClient
      .post('/tasks/executions', {}, { headers, params })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  executionStop(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post<any>(`/tasks/executions/${taskExecution.executionId}`, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  executionClean(taskExecution: TaskExecution): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .delete<any>(`/tasks/executions/${taskExecution.executionId}?action=REMOVE_DATA`, {
        headers,
        observe: 'response'
      })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  executionsClean(taskExecutions: TaskExecution[]): Observable<any> {
    return forkJoin(taskExecutions.map(execution => this.executionClean(execution)));
  }

  getExecutions(page: number, size: number, taskName?: string, sort?: string, order?: string): Observable<TaskExecutionPage> {
    let params = HttpUtils.getPaginationParams(page, size);
    const headers = HttpUtils.getDefaultHttpHeaders();
    if (taskName) {
      params = params.append('name', taskName);
    }
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    return this.httpClient
      .get<any>('/tasks/executions', { headers, params })
      .pipe(
        map(TaskExecutionPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getExecution(executionId: string): Observable<TaskExecution> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>(`/tasks/executions/${executionId}`, { headers })
      .pipe(
        map(TaskExecution.parse),
        catchError(ErrorUtils.catchError)
      );
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
      .get<any>(`/tasks/logs/${taskExecution.externalExecutionId}${platform}`, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  getPlatforms(): Observable<Platform[]> {
    // return of([
    //   Platform.parse({ name: 'foo', type: 'foo' }),
    //   Platform.parse({ name: 'bar', type: 'bar' }),
    // ])
    //   .pipe(
    //     delay(1000),
    //   );
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = HttpUtils.getPaginationParams(0, 1000);
    return this.httpClient
      .get<any>('/tasks/platforms', { params, headers })
      .pipe(
        map(PlatformTaskList.parse),
        catchError(ErrorUtils.catchError)
      );
  }

}
