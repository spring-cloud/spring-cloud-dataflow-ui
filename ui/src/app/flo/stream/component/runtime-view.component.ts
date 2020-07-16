import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { AppStatus, StreamStatus } from '../../../shared/model/metrics.model';
import { Stream } from '../../../shared/model/stream.model';
import { MetamodelService } from '../metamodel.service';
import { RenderService } from '../render.service';
import { ApplicationType } from '../../../shared/model/app.model';
import { TYPE_INSTANCE_DOT, TYPE_INSTANCE_LABEL } from '../support/shapes';

import * as _joint from 'jointjs';

const joint: any = _joint;


@Component({
  selector: 'app-runtime-stream-flo-view',
  styleUrls: [
    '../../shared/flo.scss',
  ],
  template: `
    <app-graph-view [dsl]="dsl" [ngClass]="status ? status : 'undeployed'" (floApi)="setEditorContext($event)"
                    [metamodel]="metamodel" [renderer]="renderer" [paperPadding]="40"></app-graph-view>
  `,
  encapsulation: ViewEncapsulation.None
})
export class RuntimeStreamFloViewComponent implements OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  flo: Flo.EditorContext;
  private _metrics: StreamStatus;
  private _subscriptionToGraphUpdates: Subscription;

  @Input()
  stream: Stream;

  @Input()
  set metrics(m: StreamStatus) {
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

  get metrics(): StreamStatus {
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

  private findModuleMetrics(label: string): AppStatus {
    return this.metrics?.applications?.find(app => app.name === label);
  }

  private update() {
    this.updateDots();
  }

  private updateDots() {
    if (this.flo) {
      this.flo.getGraph().getElements().forEach((element) => {
        const group = element.prop('metadata/group');
        if (typeof ApplicationType[group] === 'number') {
          let label = element.attr('node-name');
          if (!label) {
            label = element.prop('metadata/name');
          }
          this.updateInstanceDecorations(element, this.findModuleMetrics(label));
        }
      });
    }
  }

  private updateInstanceDecorations(cell: dia.Element, moduleMetrics: AppStatus) {
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
