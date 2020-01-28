import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Flo } from 'spring-flo';
import { StreamDefinition } from '../../model/stream-definition';
import {
  StreamStatuses,
  StreamStatus
} from '../../model/stream-metrics';
import { ApplicationType } from '../../../shared/model/application-type';
import { dia } from 'jointjs';
import {
  TYPE_INSTANCE_DOT,
  TYPE_INSTANCE_LABEL
} from '../flo/support/shapes';
import { Subscription, Subject } from 'rxjs';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';
import * as _joint from 'jointjs';
import { takeUntil } from 'rxjs/operators';

const joint: any = _joint;


@Component({
  selector: 'app-stream-graph-definition',
  templateUrl: './stream-graph-definition.component.html',
  styleUrls: [
    '../../../shared/flo/flo.scss',
    './stream-graph-definition.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class StreamGraphDefinitionComponent implements OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  flo: Flo.EditorContext;
  private _metrics: StreamStatuses;
  private _subscriptionToGraphUpdates: Subscription;

  @Input()
  stream: StreamDefinition;

  @Input()
  set metrics(m: StreamStatuses) {
    this._metrics = m;
    this.update();
  }

  constructor(public metamodel: MetamodelService, public renderer: RenderService) {
  }

  ngOnDestroy() {
    if (this._subscriptionToGraphUpdates) {
      this._subscriptionToGraphUpdates.unsubscribe();
    }
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  get metrics(): StreamStatuses {
    return this._metrics;
  }

  get dsl(): string {
    return this.stream ? this.stream.dslText.toString() : undefined;
  }

  get status(): string[] {
    return this.stream && this.stream.status ? [this.stream.status.toString()] : ['unknown'];
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.flo = editorContext;
    if (this._subscriptionToGraphUpdates) {
      this._subscriptionToGraphUpdates.unsubscribe();
    }
    this._subscriptionToGraphUpdates = this.flo.textToGraphConversionObservable
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.update());
  }

  private findModuleMetrics(label: string): StreamStatus {
    return this.metrics && Array.isArray(this.metrics.applications) ? this.metrics.applications.find(app => app.name === label) : undefined;
  }

  private update() {
    this.updateDots();
  }

  private updateDots() {
    if (this.flo) {
      this.flo.getGraph().getElements().forEach((element) => {
        const group = element.attr('metadata/group');
        if (typeof ApplicationType[group] === 'number') {
          let label = element.attr('node-name');
          if (!label) {
            label = element.attr('metadata/name');
          }
          this.updateInstanceDecorations(element, this.findModuleMetrics(label));
        }
      });
    }
  }

  private updateInstanceDecorations(cell: dia.Element, moduleMetrics: StreamStatus) {
    let label: dia.Cell;
    let dots: dia.Cell[] = [];
    // Find label or dots currently painted
    cell.getEmbeddedCells().forEach(embed => {
      if (embed.get('type') === TYPE_INSTANCE_LABEL) {
        label = embed;
      } else if (embed.get('type') === TYPE_INSTANCE_DOT) {
        dots.push(embed);
      }
    });

    if (moduleMetrics && Array.isArray(moduleMetrics.instances) && moduleMetrics.instances.length > 0) {
      const instanceCount = moduleMetrics.instances.length;

      // Label or Dots should be displayed
      const size: dia.Size = cell.get('size');
      const position: dia.Point = cell.get('position');

      const x = position.x + size.width / 2;
      const y = position.y + size.height + 7;

      const diameter = 14;
      const padding = 4;
      const maxLanes = 2;
      // Calculate max number of dots that we can fit on one lane under the shape
      const maxDotsPerLine = Math.ceil((size.width - padding) / (padding + diameter));
      // Calculate the number of lanes required to display dots
      const lanesNeeded = Math.ceil(instanceCount / maxDotsPerLine);
      // If number of lanes is too large display label
      if (lanesNeeded > maxLanes) {
        // Label should be displayed - remove dots
        dots.forEach(e => e.remove());
        if (!label) {
          // Create label if it's not on the graph yet
          label = new joint.shapes.flo.InstanceLabel({
            position: { x: x, y: y }
          });
          this.flo.getGraph().addCell(label);
          cell.embed(label);
        }
        const deployedNumber = moduleMetrics.instances.length;
        label.attr('.label/text', deployedNumber + '/' + instanceCount);
      } else {
        // Dots should be displayed - remove the label
        if (label) {
          label.remove();
        }
        if (dots.length !== instanceCount) {
          // Number of dots has changed. Remove old dots and create new ones
          dots.forEach(e => e.remove());
          dots = [];
          // Initialize data structure to store tooltip for each dot
          let dotY = y;

          for (let lane = 0; lane < lanesNeeded; lane++) {
            const numberOfDots = (lane === lanesNeeded - 1) ? instanceCount - lane * maxDotsPerLine : maxDotsPerLine;
            const even = numberOfDots % 2 === 0;
            let dotX = x - (Math.floor(numberOfDots / 2) * (diameter + padding) + (even ? -padding / 2 : diameter / 2));
            for (let i = 0; i < numberOfDots; i++) {
              const idx = lane * maxDotsPerLine + i/* + 1*/;
              const data = idx < moduleMetrics.instances.length ? moduleMetrics.instances[idx] : undefined;
              const dot = new joint.shapes.flo.InstanceDot({
                position: { x: dotX, y: dotY },
                size: { width: diameter, height: diameter },
                attrs: {
                  instance: data
                }
              });
              this.flo.getGraph().addCell(dot);
              cell.embed(dot);
              dotX += diameter + padding;
              dots.push(dot);
            }
            dotY += diameter + padding;
          }
        } else {
          dots.forEach((dot: dia.Cell, i: number) => {
            if (i < moduleMetrics.instances.length) {
              dot.attr('instance', moduleMetrics.instances[i]);
            } else {
              dot.attr('instance', null);
              dot.removeAttr('instance');
            }
          });
        }
      }
    } else {
      // Label or Dots should NOT be displayed for undeployed modules - remove them
      if (label) {
        label.remove();
      }
      dots.forEach(e => e.remove());
    }
  }

}
