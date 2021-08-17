import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * ErrorsComponent
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-task-deploy-builder-errors',
  templateUrl: 'errors.component.html',
  styleUrls: ['errors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsComponent {
  /**
   * Error Object
   */
  @Input() errors: any;

  /**
   * Event triggered to remove a property
   */
  @Output() removeError = new EventEmitter<{type: string; index: number}>();

  removeProperty(type: string, index: number): void {
    this.removeError.emit({type, index});
  }

  /**
   * List all errors
   */
  getErrors(): Array<any> {
    const result = [];
    if (this.errors) {
      this.errors.global.forEach((error, index) => {
        result.push({type: 'global', index, property: error});
      });
      this.errors.app.forEach((error, index) => {
        result.push({type: 'app', index, property: error});
      });
    }
    return result.sort((a, b) => (a.property > b.property ? 1 : -1));
  }
}
