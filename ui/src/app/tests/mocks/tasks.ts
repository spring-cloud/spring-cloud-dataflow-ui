import { Observable, of } from 'rxjs';
import { Page } from '../../shared/model/page';
import { TaskExecution } from '../../tasks/model/task-execution';
import { TaskDefinition } from '../../tasks/model/task-definition';
import { ListDefaultParams, OrderParams } from '../../shared/components/shared.interface';
import { TaskSchedule } from '../../tasks/model/task-schedule';
import { TaskLaunchParams, TaskListParams } from '../../tasks/components/tasks.interface';
import { Platform } from '../../shared/model/platform';

/**
 * Mock for TasksService.
 *
 * Create a mocked service:
 * const tasksService = new MockTasksService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: TasksService, useValue: tasksService }
 *   ]
 * }).compileComponents();
 *
 * Set app infos:
 * tasksService.testAppInfos = { faketask: {name: 'fakename'}};
 *
 * Set app registrations:
 * tasksService.testTaskAppRegistrations = [
 *   new AppRegistration('fakename', ApplicationType.task, 'fakeuri')
 * ];
 *
 * @author Janne Valkealahti
 */
export class MockTasksService {

  public tasksContext = {
    q: '',
    page: 0,
    size: 20,
    sort: 'taskName',
    order: OrderParams.ASC,
    itemsSelected: [],
    itemsExpanded: []
  };

  public executionsContext = {
    q: '',
    page: 0,
    size: 10,
    sort: 'TASK_EXECUTION_ID',
    order: OrderParams.DESC,
    itemsSelected: [],
    itemsExpanded: []
  };

  public schedulesContext = {
    q: '',
    page: 0,
    size: 30,
    sort: 'SCHEDULE_NAME',
    order: OrderParams.DESC,
    itemsSelected: []
  };

  public testExecutionDetails: {};

  public taskDefinitions;

  public taskSchedules;

  public taskExecutions;

  createDefinition(definition: string, name: string) {
    return of({});
  }

  getExecution(id: string): Observable<TaskExecution> {
    return of(this.testExecutionDetails[id]);
  }

  destroyDefinitions(taskDefinitions: TaskDefinition[]): Observable<Response> | Observable<any> {
    return of(Array.from({ length: taskDefinitions.length }));
  }

  getExecutions(): Observable<Page<TaskExecution>> {
    return of(TaskExecution.pageFromJSON(this.taskExecutions));
  }

  getDefinitions(): Observable<Page<TaskDefinition>> {
    return of(TaskDefinition.pageFromJSON(this.taskDefinitions));
  }

  getSchedules(taskListParams: TaskListParams): Observable<Page<TaskSchedule>> {
    return of(TaskSchedule.pageFromJSON(this.taskSchedules));
  }

  getSchedule(scheduleName: string): Observable<TaskSchedule> {
    return of(TaskSchedule.fromJSON(this.taskSchedules._embedded.scheduleInfoResourceList[0]));
  }

  getDefinition(name: string): Observable<any> {
    return of(TaskDefinition.fromJSON(this.taskDefinitions._embedded.taskDefinitionResourceList[0]));
  }

  destroySchedules(taskSchedules: TaskSchedule[]): Observable<any> {
    return of(Array.from({ length: taskSchedules.length }));
  }

  getTaskExecutions(taskScheduleListParams: ListDefaultParams): Observable<Page<TaskExecution>> {
    return this.getExecutions();
  }

  createSchedules() {
    return of([{}]);
  }

  getPlatforms(): Observable<Platform[]> {
    return of([
      Platform.fromJSON({name: 'default', type: 'local', description: ''}),
      Platform.fromJSON({name: 'foo', type: 'bar', description: 'foobar'})
    ]);
  }

  launchDefinition(taskLaunchParams: TaskLaunchParams): Observable<any> {
    return of({});
  }

}
