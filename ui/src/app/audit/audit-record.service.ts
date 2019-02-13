import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ErrorHandler, Page } from '../shared/model';
import { HttpUtils } from '../shared/support/http.utils';
import { LoggerService } from '../shared/services/logger.service';
import { AuditRecord, AuditOperationType, AuditActionType } from '../shared/model/audit-record.model';
import { BehaviorSubject } from 'rxjs';
import { AuditRecordListParams } from './components/audit.interface';
import { catchError, map } from 'rxjs/operators';
import { DateTime } from 'luxon';

/**
 * Service class for the Audit Record module.
 *
 * @author Gunnar Hillert
 */
@Injectable()
export class AuditRecordService {

  /**
   * URL API
   */
  private static URL = '/audit-records';

  /**
   * Store the state of the applications list params
   */
  auditContext = {
    q: '',
    action: null,
    operation: null,
    fromDate: null,
    toDate: null,
    sort: 'createdOn',
    order: 'DESC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  /**
   * Audit Action Types
   * @type {BehaviorSubject<Array<AuditActionType>>}
   */
  public auditActionTypes$ = new BehaviorSubject<Array<AuditActionType>>(null);

  /**
   * Audit Operation Types
   * @type {BehaviorSubject<Array<AuditOperationType>>}
   */
  public auditOperationTypes$ = new BehaviorSubject<Array<AuditOperationType>>(null);

  /**
   * Constructor
   *
   * @param {Http} httpClient
   * @param {ErrorHandler} errorHandler
   * @param {LoggerService} loggerService
   */
  constructor(private httpClient: HttpClient,
              private errorHandler: ErrorHandler,
              private loggerService: LoggerService) {
  }

  /**
   * Returns an Observable of {@link Page<AuditRecord>}s.
   *
   * @returns {Observable<R|T>} that will call the subscribed funtions to handle
   * the results when returned from the Spring Cloud Data Flow server.
   */
  getAuditRecords(auditRecordListParams: AuditRecordListParams): Observable<Page<AuditRecord>> {
    this.loggerService.log('Getting paged audit records', auditRecordListParams);
    let params = HttpUtils.getPaginationParams(auditRecordListParams.page, auditRecordListParams.size);
    if (auditRecordListParams.q) {
      params = params.append('search', auditRecordListParams.q);
    }
    if (auditRecordListParams.action) {
      params = params.append('actions', auditRecordListParams.action.key);
    }
    if (auditRecordListParams.operation) {
      params = params.append('operations', auditRecordListParams.operation.key);
    }
    if (auditRecordListParams.sort && auditRecordListParams.order) {
      params = params.append('sort', `${auditRecordListParams.sort},${auditRecordListParams.order}`);
    }
    if (auditRecordListParams.fromDate) {
      params = params.append('fromDate', auditRecordListParams.fromDate.toISODate() + 'T00:00:00');
    }
    if (auditRecordListParams.toDate) {
      params = params.append('toDate', auditRecordListParams.toDate.toISODate() + 'T23:59:59');
    }
    return this.httpClient
      .get<any>(AuditRecordService.URL, { params: params, headers: HttpUtils.getDefaultHttpHeaders() })
      .pipe(
        map(AuditRecord.pageFromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Load Audit Operation Types
   * @returns {Observable}
   */
  loadAuditOperationTypes() {
    this.loggerService.log('Getting audit operation types.');
    return this.httpClient
      .get<any>(AuditRecordService.URL + '/audit-operation-types', { headers: HttpUtils.getDefaultHttpHeaders() })
      .pipe(
        map(response => {
          const auditOperationTypes: AuditOperationType[] = response.map(AuditOperationType.fromJSON);
          this.auditOperationTypes$.next(auditOperationTypes);
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Load Audit Action Types
   * @returns {Observable}
   */
  loadAuditActionTypes() {
    this.loggerService.log('Getting audit action types.');
    return this.httpClient
      .get<any>(AuditRecordService.URL + '/audit-action-types', { headers: HttpUtils.getDefaultHttpHeaders() })
      .pipe(
        map(response => {
          const auditActionTypes: AuditActionType[] = response.map(AuditActionType.fromJSON);
          this.auditActionTypes$.next(auditActionTypes);
        }),
        catchError(this.errorHandler.handleError)
      );
  }

  /**
   * Returns an Observable of a {@link AuditRecord}, providing details
   * for an app registration.
   * @param id
   */
  getAuditRecordDetails(id: number): Observable<AuditRecord> {
    const url = `${AuditRecordService.URL}/${id}`;
    return this.httpClient
      .get(url, { headers: HttpUtils.getDefaultHttpHeaders() })
      .pipe(
        map(AuditRecord.fromJSON),
        catchError(this.errorHandler.handleError)
      );
  }

}
