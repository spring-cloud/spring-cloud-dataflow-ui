import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, } from '@angular/core';

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
export class StreamDeployBuilderErrorsComponent implements OnInit {

  @Input() errors: { global: Array<string>, app: Array<string> };

  @Output() removeError = new EventEmitter<{ type: string, index: number }>();

  ngOnInit() {

  }

  removeProperty(type: string, index: number) {
    this.removeError.emit({ type: type, index: index });
  }

  getErrors() {
    if (this.errors) {
      const result = [];
      this.errors.global.forEach((error, index) => {
        result.push({ type: 'global', index: index, property: error });
      });
      this.errors.app.forEach((error, index) => {
        result.push({ type: 'app', index: index, property: error });
      });
      return result.sort((a, b) => {
        return a.property > b.property ? 1 : -1;
      });
    }
    return [];
  }

}
