import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { AppRegistration } from './model/app-registration';

@Injectable()
export class AppsService {

  private appstUrl = '/apps';

  currentPage: number = 1;
  filter: string = '';

  constructor(private http: Http) { }

  getApps(): Observable<AppRegistration[]> {
    return this.http.get(this.appstUrl)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) : AppRegistration[] {
    const body = res.json();
    //console.log(body);
    let items = body._embedded.appRegistrationResourceList as AppRegistration[];
//console.log(items);
    return items;
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
