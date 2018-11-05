import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppRegistration, ApplicationType, DetailedAppRegistration, ErrorHandler, Page } from '../model';
import { PageRequest } from '../model/pagination/page-request.model';
import { HttpUtils } from '../support/http.utils';
import { LoggerService } from './logger.service';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SharedAppsService {

  /**
   * URL App
   */
  private static appsUrl = '/apps';

  /**
   * Constructor
   * @param {HttpClient} httpClient
   * @param {LoggerService} loggerService
   * @param {ErrorHandler} errorHandler
   */
  constructor(private httpClient: HttpClient,
              private loggerService: LoggerService,
              private errorHandler: ErrorHandler) {
  }

  /**
   * Returns a paged list of {@link AppRegistrations}s.
   * @param {PageRequest} pageRequest
   * @param {ApplicationType} type
   * @param {string} search
   * @param {Array<{sort: string; order: string}>} sort
   * @returns {Observable<Page<AppRegistration>>}
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
    return this.httpClient
      .get(SharedAppsService.appsUrl, { headers: httpHeaders, params: params })
      .pipe(
        map(AppRegistration.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Get Application info
   * @param {ApplicationType} appType
   * @param {string} appName
   * @param {string} appVersion
   * @returns {Observable<DetailedAppRegistration>}
   */
  getAppInfo(appType: ApplicationType, appName: string, appVersion?: string): Observable<DetailedAppRegistration> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    let url = `${SharedAppsService.appsUrl}/${appType}/${appName}`;
    if (appVersion) {
      url = `${SharedAppsService.appsUrl}/${appType}/${appName}/${appVersion}`;
    }
    return this.httpClient.get(url, { headers: httpHeaders })
      .pipe(
        map(DetailedAppRegistration.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

}
