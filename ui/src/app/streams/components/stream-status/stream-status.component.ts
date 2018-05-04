import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StreamDefinition } from '../../model/stream-definition';

/**
 * Component used to format the type of Application.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-status',
  template: `<span class="label label-stream-status label-{{ labelClass }}">{{ label }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamStatusComponent implements OnChanges {

  /**
   * Stream Definition
   */
  @Input() streamDefinition: StreamDefinition;

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
    if (changes.streamDefinition) {
      if (changes.streamDefinition.currentValue.status) {
        this.label = changes.streamDefinition.currentValue.status.toString().toUpperCase();
      } else {
        this.label = 'unknown'.toUpperCase();
      }
      switch (this.label.toLowerCase()) {
        default:
        case 'undeployed':
          this.labelClass = 'default';
          break;
        case 'deleted':
        case 'failed':
          this.labelClass = 'danger';
          break;
        case 'incomplete':
          this.labelClass = 'warning';
          break;
        case 'deployed':
          this.labelClass = 'success';
          break;
        case 'deploying':
          this.labelClass = 'info';
          break;
      }
    }
  }
}
