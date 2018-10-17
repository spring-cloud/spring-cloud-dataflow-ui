import { Observable } from 'rxjs/Observable';
import { Page } from '../../shared/model/page';
import { RuntimeApp } from '../../runtime/model/runtime-app';

/**
 * Mock for RuntimeAppsService.
 *
 * Create a mocked service:
 * const runtimeAppsService = new MockRuntimeAppsService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: RuntimeAppsService, useValue: runtimeAppsService }
 *   ]
 * }).compileComponents();
 *
 * Set runtime app infos:
 * runtimeAppsService._testRuntimeApps = RUNTIME_APPS;//Runtime Apps json
 *
 * @author Janne Valkealahti
 */
export class MockRuntimeAppsService {

  public testRuntimeApps: any;

  public getRuntimeApps(): Observable<Page<RuntimeApp>> {
    return Observable.of(RuntimeApp.pageFromJSON(this.testRuntimeApps));
  }
}
