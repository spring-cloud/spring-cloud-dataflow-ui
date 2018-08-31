import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Page} from '../shared/model/page';
import {RuntimeApp} from './model/runtime-app';
import {ErrorHandler} from '../shared/model/error-handler';
import {PaginationParams} from '../shared/components/shared.interface';

/**
 * Service to interact with the SCDF server on Runtime applications queries.
 *
 * @author Ilayaperumal Gopinathan
 * @author Damien Vitrac
 */
@Injectable()
export class RuntimeAppsService {

  /**
   * URL API fo runtime Services
   */
  private runtimeServiceURL = '/runtime/apps';

  /**
   * Constructor
   *
   * @param {HttpClient} httpClient
   * @param {ErrorHandler} errorHandler
   */
  constructor(private httpClient: HttpClient, private errorHandler: ErrorHandler) {
  }

  /**
   * Get the runtime applications based on the paged parameters.
   *
   * @returns {Observable<R|T>} the Promise that returns the paged result of Runtime applications.
   * @param pagination
   */
  public getRuntimeApps(pagination: PaginationParams): Observable<Page<RuntimeApp>> {

    const httpParams = new HttpParams()
      .append('page', pagination.page.toString())
      .append('size', pagination.size.toString());

    return this.httpClient.get<any>(this.runtimeServiceURL, {params: httpParams})
      .map(this.extractData)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Extract data JSON to model
   *
   * @param {Response} result
   * @returns {Page<RuntimeApp>}
   */
  private extractData(response): Page<RuntimeApp> {
    const page = new Page<RuntimeApp>();
    if (response._embedded && response._embedded.appStatusResourceList) {
      page.items = (response._embedded.appStatusResourceList as RuntimeApp[]).map((item) => {
        item.appInstances = item.instances._embedded.appInstanceStatusResourceList;
        return item;
      });
    }
    page.totalElements = response.page.totalElements;
    page.totalPages = response.page.totalPages;
    page.pageNumber = response.page.number;
    page.pageSize = response.page.size;
    return page;
  }

}
