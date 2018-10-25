import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Runtime application status.
 *
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-runtime-state',
  styleUrls: ['./styles.scss'],
  template: `<span *ngIf="state" class="label label-{{ className }}">{{ state | uppercase }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RuntimeAppStateComponent implements OnChanges {

  /**
   * Runtime Application
   */
  @Input() runtimeApp;

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
    if (changes.runtimeApp.currentValue.state) {
      this.state = changes.runtimeApp.currentValue.state;
      switch (this.state) {
        case 'failed':
          this.className = 'danger';
          break;
        case 'deploying':
          this.className = 'info';
          break;
        case 'deployed':
          this.className = 'success';
          break;
      }
    }
  }


}
