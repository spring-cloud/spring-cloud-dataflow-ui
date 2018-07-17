import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/observable/of';

import {AppRegistration, ApplicationType, DetailedAppRegistration, ErrorHandler, Page} from '../model';
import {PageRequest} from '../model/pagination/page-request.model';
import {HttpUtils} from '../support/http.utils';
import { LoggerService } from './logger.service';

@Injectable()
export class SharedAppsService {

  private static appsUrl = '/apps';

  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Returns a paged list of {@link AppRegistrations}s.
   */
  getApps(pageRequest: PageRequest, type?: ApplicationType, search?: string,
          sort?: Array<{ sort: string, order: string }>): Observable<Page<AppRegistration>> {
    const params = HttpUtils.getPaginationParams(pageRequest.page, pageRequest.size);
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();

    if (type !== null) {
      params.append('type', ApplicationType[type]);
    }
    if (search !== null) {
      params.append('search', search);
    }
    if (sort) {
      sort.forEach((value) => {
        params.append('sort', `${value.sort},${value.order}`);
      });
    }

    return this.httpClient.get(SharedAppsService.appsUrl, {
      headers: httpHeaders,
      params: params
    })
      .map(jsonResponse => this.extractData(jsonResponse))
      .catch(this.errorHandler.handleError);
  }

  getAppInfo(appType: ApplicationType, appName: string, appVersion?: string): Observable<DetailedAppRegistration> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let url = `${SharedAppsService.appsUrl}/${appType}/${appName}`;
    if (appVersion) {
      url = `${SharedAppsService.appsUrl}/${appType}/${appName}/${appVersion}`;
    }
    return this.httpClient.get(url, { headers: httpHeaders})
      .map(body => {
        this.loggerService.log('Returned App Registration Detail:', body);
        const detailedAppRegistration = new DetailedAppRegistration().deserialize(body);
        return detailedAppRegistration;
      })
      .catch(this.errorHandler.handleError);
  }

  private extractData(jsonResponse): Page<AppRegistration> {
    const items: AppRegistration[] = [];
    if (jsonResponse._embedded && jsonResponse._embedded.appRegistrationResourceList) {
      for (const jsonAppregistration of jsonResponse._embedded.appRegistrationResourceList) {
        items.push(new AppRegistration().deserialize(jsonAppregistration));
      }
    }

    const page = new Page<AppRegistration>();
    page.items = items;
    page.totalElements = jsonResponse.page.totalElements;
    page.pageNumber = jsonResponse.page.number;
    page.pageSize = jsonResponse.page.size;
    page.totalPages = jsonResponse.page.totalPages;

    this.loggerService.log('page', page);
    return page;
  }

}
