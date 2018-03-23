import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';
import { StreamBuilderError } from '../../../components/streams.interface';

/**
 * StreamDeployBuilderErrorsComponent
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-builder-errors',
  templateUrl: 'errors.component.html',
  styleUrls: ['styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamDeployBuilderErrorsComponent {

  /**
   * Error Object
   */
  @Input() errors: StreamBuilderError;

  /**
   * Event triggered to remove a property
   */
  @Output() removeError = new EventEmitter<{ type: string, index: number }>();

  removeProperty(type: string, index: number) {
    this.removeError.emit({ type: type, index: index });
  }

  /**
   * List all errors
   */
  getErrors() {
    const result = [];
    if (this.errors) {
      this.errors.global.forEach((error, index) => {
        result.push({ type: 'global', index: index, property: error });
      });
      this.errors.app.forEach((error, index) => {
        result.push({ type: 'app', index: index, property: error });
      });
    }
    return result.sort((a, b) => {
      return a.property > b.property ? 1 : -1;
    });
  }

}
