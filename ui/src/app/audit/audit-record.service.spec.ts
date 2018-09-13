import { Observable } from 'rxjs/Observable';

import { AuditRecordService } from './audit-record.service';
import { LoggerService } from '../shared/services/logger.service';
import { AuditOperationType } from '../shared/model/audit-record.model';
import { AuditRecordListParams } from './components/audit.interface';
import { ErrorHandler } from '../shared/model';

describe('AuditRecordService', () => {

  beforeEach(() => {

    this.mockHttp = {
      get: jasmine.createSpy('get')
    };

    this.jsonData = {};
    const errorHandler = new ErrorHandler();
    const loggerService = new LoggerService();
    this.auditRecordService = new AuditRecordService(this.mockHttp, errorHandler, loggerService);
  });

  describe('getAuditRecords', () => {

    it('should call the audit record service with the right url to get all audit records', () => {
      const auditOperationType = new AuditOperationType();
      auditOperationType.id = 123;
      auditOperationType.key = 'FOO';
      auditOperationType.name = 'bar';

      const auditRecordListParams: AuditRecordListParams = {
        q: '',
        operation: auditOperationType,
        action: null,
        page: 0,
        size: 4,
        sort: '',
        order: 'ASC'
      };

      this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
      this.auditRecordService.getAuditRecords(auditRecordListParams);

      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/audit-records');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });
  });

  // describe('loadAuditOperationTypes', () => {

  //   it('should call the audit record service with the right url to get all audit operation types', () => {
  //     this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
  //     this.auditRecordService.loadAuditOperationTypes();

  //     const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
  //     const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
  //     expect(httpUri).toEqual('/audit-records/audit-operation-types');
  //     expect(headerArgs.get('Content-Type')).toEqual('application/json');
  //     expect(headerArgs.get('Accept')).toEqual('application/json');
  //   });
  // });

  // describe('loadAuditActionTypes', () => {

  //   it('should call the audit record service with the right url to get all audit action types', () => {

  //     this.mockHttp.get.and.returnValue(Observable.of(this.jsonData));
  //     this.auditRecordService.loadAuditActionTypes();

  //     const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
  //     const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
  //     expect(httpUri).toEqual('/audit-records/audit-action-types');
  //     expect(headerArgs.get('Content-Type')).toEqual('application/json');
  //     expect(headerArgs.get('Accept')).toEqual('application/json');
  //   });
  // });
});
