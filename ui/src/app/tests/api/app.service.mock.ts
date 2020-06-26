import { App, ApplicationType, AppPage } from '../../shared/model/app.model';
import { Observable, of } from 'rxjs';
import { DetailedApp } from '../../shared/model/detailed-app.model';
import { catchError, delay, map } from 'rxjs/operators';
import { ErrorUtils } from '../../shared/support/error.utils';
import { AppService } from '../../shared/api/app.service';
import get from 'lodash.get';
import { GET_APP, GET_APP_VERSIONS, GET_APPS } from '../data/app';

export class AppServiceMock {

  static mock: any = null;

  getApps(page: number, size: number, search?: string, type?: ApplicationType, sort?: string, order?: string,
          defaultVersion = false): Observable<AppPage> {
    return of(GET_APPS)
      .pipe(
        delay(1),
        map(AppPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getApp(name: string, type: ApplicationType, appVersion?: string): Observable<DetailedApp> {
    return of(GET_APP)
      .pipe(
        delay(1),
        map(DetailedApp.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getAppVersions(name: string, type: ApplicationType): Observable<App[]> {
    return of(GET_APP_VERSIONS)
      .pipe(
        map(AppPage.parse),
        map((app: AppPage): App[] => {
          return get(app, 'items', [])
            .sort((a, b) => a.version < b.version ? -1 : 1);
        })
      );
  }

  unregisterApp(app: App): Observable<any> {
    return of({})
      .pipe(
        delay(1)
      );
  }

  unregisterApps(apps: App[]): Observable<any[]> {
    return of(apps)
      .pipe(
        delay(1)
      );
  }

  defaultVersion(apps: App): Observable<any> {
    return of({});
  }

  importUri(uri: string, force: boolean): Observable<any> {
    return of({});
  }

  importProps(properties: string, force: boolean): Observable<any> {
    return of({});
  }

  registerProp(prop: any): Observable<any> {
    return of({});
  }

  registerProps(props: Array<any>): Observable<any> {
    return of(props);
  }

  static get provider() {
    if (!AppServiceMock.mock) {
      AppServiceMock.mock = new AppServiceMock();
    }
    return { provide: AppService, useValue: AppServiceMock.mock };
  }

}
