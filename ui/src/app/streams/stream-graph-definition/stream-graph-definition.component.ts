import { Component, ViewEncapsulation, Input } from '@angular/core';
import { Flo } from 'spring-flo';
import { StreamDefinition } from '../model/stream-definition';
import { StreamMetrics } from '../model/stream-metrics';
import { ApplicationType } from '../../shared/model/application-type';
import { dia } from 'jointjs';
import { TYPE_INSTANCE_DOT, TYPE_INSTANCE_LABEL } from '../flo/support/shapes';

import * as _joint from 'jointjs';
const joint: any = _joint;


@Component({
  selector: 'app-stream-graph-definition',
  templateUrl: './stream-graph-definition.component.html',
  styleUrls: [ '../flo/flo.scss', './stream-graph-definition.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamGraphDefinitionComponent {

  flo: Flo.EditorContext;
  private _metrics: StreamMetrics.Stream;

  @Input()
  stream: StreamDefinition;

  @Input()
  set metrics(m: StreamMetrics.Stream) {
    this._metrics = m;
    this.update();
  }

  constructor() {}

  get metrics(): StreamMetrics.Stream {
    return this._metrics;
  }

  get dsl(): string {
    return this.stream ? this.stream.dslText.toString() : undefined;
  }

  get status(): string[] {
    return this.stream ? [ this.stream.status.toString() ] : [];
  }

  setEditorContext(editorContext: Flo.EditorContext) {
    this.flo = editorContext;
  }

  private findModuleMetrics(label: string) {
    return this.metrics.applications.find(app => app.name === label);
  }

  private update() {
    this.updateMessageRates();
    this.updateDots();
  }

  private updateMessageRates() {
    console.log('Update Message Rate Labels');
  }

  private updateDots() {
    if (this.flo) {
      console.log('Updating Dots');
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

  updateInstanceDecorations(cell: dia.Element, moduleMetrics: StreamMetrics.Application) {
    let label: dia.Cell;
    let dots: dia.Cell[] = [];
    // Find label or dots currently painted
    cell.getEmbeddedCells().forEach( embed => {
      if (embed.get('type') === TYPE_INSTANCE_LABEL) {
        label = embed;
      } else if (embed.get('type') === TYPE_INSTANCE_DOT) {
        dots.push(embed);
      }
    });

    if (moduleMetrics && Array.isArray(moduleMetrics.instances) && moduleMetrics.instances.length > 0) {
      let instanceCount = Number(moduleMetrics.instances[0].properties[StreamMetrics.INSTANCE_COUNT]);
      if (!instanceCount) {
        instanceCount = moduleMetrics.instances.length;
      }

      // Label or Dots should be displayed
      const size: dia.Size = cell.get('size');
      const position: dia.Point = cell.get('position');

      const x = position.x + size.width / 2;
      const y = position.y + size.height + 7;

      const diameter = 6;
      const padding = 3;
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
            position: {x: x, y: y}
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
            let even = numberOfDots % 2 === 0;
            let dotX = x - (Math.floor(numberOfDots / 2) * (diameter + padding) + (even ? -padding / 2 : diameter / 2));
            for (let i = 0; i < numberOfDots; i++) {
              const idx = lane * maxDotsPerLine + i/* + 1*/;
              const data = idx < moduleMetrics.instances.length ? moduleMetrics.instances[idx] : undefined;
              const dot = new joint.shapes.flo.InstanceDot({
                position: {x: dotX, y: dotY},
                size: {width: diameter, height: diameter},
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
