import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpUtils } from '../support/http.utils';
import { forkJoin, Observable, throwError } from 'rxjs';
import { App, ApplicationType, AppPage } from '../model/app.model';
import { catchError, map } from 'rxjs/operators';
import { DetailedApp } from '../model/detailed-app.model';
import { ErrorUtils } from '../support/error.utils';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(protected httpClient: HttpClient) {
  }

  getApps(page: number, size: number, search?: string, type?: ApplicationType, sort?: string, order?: string,
          defaultVersion = false): Observable<AppPage> {
    let params = HttpUtils.getPaginationParams(page, size);
    const headers = HttpUtils.getDefaultHttpHeaders();
    if (sort && order) {
      params = params.append('sort', `${sort},${order}`);
    }
    if (search) {
      params = params.append('search', search);
    }
    if (type) {
      params = params.append('type', type.toString());
    }
    if (defaultVersion) {
      params = params.append('defaultVersion', 'true');
    }
    return this.httpClient
      .get('/apps', { headers, params })
      .pipe(
        map(AppPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getApp(name: string, type: ApplicationType, appVersion?: string): Observable<DetailedApp> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let url = `/apps/${type}/${name}`;
    if (appVersion) {
      url = `/apps/${type}/${name}/${appVersion}`;
    }
    return this.httpClient.get(url, { headers })
      .pipe(
        map(DetailedApp.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getAppVersions(name: string, type: ApplicationType): Observable<App[]> {
    return this.getApps(0, 10000, name, type)
      .pipe(
        map((app: AppPage): App[] => {
          return app.items
            .filter((a) => (a.name === name && a.type === type))
            .sort((a, b) => a.version < b.version ? -1 : 1);
        })
      );
  }

  unregisterApp(app: App): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    let url = `/apps/${app.type}/${app.name}`;
    if (app.version) {
      url = `${url}/${app.version}`;
    }
    return this.httpClient
      .delete(url, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  unregisterApps(apps: App[]): Observable<any[]> {
    return forkJoin(apps.map(app => this.unregisterApp(app)));
  }

  defaultVersion(app: App): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .put(`/apps/${app.type}/${app.name}/${app.version}`, { headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  importUri(uri: string, force: boolean = false): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('uri', uri)
      .append('force', force ? 'true' : 'false');
    return this.httpClient
      .post('/apps', {}, { headers, params })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  importProps(properties: string, force: boolean): Observable<any> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('apps', properties)
      .append('force', force ? 'true' : 'false');
    return this.httpClient
      .post('/apps', {}, { headers, params })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  registerProp(prop: any): Observable<any> {
    let params = new HttpParams()
      .append('uri', prop.uri)
      .append('force', prop.force.toString());
    if (prop.metaDataUri) {
      params = params.append('metadata-uri', prop.metaDataUri);
    }
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .post(`/apps/${ApplicationType[prop.type]}/${prop.name}`, {}, { params, headers })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  registerProps(props: Array<any>): Observable<any> {
    return forkJoin(props.map(prop => this.registerProp(prop)));
  }

}
