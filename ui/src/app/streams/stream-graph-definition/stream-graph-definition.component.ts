import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { Flo } from 'spring-flo';
import { StreamDefinition } from '../model/stream-definition';
import { StreamMetrics, ApplicationMetrics, INPUT_CHANNEL_MEAN, OUTPUT_CHANNEL_MEAN, INSTANCE_COUNT } from '../model/stream-metrics';
import { ApplicationType } from '../../shared/model/application-type';
import { dia } from 'jointjs';
import { TYPE_INSTANCE_DOT, TYPE_INSTANCE_LABEL, TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE } from '../flo/support/shapes';
import { Subscription } from 'rxjs/Subscription';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';

import * as _joint from 'jointjs';
const joint: any = _joint;


@Component({
  selector: 'app-stream-graph-definition',
  templateUrl: './stream-graph-definition.component.html',
  styleUrls: [ '../../shared/flo/flo.scss', './stream-graph-definition.component.scss' ],
  encapsulation: ViewEncapsulation.None
})
export class StreamGraphDefinitionComponent implements OnDestroy {

  flo: Flo.EditorContext;
  private _metrics: StreamMetrics;
  private _subscriptionToGraphUpdates: Subscription;

  @Input()
  stream: StreamDefinition;

  @Input()
  set metrics(m: StreamMetrics) {
    this._metrics = m;
    this.update();
  }

  static getInputRate(app: ApplicationMetrics): number {
    if (app && app.aggregateMetrics) {
      const metric = app.aggregateMetrics.find(m => m.name === INPUT_CHANNEL_MEAN);
      if (metric) {
        return metric.value;
      }
    }
  }

  static getOutputRate(app: ApplicationMetrics): number {
    if (app && app.aggregateMetrics) {
      const metric = app.aggregateMetrics.find(m => m.name === OUTPUT_CHANNEL_MEAN);
      if (metric) {
        return metric.value;
      }
    }
  }

  constructor(public metamodel: MetamodelService, public renderer: RenderService) {}

  ngOnDestroy() {
    if (this._subscriptionToGraphUpdates) {
      this._subscriptionToGraphUpdates.unsubscribe();
    }
  }

  get metrics(): StreamMetrics {
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
    if (this._subscriptionToGraphUpdates) {
      this._subscriptionToGraphUpdates.unsubscribe();
    }
    this._subscriptionToGraphUpdates = this.flo.textToGraphConversionObservable.subscribe(() => this.update());
  }

  private findModuleMetrics(label: string): ApplicationMetrics {
    return this.metrics && Array.isArray(this.metrics.applications) ? this.metrics.applications.find(app => app.name === label) : undefined;
  }

  private update() {
    this.updateMessageRates();
    this.updateDots();
  }

  private updateMessageRates() {
    if (this.flo) {
      this.flo.getGraph().getLinks()
        .filter(link => link.get('type') === joint.shapes.flo.LINK_TYPE)
        .forEach(link => this.updateMessageRatesForLink(link));
    }
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

  private updateInstanceDecorations(cell: dia.Element, moduleMetrics: ApplicationMetrics) {
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
      let instanceCount = Number(moduleMetrics.instances[0].properties[INSTANCE_COUNT]);
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
            const even = numberOfDots % 2 === 0;
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

  private updateMessageRatesForLink(link: dia.Link) {
    let outgoingIndex: number, incomingIndex: number;
    let moduleMetrics: ApplicationMetrics;
    let labels: any[] = link.get('labels') || [];

    // Find incoming and outgoing message rates labels
    if (labels && Array.isArray(labels)) {
      labels.forEach((label, i) => {
        if (label.type === TYPE_OUTGOING_MESSAGE_RATE) {
          outgoingIndex = i;
        } else if (label.type === TYPE_INCOMING_MESSAGE_RATE) {
          incomingIndex = i;
        }
      });
    } else {
      labels = [];
    }

    if (!this.metrics || !this.stream || this.stream.status === 'undeployed' || this.stream.status === 'failed') {
      if (typeof outgoingIndex === 'number' || typeof incomingIndex === 'number') {
        // Need to set the labels if labels were removed. Must be a new array object.
        const newLabels = labels.filter((label, i) => i !== outgoingIndex && i !== incomingIndex);
        link.set('labels', newLabels);
      }
    } else {
      const source = this.flo.getGraph().getCell(link.get('source').id);
      const target = this.flo.getGraph().getCell(link.get('target').id);

      if (source) {
        moduleMetrics = this.findModuleMetrics(source.attr('node-name') || source.attr('metadata/name'));
        const outgoingRate = StreamGraphDefinitionComponent.getOutputRate(moduleMetrics);
        if (typeof outgoingRate === 'number') {
          if (typeof outgoingIndex === 'number') {
            labels[outgoingIndex].rate = outgoingRate;
          } else {
            // Create new label for outgoing message rate
            outgoingIndex = link.get('labels') ? link.get('labels').length : 0;
            link.label(outgoingIndex, <any>{
              position: 10,
              type: TYPE_OUTGOING_MESSAGE_RATE,
              rate: outgoingRate,
              attrs: {
                text: {
                  transform: 'translate(0, -1)',
                },
                rect: {
                  transform: 'translate(0, -1)',
                }
              }
            });
          }
        }
      }

      if (target) {
        moduleMetrics = this.findModuleMetrics(target.attr('node-name') || target.attr('metadata/name'));
        const incomingRate = StreamGraphDefinitionComponent.getInputRate(moduleMetrics);
        if (typeof incomingRate === 'number') {
          if (typeof incomingIndex === 'number') {
            labels[incomingIndex].rate = incomingRate;
          } else {
            // Create new label for incoming message rate
            incomingIndex = link.get('labels') ? link.get('labels').length : 0;
            link.label(incomingIndex, <any>{
              position: -10,
              type: TYPE_INCOMING_MESSAGE_RATE,
              rate: incomingRate,
              attrs: {
                text: {
                  transform: 'translate(0, 17)',
                },
                rect: {
                  transform: 'translate(0, 17)',
                }
              }
            });
          }
        }
      }

    }
  }

}
