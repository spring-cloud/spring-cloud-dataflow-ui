import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { URLSearchParams } from '@angular/http';
import { AppRegistration } from './model/app-registration';
import { DetailedAppRegistration } from './model/detailed-app-registration';
import { ApplicationType } from './model/application-type';
import { AppRegistrationImport } from './model/app-registration-import';

import { Page } from '../shared/model/page';
import { ErrorHandler } from "../shared/model/error-handler";

@Injectable()
export class AppsService {

  public appRegistrations: Page<AppRegistration>;

  private static appsUrl = '/apps';

  public currentPage: number = 1;
  public filter: string = '';
  public remotelyLoaded = false;

  constructor(private http: Http, private errorHandler: ErrorHandler) {
    console.log('constructing');
  }

  getApps(reload?: boolean): Observable<Page<AppRegistration>> {
    console.log('apps', this.appRegistrations);
    if (!this.appRegistrations || reload) {
      console.log('Fetching App Registrations remotely.')
      this.remotelyLoaded = true;
      return this.http.get(AppsService.appsUrl)
                      .map(this.extractData.bind(this))
                      .catch(this.errorHandler.handleError);
    }
    else {
      this.remotelyLoaded = false;
      console.log('Fetching App Registrations from local state.', this.appRegistrations);
      return Observable.of(this.appRegistrations);
    }
  }

  getAppInfo(appType: ApplicationType, appName: string): Observable<DetailedAppRegistration> {
    console.log(this.appRegistrations);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.get(AppsService.appsUrl + '/' + appType + '/' + appName, options)
      .map(data => {
        console.log('Returned App Registration Detail:', data);
        const body = data.json();
        let detailedAppRegistration = <DetailedAppRegistration> body;
        return detailedAppRegistration;
      })
      .catch(this.errorHandler.handleError);
  }

  bulkImportApps(appRegistrationImport: AppRegistrationImport): Observable<Response> {
    console.log(this.appRegistrations);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();

    params.append('uri', appRegistrationImport.uri);
    params.append('apps', appRegistrationImport.appsProperties ? appRegistrationImport.appsProperties.join('\n') : null);
    params.append('force', appRegistrationImport.force ? 'true' : 'false');

    let options = new RequestOptions({ headers: headers, params: params });
    console.log(options.params);
    return this.http.post(AppsService.appsUrl, {}, options)
                    .catch(this.errorHandler.handleError);
  }

  unregisterApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Unregistering...', appRegistration);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name, options)
      .map(data => {
        this.appRegistrations.items = this.appRegistrations.items.filter(item => item.name !== appRegistration.name);
      })
      .catch(this.errorHandler.handleError);

  }

  registerMultipleApps(appRegs: AppRegistration[]): Observable<Response[]> {
    let observables:Observable<Response>[] = [];
    for (let appReg of appRegs) {
      observables.push(this.registerApp(appReg));
    }
    return Observable.forkJoin(observables);
  }

  registerApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Registering...', appRegistration);

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let params = new URLSearchParams();

    params.append('uri', appRegistration.uri);
    if (appRegistration.metaDataUri) {
        params.append('metadata-uri', appRegistration.metaDataUri);
    }
    params.append('force', appRegistration.force ? 'true' : 'false');

    let options = new RequestOptions({ headers: headers, params: params });
    console.log(options.params);

    return this.http.post(AppsService.appsUrl + '/' + appRegistration.type + '/' + appRegistration.name, {}, options)
      .map(data => {
        if(this.appRegistrations && this.appRegistrations.items) {
          this.appRegistrations.items = this.appRegistrations.items.filter(item => item.name !== appRegistration.name);
        }
    })
    .catch(this.errorHandler.handleError);
  }

  private extractData(res: Response) : Page<AppRegistration> {
    const body = res.json();
    let items: AppRegistration[];
    if (body._embedded && body._embedded.appRegistrationResourceList) {
      items = body._embedded.appRegistrationResourceList as AppRegistration[];
    }
    else {
      items = [];
    }

    let page = new Page<AppRegistration>();
    page.items = items;
    page.totalElements = items.length;

    this.appRegistrations = page;

    console.log('Extracted App Registrations:', this.appRegistrations);
    return page;
  }

}
