import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
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
   * @param {Http} http
   * @param {ErrorHandler} errorHandler
   */
  constructor(private http: Http, private errorHandler: ErrorHandler) {
  }

  /**
   * Get the runtime applications based on the paged parameters.
   *
   * @returns {Observable<R|T>} the Promise that returns the paged result of Runtime applications.
   * @param pagination
   */
  public getRuntimeApps(pagination: PaginationParams): Observable<Page<RuntimeApp>> {
    return this.http.get(this.runtimeServiceURL, {params: pagination})
      .map(this.extractData)
      .catch(this.errorHandler.handleError);
  }

  /**
   * Extract data JSON to model
   *
   * @param {Response} result
   * @returns {Page<RuntimeApp>}
   */
  private extractData(result: Response): Page<RuntimeApp> {
    const response = result.json();
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
