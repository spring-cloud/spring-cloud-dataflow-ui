
import { ListParams } from '../../shared/components/shared.interface';
import { AuditOperationType, AuditActionType } from '../../shared/model/audit-record.model';

/**
 * @author Gunnar Hillert
 */
export interface AuditRecordListParams extends ListParams {
  q: string;
  operation: AuditOperationType;
  action: AuditActionType;
  page: number;
  size: number;
  sort: string;
  order: string;
}
