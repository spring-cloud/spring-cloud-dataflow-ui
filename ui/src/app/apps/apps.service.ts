import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { URLSearchParams } from '@angular/http';
import { AppRegistration } from './model/app-registration';
import { AppRegistrationImport } from './model/app-registration-import';

import { Page } from '../shared/model/page';

@Injectable()
export class AppsService {

  public appRegistrations: Page<AppRegistration>;

  private static appstUrl = '/apps';

  public currentPage: number = 1;
  public filter: string = '';

  constructor(private http: Http) {
    console.log('constructing');
  }

  getApps(reload?: boolean): Observable<Page<AppRegistration>> {
    console.log('apps', this.appRegistrations);
    if (!this.appRegistrations || reload) {
      console.log('Fetching App Registrations remotely.')
      return this.http.get(AppsService.appstUrl)
                      .map(this.extractData.bind(this))
                      .catch(this.handleError);
    }
    else {
      console.log('Fetching App Registrations from local state.', this.appRegistrations);
      return Observable.of(this.appRegistrations);
    }
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
    return this.http.post(AppsService.appstUrl, {}, options)
                    .catch(this.handleError);
  }

  unregisterApp(appRegistration: AppRegistration): Observable<Response> {
    console.log('Unregistering...', appRegistration);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    console.log(appRegistration.name);
    return this.http.delete('/apps/' + appRegistration.type + '/' + appRegistration.name, options)
      .map(data => {
        this.appRegistrations.items = this.appRegistrations.items.filter(item => item.name !== appRegistration.name);
      })
      .catch(this.handleError);

    //                 .catch(this.handleError);
    // var request = $resource($rootScope.dataflowServerUrl + '/apps/' + type + '/' + name, {}, {
    //                     unregisterApp: {
    //                         method: 'DELETE'
    //                     }
    //                 }).unregisterApp();
    //                 request.$promise.then(function() {
    //                     notifyListeners();
    //                 });
    //                 return request;



    //return;
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

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
