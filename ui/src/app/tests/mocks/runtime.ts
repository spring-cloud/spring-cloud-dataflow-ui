import { Observable } from 'rxjs/Observable';
import { PageInfo } from '../../shared/model/pageInfo';
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

  private _testRuntimeApps: any;

  get testRuntimeApps() {
    return this._testRuntimeApps;
  }

  set testRuntimeApps(params: any) {
    this._testRuntimeApps = params;
  }

  public getRuntimeApps(pageInfo: PageInfo): Observable<Page<RuntimeApp>> {
    const page = new Page<RuntimeApp>();
    if (this.testRuntimeApps) {
      const response = this.testRuntimeApps;
      let items: RuntimeApp[];
      if (response._embedded && response._embedded.appStatusResourceList) {
        items = response._embedded.appStatusResourceList as RuntimeApp[];
        for (const item of items) {
          item.appInstances = item.instances._embedded.appInstanceStatusResourceList;
        }
      } else {
        items = [];
      }
      page.items = items;
      page.totalElements = response.page.totalElements;
      page.totalPages = response.page.totalPages;
      page.pageNumber = response.page.number;
      page.pageSize = response.page.size;
    }
    return Observable.of(page);
  }
}
