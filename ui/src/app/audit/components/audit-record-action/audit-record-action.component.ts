import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Runtime application status.
 *
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-audit-record-action',
  styleUrls: ['./styles.scss'],
  template: `<span *ngIf="state" class="label label-{{ className }}">{{ state | uppercase }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditRecordActionComponent implements OnChanges {

  /**
   * Runtime Application
   */
  @Input() auditRecord;

  /**
   * Current status
   */
  state = '';

  /**
   * CSS class
   */
  className = 'default';

  /**
   * Constructor
   */
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.auditRecord.currentValue.auditAction) {
      this.state = changes.auditRecord.currentValue.auditAction;
      switch (this.state.toLowerCase()) {
        case 'create':
        case 'deploy':
          this.className = 'success';
          break;
        case 'delete':
          this.className = 'danger';
          break;
        case 'undeploy':
        case 'rollback':
          this.className = 'warning';
          break;
        case 'update':
          this.className = 'info';
          break;
      }
    }
  }


}
