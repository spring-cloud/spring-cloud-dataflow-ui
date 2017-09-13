import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';

import { AppRegistration, ApplicationType, DetailedAppRegistration, ErrorHandler, Page } from '../model';
import { PageRequest } from '../model/pagination/page-request.model';
import { HttpUtils } from '../support/http.utils';

@Injectable()
export class SharedAppsService {

  private static appsUrl = '/apps';

  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  /**
   * Returns a paged list of {@link AppRegistrations}s.
   */
  getApps(pageRequest: PageRequest, type?: ApplicationType, search?: string): Observable<Page<AppRegistration>> {
      const params = HttpUtils.getPaginationParams(pageRequest.page, pageRequest.size);
      const requestOptionsArgs: RequestOptionsArgs = HttpUtils.getDefaultRequestOptions();

      if (type) {
        params.append('type', ApplicationType[type]);
      }
      if (search) {
        params.append('search', search);
      }
      requestOptionsArgs.search = params;
      return this.http.get(SharedAppsService.appsUrl, requestOptionsArgs)
                      .map(this.extractData.bind(this))
                      .catch(this.errorHandler.handleError);
  }

  getAppInfo(appType: ApplicationType, appName: string): Observable<DetailedAppRegistration> {
    const options = HttpUtils.getDefaultRequestOptions();

    return this.http.get(SharedAppsService.appsUrl + '/' + appType + '/' + appName, options)
      .map(data => {
        console.log('Returned App Registration Detail:', data);
        const body = data.json();
        const detailedAppRegistration = new DetailedAppRegistration().deserialize(body);
        return detailedAppRegistration;
      })
      .catch(this.errorHandler.handleError);
  }

  private extractData(response: Response): Page<AppRegistration> {
    const body = response.json();
    const items: AppRegistration[] = [];
    if (body._embedded && body._embedded.appRegistrationResourceList) {
      for (const jsonAppregistration of body._embedded.appRegistrationResourceList) {
        items.push(new AppRegistration().deserialize(jsonAppregistration));
      }
    }

    const page = new Page<AppRegistration>();
    page.items = items;
    page.totalElements = body.page.totalElements;
    page.pageNumber = body.page.number;
    page.pageSize = body.page.size;
    page.totalPages = body.page.totalPages;

    console.log('page', page);
    return page;
  }

}
