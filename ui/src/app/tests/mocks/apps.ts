import { AppRegistration } from '../../shared/model/app-registration.model';
import { Page } from '../../shared/model/page';
import { ApplicationType } from '../../shared/model/application-type';
import {
  ConfigurationMetadataProperty,
  DetailedAppRegistration
} from '../../shared/model/detailed-app-registration.model';
import { AppListParams, AppRegisterParams, BulkImportParams } from '../../apps/components/apps.interface';
import { AppVersion } from '../../shared/model/app-version';
import { Observable, of } from 'rxjs';

/**
 * Mock for {@link AppsService}.
 *
 * Create a mocked service:
 * const appsService = new MockAppsService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: AppsService, useValue: appsService }
 *   ]
 * }).compileComponents();
 *
 * @author Damien Vitrac
 */
export class MockAppsService {

  applicationsContext = {
    q: '',
    type: null,
    sort: 'name',
    order: 'ASC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  mock: {
    items: Array<any>,
    size: number,
    totalElements: number,
    totalPages: number
  } = {
    items: [],
    size: 20,
    totalElements: 0,
    totalPages: 1
  };

  getApps(params: AppListParams, force?: boolean): Observable<Page<AppRegistration>> {
    const page = new Page<AppRegistration>();
    if (this.mock) {
      let items: AppRegistration[];
      if (this.mock.items && this.mock.items) {
        items = this.mock.items.map((a) => {
          const app = new AppRegistration(a.name, a.type, a.uri);
          if (a.hasOwnProperty('versions')) {
            app.versions = a.versions.map((v) => {
              return new AppVersion(v.version, v.uri, v.defaultVersion);
            });
          }
          if (a.hasOwnProperty('version')) {
            app.version = a.version;
          }
          if (a.hasOwnProperty('defaultVersion')) {
            app.defaultVersion = a.defaultVersion;
          }
          return app;
        });
      } else {
        items = [];
      }
      page.items = items;
      page.totalElements = this.mock.totalElements;
      page.totalPages = this.mock.totalPages;

      page.pageNumber = params.page;

      page.filter = {
        q: params.q,
        type: params.type,
      };
      page.sort = {
        sort: params.sort,
        order: params.order,
      };
    }
    return of(page);
  }

  getAppInfo(appType: ApplicationType, appName: string, appVersion: string = ''): Observable<DetailedAppRegistration> | Observable<any> {
    const item = this.mock.items.find((a) => a.name === appName);
    let version;
    if (appVersion) {
      version = item.versions.find((a) => a.version === appVersion);
    } else {
      version = item.versions.find((a) => a.defaultVersion);
    }
    const detailedAppRegistration = new DetailedAppRegistration(appName, appType, version.uri);
    detailedAppRegistration.options = version.metadata.map(a => new ConfigurationMetadataProperty().deserialize(a));
    return of(detailedAppRegistration);
  }

  bulkImportApps(bulkImportApps: BulkImportParams) {
    return of({});
  }

  unregisterApp(appRegistration: AppRegistration): Observable<Response> | Observable<any> {
    return of({});
  }

  unregisterApps(appRegs: AppRegistration[]): Observable<Response[]> | Observable<any> {
    return of(Array.from({ length: appRegs.length }).map(() => {
      return {};
    }));
  }

  registerApps(appRegs: AppRegisterParams[]): Observable<Response[]> | Observable<any> {
    return of(Array.from({ length: appRegs.length }).map(() => {
      return {};
    }));
  }

  registerApp(appRegistration: AppRegistration): Observable<Response> | Observable<any> {
    return of({});
  }

  unregisterAppVersion(appRegistration: AppRegistration, version: string): Observable<any> {
    return of({});
  }

  getAppVersions(appType: ApplicationType, appName: string): Observable<any> {
    const item = this.mock.items.find((a) => a.name === appName);
    return of(item.versions);
  }

  setAppDefaultVersion(appType: ApplicationType, appName: string, appVersion: string): Observable<any> {
    return of({});
  }

  appsState(): Observable<any> {
    return of({
      streams: 20,
      tasks: 10
    });
  }

}
