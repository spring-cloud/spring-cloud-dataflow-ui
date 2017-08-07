import { Observable } from 'rxjs/Observable';
import { AppInfo } from '../../tasks/model/app-info';
import { Page} from '../../shared/model/page';
import { AppRegistration } from '../../shared/model/app-registration';

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

  getAppInfo(id: string): Observable<AppInfo> {
    const appInfo = new AppInfo();
    appInfo.name = this.testAppInfos[id].name;
    return Observable.of(appInfo);
  }

  getTaskAppRegistrations(): Observable<Page<AppRegistration>> {
    const p = new Page<AppRegistration>();
    this._testTaskAppRegistrations.forEach( r => {
      p.items.push(new AppRegistration(r.name, r.type, r.uri));
    });
    return Observable.of(p);
  }
}
