import { Observable } from 'rxjs';
import { Page } from '../../shared/model';
import { of } from 'rxjs';
import { RuntimeStream } from '../../runtime/model/runtime-stream';

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

  public testRuntimeStreams: any;

  public getRuntimeStreams(args): Observable<Page<RuntimeStream>> {
    return of(RuntimeStream.pageFromJSON(this.testRuntimeStreams));
  }
}
