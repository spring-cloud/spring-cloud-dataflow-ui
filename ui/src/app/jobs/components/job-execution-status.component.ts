import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Component that will format the Job Execution Status.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-job-execution-status',
  template: `<span *ngIf="state" class="label label-job-status label-{{ className }}">{{ state | uppercase }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobExecutionStatusComponent implements OnChanges {

  /**
   * The status that needs to be formatted.
   */
  @Input() status;


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


  /**
   * On Changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.status.currentValue) {
      this.state = changes.status.currentValue;
      switch (this.state) {
        case 'STARTED':
          this.className = 'info';
          break;
        case 'COMPLETED':
          this.className = 'success';
          break;
        case 'FAILED':
          this.className = 'danger';
          break;
        default:
          this.className = 'default';
      }
    }
  }

}
