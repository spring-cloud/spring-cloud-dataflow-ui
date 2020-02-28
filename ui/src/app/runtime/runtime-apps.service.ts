import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ErrorHandler } from '../shared/model/error-handler';
import { PaginationParams } from '../shared/components/shared.interface';
import { catchError, map } from 'rxjs/operators';
import { RuntimeStream } from './model/runtime-stream';

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
  private runtimeServiceURL = '/runtime/streams';

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
  public getRuntimeStreams(pagination: PaginationParams): Observable<any> {
    const httpParams = new HttpParams()
      .append('page', `${pagination.page}`)
      .append('size', `${pagination.size}`);

    // return of(RuntimeStream.pageFromJSON(mock));

    return this.httpClient
      .get<any>(this.runtimeServiceURL, { params: httpParams })
      .pipe(
        map(RuntimeStream.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }


}
