import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../shared/model/page';
import { RuntimeApp } from './model/runtime-app';
import { ErrorHandler } from '../shared/model/error-handler';
import { PaginationParams } from '../shared/components/shared.interface';
import { catchError, map } from 'rxjs/operators';

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

    return this.httpClient
      .get<any>(this.runtimeServiceURL, { params: httpParams })
      .pipe(
        map(RuntimeApp.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }


}
