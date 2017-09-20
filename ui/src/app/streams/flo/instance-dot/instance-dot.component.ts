import { Component, ViewEncapsulation } from '@angular/core';
import { BaseShapeComponent } from '../support/shape-component';
import { StreamMetrics } from '../../model/stream-metrics';
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
export class InstanceDotComponent extends BaseShapeComponent {

  get moduleInstanceData(): StreamMetrics.Instance {
    return this.view ? this.view.model.attr('instance') : undefined;
  }

  get inputMean(): string {
    if (this.moduleInstanceData && !this.isSource) {
      const metric = this.moduleInstanceData.metrics.find(m => m.name === StreamMetrics.INPUT_CHANNEL_MEAN);
      if (metric && typeof metric.value === 'number') {
        return metric.value.toFixed(3);
      }
    }
    return undefined;
  }

  get outputMean(): string {
    if (this.moduleInstanceData && !this.isSink) {
      const metric = this.moduleInstanceData.metrics.find(m => m.name === StreamMetrics.OUTPUT_CHANNEL_MEAN);
      if (metric && typeof metric.value === 'number') {
        return metric.value.toFixed(3);
      }
    }
    return undefined;
  }

  get isSource(): boolean {
    return this.moduleInstanceData ? this.moduleInstanceData.properties[StreamMetrics.TYPE] === ApplicationType[ApplicationType.source] : false;
  }

  get isSink(): boolean {
    return this.moduleInstanceData ? this.moduleInstanceData.properties[StreamMetrics.TYPE] === ApplicationType[ApplicationType.sink] : false;
  }

  get guid(): string {
    return this.moduleInstanceData ? this.moduleInstanceData.properties[StreamMetrics.GUID] : '';
  }

}

