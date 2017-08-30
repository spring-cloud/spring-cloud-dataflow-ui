import { Observable } from 'rxjs/Observable';
import { AppInfo } from '../../tasks/model/app-info';
import { Page} from '../../shared/model/page';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { TaskExecution } from '../../tasks/model/task-execution';

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

  private _testAppInfos: {};
  private _testTaskAppRegistrations: AppRegistration[];
  private _testExecutionDetails: {};

  get testAppInfos() {
    return this._testAppInfos;
  }

  set testAppInfos(params: any) {
    this._testAppInfos = params;
  }

  get testTaskAppRegistrations() {
    return this._testTaskAppRegistrations;
  }

  set testTaskAppRegistrations(params: any) {
    this._testTaskAppRegistrations = params;
  }

  get testExecutionDetails() {
    return this._testExecutionDetails;
  }

  set testExecutionDetails(params: any) {
    this._testExecutionDetails = params;
  }

  getAppInfo(id: string): Observable<AppInfo> {
    const appInfo = new AppInfo();
    appInfo.name = this.testAppInfos[id].name;
    // TODO: polish related pojos for not need for this check
    if (this.testAppInfos[id].options) {
      appInfo.options = this.testAppInfos[id].options;
    }
    return Observable.of(appInfo);
  }

  getTaskAppRegistrations(): Observable<Page<AppRegistration>> {
    const p = new Page<AppRegistration>();
    this._testTaskAppRegistrations.forEach( r => {
      p.items.push(new AppRegistration(r.name, r.type, r.uri));
    });
    return Observable.of(p);
  }

  createDefinition(definition: string, name: string) {
    // TODO: when needed in tests return something useful
    return Observable.of({});
  }

  getExecution(id: string): Observable<TaskExecution> {
    return Observable.of(this.testExecutionDetails[id]);
  }
}
