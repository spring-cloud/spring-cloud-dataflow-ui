import { Serializable } from '../../shared/model';
import { Page } from './page';
import { DateTime } from 'luxon';

/**
 * Represents an Audit Record.
 *
 * @author Gunnar Hillert
 */
export class AuditRecord implements Serializable<AuditRecord> {

  public auditRecordId: number;
  public createdBy: string;
  public correlationId: string;
  public auditData: string;
  public createdOn: DateTime;
  public auditAction: string;
  public auditOperation: string;

  public static fromJSON(input) {
    return new AuditRecord().deserialize(input);
  }

  public static pageFromJSON(input): Page<AuditRecord> {
    const page = Page.fromJSON<AuditRecord>(input);
    if (input && input._embedded && input._embedded.auditRecordResourceList) {
      page.items = input._embedded.auditRecordResourceList.map(AuditRecord.fromJSON);
    }
    return page;
  }

  /**
   * For a given JSON data object, this method
   * will populate the corresponding AuditRecord object, with
   * the provided properties.
   *
   * @param input JSON input data
   */
  public deserialize(input) {
    this.auditRecordId = input.auditRecordId;
    this.createdBy = input.createdBy;
    this.correlationId = input.correlationId;
    this.auditData = input.auditData;
    this.createdOn = DateTime.fromISO(input.createdOn);
    this.auditAction = input.auditAction;
    this.auditOperation = input.auditOperation;
    return this;
  }

}

export class AuditActionType implements Serializable<AuditActionType> {

  public id: number;
  public key: string;
  public name: string;

  public static fromJSON(input) {
    return new AuditActionType().deserialize(input);
  }

  public deserialize(input) {
    this.id = input.id;
    this.key = input.key;
    this.name = input.name;
    return this;
  }

}

export class AuditOperationType implements Serializable<AuditOperationType> {
  public id: number;
  public key: string;
  public name: string;

  public static fromJSON(input) {
    return new AuditOperationType().deserialize(input);
  }

  public deserialize(input) {
    this.id = input.id;
    this.key = input.key;
    this.name = input.name;
    return this;
  }

}
