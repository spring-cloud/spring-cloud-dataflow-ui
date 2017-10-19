import { Component, ViewEncapsulation } from '@angular/core';
import { ElementComponent } from '../../../shared/flo/support/shape-component';
import { InstanceMetrics, INPUT_CHANNEL_MEAN, OUTPUT_CHANNEL_MEAN, TYPE } from '../../model/stream-metrics';
import { ApplicationType } from '../../../shared/model/application-type';

/**
 * Component for displaying "dot" for instance metrics data under the module
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Component({
  selector: 'app-flo-instance-dot',
  templateUrl: 'instance-dot.component.html',
  styleUrls: [ 'instance-dot.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class InstanceDotComponent extends ElementComponent {

  get instance(): InstanceMetrics {
    return this.view ? this.view.model.attr('instance') : undefined;
  }

  get inputMean(): string {
    if (this.instance && !this.isSource) {
      const metric = this.instance.metrics.find(m => m.name === INPUT_CHANNEL_MEAN);
      if (metric && typeof metric.value === 'number') {
        return metric.value.toFixed(3);
      }
    }
    return undefined;
  }

  get outputMean(): string {
    if (this.instance && !this.isSink) {
      const metric = this.instance.metrics.find(m => m.name === OUTPUT_CHANNEL_MEAN);
      if (metric && typeof metric.value === 'number') {
        return metric.value.toFixed(3);
      }
    }
    return undefined;
  }

  get isSource(): boolean {
    return this.instance ? this.instance.properties[TYPE] === ApplicationType[ApplicationType.source] : false;
  }

  get isSink(): boolean {
    return this.instance ? this.instance.properties[TYPE] === ApplicationType[ApplicationType.sink] : false;
  }

  get guid(): string {
    return this.instance ? this.instance.guid : '';
  }

}

