import { Observable } from 'rxjs';
import { Page } from '../../shared/model/page';
import { RuntimeApp } from '../../runtime/model/runtime-app';
import { of } from 'rxjs';

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
    return of(RuntimeApp.pageFromJSON(this.testRuntimeApps));
  }
}
