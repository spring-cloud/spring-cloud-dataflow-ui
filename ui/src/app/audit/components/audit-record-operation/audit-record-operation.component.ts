import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Runtime application status.
 *
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-audit-record-operation',
  styleUrls: ['./styles.scss'],
  template: `<span *ngIf="state" class="label label-default">
    <i class="fa fa-{{ ico }}"></i>
    {{ state | uppercase }}
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditRecordOperationComponent implements OnChanges {

  /**
   * Runtime Application
   */
  @Input() auditRecord;

  /**
   * Current status
   */
  state = '';

  /**
   * Current ico
   */
  ico = '';

  /**
   * Constructor
   */
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.auditRecord.currentValue.auditOperation) {
      this.state = changes.auditRecord.currentValue.auditOperation;
      switch (this.state.toLowerCase()) {
        case 'stream':
          this.ico = 'cloud';
          break;
        case 'app_registration':
          this.ico = 'tags';
          break;
        case 'schedule':
          this.ico = 'clock-o';
          break;
        case 'task':
          this.ico = 'tasks';
          break;
      }
    }
  }


}
