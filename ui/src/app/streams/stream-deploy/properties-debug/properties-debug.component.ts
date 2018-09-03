import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

/**
 * Component used to display parameters of a stream deployment
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-deploy-properties-debug',
  templateUrl: 'properties-debug.component.html',
  styleUrls: ['../builder/styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StreamDeployPropertiesDebugComponent implements OnChanges {

  /**
   * Array of properties
   */
  @Input() raw: Array<PropertiesDebug>;

  constructor() {
  }

  /**
   * On Change
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.raw.currentValue) {
      this.raw = changes.raw.currentValue;
    } else {
      this.raw = [];
    }
  }

}

/**
 * Dedicate Interface for {@Link StreamDeployPropertiesDebugComponent}
 */
export interface PropertiesDebug {
  key: string;
  value: string;
  status: string;
}
