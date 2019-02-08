import { AuditRecordService } from './audit-record.service';
import { LoggerService } from '../shared/services/logger.service';
import { AuditActionType, AuditOperationType } from '../shared/model/audit-record.model';
import { AuditRecordListParams } from './components/audit.interface';
import { ErrorHandler } from '../shared/model';
import { of } from 'rxjs';

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
        fromDate: null,
        toDate: null,
        page: 0,
        size: 4,
        sort: '',
        order: 'ASC'
      };

      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.auditRecordService.getAuditRecords(auditRecordListParams);
      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      expect(httpUri).toEqual('/audit-records');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
    });

    it('should call the audit record service with the right url and params', () => {
      const auditOperationType = new AuditOperationType();
      auditOperationType.id = 2;
      auditOperationType.key = 'bar';
      auditOperationType.name = 'bar';
      const auditActionType = new AuditActionType();
      auditActionType.id = 1;
      auditActionType.key = 'foo';
      auditActionType.name = 'foo';

      const auditRecordListParams: AuditRecordListParams = {
        q: 'foobar',
        operation: auditOperationType,
        action: auditActionType,
        fromDate: null,
        toDate: null,
        page: 0,
        size: 20,
        sort: 'id',
        order: 'DESC'
      };

      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.auditRecordService.getAuditRecords(auditRecordListParams);
      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      const headerArgs = this.mockHttp.get.calls.mostRecent().args[1].headers;
      const httpParams1 = this.mockHttp.get.calls.mostRecent().args[1].params;
      expect(httpUri).toEqual('/audit-records');
      expect(headerArgs.get('Content-Type')).toEqual('application/json');
      expect(headerArgs.get('Accept')).toEqual('application/json');
      expect(httpParams1.get('page')).toEqual('0');
      expect(httpParams1.get('size')).toEqual('20');
      expect(httpParams1.get('sort')).toEqual('id,DESC');
      expect(httpParams1.get('operations')).toEqual('bar');
      expect(httpParams1.get('actions')).toEqual('foo');
      expect(httpParams1.get('search')).toEqual('foobar');
    });

  });

  describe('loadAuditOperationTypes / loadAuditActionTypes', () => {

    it('should call the audit record service with the right url to get all audit operation types', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.auditRecordService.loadAuditOperationTypes();
      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri).toEqual('/audit-records/audit-operation-types');
    });

    it('should call the audit record service with the right url to get all audit action types', () => {
      this.mockHttp.get.and.returnValue(of(this.jsonData));
      this.auditRecordService.loadAuditActionTypes();
      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri).toEqual('/audit-records/audit-action-types');
    });

  });

  describe('getAuditRecordDetails', () => {

    it('should call the audit record details service with the right url', () => {
      this.mockHttp.get.and.returnValue(of({}));
      this.auditRecordService.getAuditRecordDetails('foobar');
      const httpUri = this.mockHttp.get.calls.mostRecent().args[0];
      expect(httpUri).toEqual('/audit-records/foobar');
    });

  });

});
