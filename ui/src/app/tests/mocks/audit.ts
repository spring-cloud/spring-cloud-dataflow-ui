import { Page } from '../../shared/model/page';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AuditActionType, AuditOperationType, AuditRecord } from '../../shared/model/audit-record.model';
import { AuditRecordListParams } from '../../audit/components/audit.interface';
import { DateTime } from 'luxon';

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
    toDate: null,
    fromDate: null,
    sort: 'createdOn',
    order: 'DESC',
    page: 0,
    size: 30,
    itemsSelected: []
  };

  public auditRecords;

  getAuditRecords(auditRecordListParams: AuditRecordListParams): Observable<Page<AuditRecord>> {
    return of(AuditRecord.pageFromJSON(this.auditRecords));
  }

  loadAuditOperationTypes() {
    return of([
      AuditOperationType.fromJSON({ 'id': 100, 'name': 'App Registration', 'key': 'APP_REGISTRATION' }),
      AuditOperationType.fromJSON({ 'id': 200, 'name': 'Schedule', 'key': 'SCHEDULE' }),
      AuditOperationType.fromJSON({ 'id': 300, 'name': 'Stream', 'key': 'STREAM' }),
      AuditOperationType.fromJSON({ 'id': 400, 'name': 'Task', 'key': 'TASK' })
    ]);
  }

  loadAuditActionTypes() {
    return of([
      AuditActionType.fromJSON({
        'id': 100,
        'name': 'Create',
        'description': 'Create an Entity',
        'key': 'CREATE',
        'nameWithDescription': 'Create (Create an Entity)'
      }),
      AuditActionType.fromJSON({
        'id': 200,
        'name': 'Delete',
        'description': 'Delete an Entity',
        'key': 'DELETE',
        'nameWithDescription': 'Delete (Delete an Entity)'
      }),
      AuditActionType.fromJSON({
        'id': 300,
        'name': 'Deploy',
        'description': 'Deploy an Entity',
        'key': 'DEPLOY',
        'nameWithDescription': 'Deploy (Deploy an Entity)'
      }),
      AuditActionType.fromJSON({
        'id': 400,
        'name': 'Rollback',
        'description': 'Rollback an Entity',
        'key': 'ROLLBACK',
        'nameWithDescription': 'Rollback (Rollback an Entity)'
      }),
      AuditActionType.fromJSON({
        'id': 500,
        'name': 'Undeploy',
        'description': 'Undeploy an Entity',
        'key': 'UNDEPLOY',
        'nameWithDescription': 'Undeploy (Undeploy an Entity)'
      }),
      AuditActionType.fromJSON({
        'id': 600,
        'name': 'Update',
        'description': 'Update an Entity',
        'key': 'UPDATE',
        'nameWithDescription': 'Update (Update an Entity)'
      })
    ]);
  }

  getAuditRecordDetails(id: number): Observable<AuditRecord> {
    const auditRecord = new AuditRecord();
    auditRecord.auditRecordId = 123456789;
    auditRecord.auditData = 'foobar';
    auditRecord.auditAction = 'action';
    auditRecord.auditOperation = 'operation';
    auditRecord.createdBy = 'Cartman';
    auditRecord.createdOn = DateTime.local();
    return of(auditRecord);
  }
}
