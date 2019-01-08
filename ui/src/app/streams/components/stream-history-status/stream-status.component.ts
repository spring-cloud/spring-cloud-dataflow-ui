import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Component used to display a stream history status.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-history-status',
  template: `<span class="label label-stream-status label-{{ labelClass }}">{{ label }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamHistoryStatusComponent implements OnChanges {

  /**
   * Stream Definition
   */
  @Input() status: string;

  /**
   * Label
   */
  label: string;

  /**
   * Dedicate CSS class
   */
  labelClass: string;

  /**
   * On Changes listener
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.status && changes.status.currentValue) {
      this.label = changes.status.currentValue.toString().toUpperCase();
    } else {
      this.label = 'unknown'.toUpperCase();
    }
    switch (this.label.toLowerCase()) {
      default:
      case 'undeployed':
        this.labelClass = 'default';
        break;
      case 'deleted':
        this.labelClass = 'danger';
        break;
      case 'incomplete':
        this.labelClass = 'warning';
        break;
      case 'deployed':
        this.labelClass = 'success';
        break;
    }
  }
}
