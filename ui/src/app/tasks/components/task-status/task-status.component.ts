import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TaskDefinition } from '../../model/task-definition';

/**
 * Component used to format the type of Task.
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-status',
  template: `<span class="label label-task-status label-{{ labelClass }}">{{ label }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStatusComponent implements OnChanges {

  /**
   * Stream Definition
   */
  @Input() taskDefinition: TaskDefinition;

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
    if (changes.taskDefinition) {
      if (changes.taskDefinition.currentValue.status) {
        this.label = changes.taskDefinition.currentValue.status.toString().toUpperCase();
      } else {
        this.label = 'unknown'.toUpperCase();
      }

      switch (this.label.toLowerCase()) {
        case 'launching':
          this.labelClass = 'primary';
          break;
        case 'running':
          this.labelClass = 'primary';
          break;
        case 'cancelled':
          this.labelClass = 'warning';
          break;
        case 'complete':
          this.labelClass = 'success';
          break;
        case 'failed':
        case 'error':
          this.labelClass = 'danger';
          break;
        default:
        case 'unknown':
          this.labelClass = 'info';
          break;
      }
    }
  }
}
