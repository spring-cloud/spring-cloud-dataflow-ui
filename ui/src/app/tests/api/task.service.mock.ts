import { TaskService } from '../../shared/api/task.service';
import { Observable, of } from 'rxjs';
import { Task, TaskPage } from '../../shared/model/task.model';
import { TaskExecution, TaskExecutionPage } from '../../shared/model/task-execution.model';
import { Platform, PlatformTaskList } from '../../shared/model/platform.model';
import { GET_EXECUTION, GET_EXECUTIONS, GET_PLATFORMS, GET_TASK, GET_TASKS } from '../data/task';
import { delay, map } from 'rxjs/operators';

export class TaskServiceMock {

  static mock: TaskServiceMock = null;

  getTasks(page: number, size: number, search?: string, sort?: string, order?: string): Observable<TaskPage> {
    return of(GET_TASKS)
      .pipe(
        delay(1),
        map(TaskPage.parse),
      );
  }

  getTask(name: string): Observable<Task> {
    return of(GET_TASK)
      .pipe(
        delay(1),
        map(Task.parse),
      );
  }

  createTask(name: string, definition: string, description: string): Observable<any> {
    return of({});
  }

  destroyTask(task: Task): Observable<any> {
    return of({});
  }

  destroyTasks(tasks: Task[]): Observable<any[]> {
    return of(tasks);
  }

  launch(taskName: string, args: string, props: string): Observable<any> {
    return of({});
  }

  executionStop(taskExecution: TaskExecution): Observable<any> {
    return of({});
  }

  executionClean(taskExecution: TaskExecution): Observable<any> {
    return of({});

  }

  executionsClean(taskExecutions: TaskExecution[]): Observable<any> {
    return of(taskExecutions);
  }

  getExecutions(page: number, size: number, taskName?: string, sort?: string, order?: string): Observable<TaskExecutionPage> {
    return of(GET_EXECUTIONS)
      .pipe(
        delay(1),
        map(TaskExecutionPage.parse),
      );
  }

  getExecution(executionId: string): Observable<TaskExecution> {
    return of(GET_EXECUTION)
      .pipe(
        delay(1),
        map(TaskExecution.parse),
      );
  }

  getExecutionLogs(taskExecution: TaskExecution): Observable<any> {
    return of('log')
      .pipe(
        delay(1)
      );
  }

  getPlatforms(): Observable<Platform[]> {
    return of(GET_PLATFORMS)
      .pipe(
        delay(1),
        map(PlatformTaskList.parse)
      );
  }

  static get provider() {
    if (!TaskServiceMock.mock) {
      TaskServiceMock.mock = new TaskServiceMock();
    }
    return { provide: TaskService, useValue: TaskServiceMock.mock };
  }

}
