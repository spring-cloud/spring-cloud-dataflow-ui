import { Page } from '../../shared/model/page';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { AuditActionType, AuditOperationType, AuditRecord } from '../../shared/model/audit-record.model';
import { AuditRecordListParams } from '../../audit/components/audit.interface';
import * as moment from 'moment';

/**
 * Mock for {@link AuditRecordService}.
 *
 * Create a mocked service:
 * const auditRecordService = new MockAuditRecordService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: AuditRecordService, useValue: auditRecordService }
 *   ]
 * }).compileComponents();
 *
 * @author Gunnar Hillert
 */
export class MockAuditRecordService {

  public auditActionTypes$ = new BehaviorSubject<Array<AuditActionType>>(null);
  public auditOperationTypes$ = new BehaviorSubject<Array<AuditOperationType>>(null);

  auditContext = {
    q: '',
    action: null,
    operation: null,
    sort: 'createdOn',
    order: 'DESC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  getAuditRecords(auditRecordListParams: AuditRecordListParams): Observable<Page<AuditRecord>> {
    const page = new Page<AuditRecord>();
    return Observable.of(page);
  }
  loadAuditOperationTypes() {
  }
  loadAuditActionTypes() {
  }

  getAuditRecordDetails(id: number): Observable<AuditRecord> {
    const auditRecord = new AuditRecord();
    auditRecord.auditRecordId = 123456789;
    auditRecord.auditData = 'foobar';
    auditRecord.auditAction = 'action';
    auditRecord.auditOperation = 'operation';
    auditRecord.createdBy = 'Cartman';
    auditRecord.serverHost = 'host';
    auditRecord.createdOn = moment();
    return Observable.of(auditRecord);
  }
}
