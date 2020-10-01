/*
 * Copyright 2016-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  NODE_ROUNDED_CORNER_PALETTE,
  TYPE_ICON_PADDING_PALETTE,
  TYPE_ICON_SIZE_PALETTE, TYPE_INCOMING_MESSAGE_RATE,
  TYPE_INSTANCE_DOT, TYPE_OUTGOING_MESSAGE_RATE
} from './support/shapes';
import {
  Injectable, ComponentFactoryResolver, Injector, ApplicationRef, Type
} from '@angular/core';
import { MetamodelService } from './metamodel.service';
import { Constants, Flo } from 'spring-flo';
import { dia } from 'jointjs';
import { Utils } from './support/utils';
import { ViewHelper } from './support/view-helper';
import { NodeHelper } from './node-helper.service';
import { layout } from './support/layout';
import { ViewUtils } from '../shared/support/view-utils';
import { LoggerService } from '../../shared/service/logger.service';
import { createPaletteGroupHeader } from '../shared/support/shared-shapes';
import { MessageRateComponent } from './message-rate/message-rate.component';
import { InstanceDotComponent } from './instance-dot/instance-dot.component';
import { StreamNodeComponent } from './node/stream-node.component';
import { ElementComponent, ShapeComponent } from '../shared/support/shape-component';
import { PropertiesEditor } from './properties-editor.service';

import * as _joint from 'jointjs';
import * as _ from 'lodash';
import { StreamPropertiesDialogComponent } from './properties/stream-properties-dialog.component';

const joint: any = _joint;

export const ELEMENT_TYPE_COMPONENT_TYPES = new Map<string, Type<ElementComponent>>()
  .set(joint.shapes.flo.NODE_TYPE, StreamNodeComponent)
  .set(TYPE_INSTANCE_DOT, InstanceDotComponent);

export const LINK_LABEL_COMPONENT_TYPES = new Map<string, Type<ShapeComponent>>()
  .set(TYPE_INCOMING_MESSAGE_RATE, MessageRateComponent)
  .set(TYPE_OUTGOING_MESSAGE_RATE, MessageRateComponent);


/**
 * Render Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class RenderService implements Flo.Renderer {

  constructor(protected metamodelService: MetamodelService,
              protected nodeHelper: NodeHelper,
              protected propertiesEditor?: PropertiesEditor,
              protected componentFactoryResolver?: ComponentFactoryResolver,
              protected injector?: Injector,
              protected applicationRef?: ApplicationRef) {
  }

  createNode(viewerDescriptor: Flo.ViewerDescriptor, metadata: Flo.ElementMetadata): dia.Element {
    const element = this.nodeHelper.createNode(metadata);
    const isPalette = viewerDescriptor.graph.get('type') === Constants.PALETTE_CONTEXT;
    if (!isPalette) {
      this.nodeHelper.createPorts(element, metadata);
    } else {
      element.size(120, 30);
      // element.attr('.type-icon/width', TYPE_ICON_SIZE_PALETTE.width);
      // element.attr('.type-icon/height', TYPE_ICON_SIZE_PALETTE.height);
      // element.attr('.type-icon/refY2', -TYPE_ICON_SIZE_PALETTE.height / 2);
      element.attr('.box/rx', NODE_ROUNDED_CORNER_PALETTE);
      element.attr('.box/ry', NODE_ROUNDED_CORNER_PALETTE);
    }
    return element;
  }

  initializeNewLink(link: dia.Link, viewerDescriptor: Flo.ViewerDescriptor) {
    // link.set('connector/name', 'smoothHorizontal');
    link.prop('metadata/metadata/unselectable', true);
  }

  isSemanticProperty(propertyPath: string): boolean {
    return propertyPath === 'node-name' || propertyPath === 'stream-name';
  }

  refreshVisuals(cell: dia.Cell, changedPropertyPath: string, paper: dia.Paper): void {
    const metadata: Flo.ElementMetadata = cell.prop('metadata');
    const type = metadata ? metadata.name : undefined;


    if (cell instanceof joint.dia.Element) {
      const element = cell as dia.Element;
      const view = paper.findViewByModel(element);
      if (changedPropertyPath === 'stream-name') {
        element.attr('.stream-label/display', Utils.canBeHeadOfStream(paper.model, element as dia.Element) ? 'block' : 'none');
        if (element.attr('stream-name')) {
          element.attr('.stream-label/text', element.attr('stream-name'));
          if (view instanceof dia.ElementView) {
            view.update(element);
            if (paper.model.get('type') !== Constants.PALETTE_CONTEXT) {
              ViewUtils.fitLabelWithFixedWidth(paper, element, '.stream-label', element.size().width);
            }
          }
        } else {
          element.attr('.stream-label/text', '');
          element.removeAttr('.stream-label/text');
        }
      } else if ((type === 'destination' || type === 'tap') && changedPropertyPath === 'props/name') {
        // fitLabel() calls update as necessary, so set label text silently
        element.attr('.name-label/text', element.attr('props/name') ? element.attr('props/name') : element.prop('metadata/name'));
        const view2 = paper.findViewByModel(element);
        if (view2) {
          if (paper.model.get('type') !== Constants.PALETTE_CONTEXT) {
            // ViewHelper.fitLabel(paper, element, '.name-label', 5);
            ViewUtils.fitLabelWithFixedLocation(paper, element, '.name-label', 5);
            joint.V(view2.el).toggleClass('default-name', !element.attr('props/name'));
          }
        }
      } else if (changedPropertyPath === 'props/language') {
        /*
         * Check if 'language' property has changed and 'script' property is present
         */
        // TODO: Reevaluate when get to `code-editor` directive migration
        // metadata.properties().then(properties => {
        //     if (properties.get('script') && properties.get('script').source) {
        //         properties.get('script').source.type = element.attr('props/language');
        //         properties.get('script').source.mime = element.attr('props/language') === 'javascript' ?
        //              'text/javascript' : 'text/x-' + element.attr('props/language');
        //     }
        // });
      } else if (changedPropertyPath === 'node-name') {
        const nodeName = element.attr('node-name');
        // fitLabel() calls update as necessary, so set label text silently
        element.attr('.name-label/text', nodeName ? nodeName : element.prop('metadata/name'));
        if (view instanceof dia.ElementView) {
          view.update(element);
          if (paper.model.get('type') !== Constants.PALETTE_CONTEXT) {
            // ViewHelper.fitLabel(paper, element, '.name-label', 5);
            ViewUtils.fitLabelWithFixedLocation(paper, element, '.name-label', 5);
            joint.V(view.el).toggleClass('default-name', !nodeName);
          }
        }
      }
    }

    if (cell instanceof joint.dia.Link) {
      const link = cell as dia.Link;
      switch (changedPropertyPath) {
        case 'props/isTapLink':
          const isTapLink = link.attr('props/isTapLink');
          const linkView = paper ? paper.findViewByModel(link) : undefined;
          if (linkView) {
            const cssClasses = link.attr('.connection/class') || '';
            if (isTapLink) {
              link.attr('.connection/class', cssClasses + ' tapped-output-from-app');
              // linkView.$('.connection, .marker-source, .marker-target').toArray()
              //   .forEach(connection => joint.V(connection).addClass('tapped-output-from-app'));
            } else {
              link.attr('.connection/class', cssClasses.replace(' tapped-output-from-app', '') || 'connection');
              // linkView.$('.connection, .marker-source, .marker-target').toArray()
              //   .forEach(connection => joint.V(connection).removeClass('tapped-output-from-app'));
            }
          }
          break;
      }
      LoggerService.log('link being refreshed');
    }
  }

  initializeNewNode(node: dia.Element, viewerDescriptor: Flo.ViewerDescriptor): void {
    const paper = viewerDescriptor.paper;
    if (paper) {
      const isCanvas = paper.model.get('type') === Constants.CANVAS_CONTEXT;
      const isPalette = paper.model.get('type') === Constants.PALETTE_CONTEXT;
      const metadata: Flo.ElementMetadata = node.prop('metadata');
      if (metadata) {
        if (isPalette) {
          ViewUtils.fitLabelWithFixedLocation(paper, node, '.palette-entry-name-label', TYPE_ICON_PADDING_PALETTE);
        } else {
          ViewUtils.fitLabelWithFixedLocation(paper, node, '.type-label', 15);
          if (metadata.name === 'tap') {
            this.refreshVisuals(node, 'props/name', paper);
          } else if (metadata.name === 'destination') {
            this.refreshVisuals(node, 'props/name', paper);
          } else {
            this.refreshVisuals(node, 'node-name', paper);
          }

          if (isCanvas) {
            this.refreshVisuals(node, 'stream-name', paper);
          }
        }
      }
    }
  }

  createLink(source: Flo.LinkEnd, target: Flo.LinkEnd) {
    return new joint.shapes.flo.LinkDataflow();
  }

  layout(paper) {
    return Promise.resolve(layout(paper));
  }

  handleLinkSourceChanged(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const newSourceId = link.get('source').id;
    const oldSourceId = link.previous('source').id;
    const targetId = link.get('target').id;

    if (newSourceId !== oldSourceId) {
      const newSource = graph.getCell(newSourceId);
      const oldSource = graph.getCell(oldSourceId);
      const target = graph.getCell(targetId);

      // If reconnecting source anchor to a shape with existing primary link switch the link to tap link
      if (newSource) {
        const outgoingLinks = graph.getConnectedLinks(newSource, {outbound: true});
        const primaryLink = outgoingLinks.find(ol => ol !== link && !ol.attr('props/isTapLink')
          && _.isEqual(ol.source(), link.source()));

        link.attr('props/isTapLink', primaryLink ? true : false);
        this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
      }

      // Show input port for 'destination' if outgoing links are gone
      if (oldSource && oldSource.prop('metadata/name') === 'destination'
        /*&& graph.getConnectedLinks(oldSource, {outbound: true}).length === 0*/) {
        // No outgoing links -> hide stream name label
        // Set silently, last attr call would refresh the view
        oldSource.attr('.stream-label/display', 'none', {silent: true});

        //     // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
        //     oldSource.attr('.input-port/display', 'block');
      }
      // // Hide input port for destination if it has a new outgoing link
      if (newSource && newSource.prop('metadata/name') === 'destination') {
        // Has outgoing link, there shouldn't be any incoming links yet -> show stream name label
        // Set silently, last attr call would refresh the view
        newSource.attr('.stream-label/display', 'block', {silent: true});

        //     newSource.attr('.input-port/display', 'none');
      }

      // If tap link has been reconnected update the stream-label for the target if necessary
      if (target) {
        if (link.attr('props/isTapLink')) {
          target.attr('.stream-label/display', 'none');
        }
        if (link.attr('props/isTapLink')) {
          target.attr('.stream-label/display', 'block');
        }
      }
    }
  }

  handleLinkTargetChanged(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const newTargetId = link.get('target').id;
    const oldTargetId = link.previous('target').id;

    if (newTargetId !== oldTargetId) {
      const oldTarget = graph.getCell(oldTargetId);
      if (oldTarget) {
        if (oldTarget.prop('metadata/name') === 'destination') {
          // old target is a destination. Ensure output port is showing now since incoming links are gone

          // No more incoming links, there shouldn't be any outgoing links yet -> indeterminate, hide stream label
          // Set silently, last attr call would refresh the view
          oldTarget.attr('.stream-label/display', 'none', {silent: true});

          //     // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
          //     oldTarget.attr('.output-port/display', 'block');
        }
      }
      const newTarget = graph.getCell(newTargetId);
      if (newTarget) {
        if (newTarget.prop('metadata/name') === 'destination') {
          // Incoming link -> hide stream name label
          // Set silently, last attr call would refresh the view
          newTarget.attr('.stream-label/display', 'none', {silent: true});

          // // new target is destination? Hide output port then.
          // newTarget.attr('.output-port/display', 'none');
        }
      }

      // If tap link has been reconnected update the stream-label for the new target and old target
      if (link.attr('props/isTapLink')) {
        if (oldTarget) {
          oldTarget.attr('.stream-label/display', 'none');
        }
        if (newTarget) {
          newTarget.attr('.stream-label/display', 'block');
        }
      }

    }
  }

  handleLinkRemoved(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const source = graph.getCell(link.get('source').id);
    const target = graph.getCell(link.get('target').id);
    let view: dia.CellView;
    if (source && source.prop('metadata/name') === 'destination'
      && graph.getConnectedLinks(source, {outbound: true}).length === 0) {
      // No more outgoing links, can't be any incoming links yet -> indeterminate, hide stream name label
      // Set silently, last attr call would refresh the view
      source.attr('.stream-label/display', 'none', {silent: true});

      // TODO: Why is the port hiddon/removed when link is deleted??? Probably leftovers of some old functionality...
      // source.removeAttr('.input-port');
      view = flo.getPaper().findViewByModel(source);
      if (view) {
        (view as any).update();
      }
    }
    if (target && target.prop('metadata/name') === 'destination'
      && graph.getConnectedLinks(target, {inbound: true}).length === 0) {
      // No more incoming links, there shouldn't be any outgoing links yet -> leave stream label hidden
      // Set silently, last attr call would refresh the view
      target.attr('.stream-label/display', 'none', {silent: true});
      // TODO: Why is the port hiddon/removed when link is deleted??? Probably leftovers of some old functionality...
      // target.removeAttr('.output-port');
      view = flo.getPaper().findViewByModel(target);
      if (view) {
        (view as any).update();
      }
    }
    // If tap link is removed update stream-name value for the target, i.e. don't display stream anymore
    if (link.attr('props/isTapLink') && target) {
      target.attr('.stream-label/display', 'none');
    }
  }

  toLinkString(graph: dia.Graph, link: dia.Link): string {
    const source = graph.getCell(link.get('source').id);
    const target = graph.getCell(link.get('target').id);
    return `${source ? source.prop('metadata/name') : '?'} -> ${target ? target.prop('metadata/name') : '?'}`;
  }

  // Should pass use Flo.EditorContext and pass metadata, props etc.
  handleLinkInsertChannel(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const source = graph.getCell(link.get('source').id);
    const target = graph.getCell(link.get('target').id);
    // Create a node
    this.metamodelService.load().then(mm => {

      let sourceName = source.prop('metadata/name');
      if (sourceName === 'destination') {
        sourceName = source.attr('props/name');
      }
      let targetName = target.prop('metadata/name');
      if (targetName === 'destination') {
        targetName = target.attr('props/name');
      }

      const newDestinationNode = flo.createNode(Flo.getMetadata(mm, 'destination', 'other'),
        new Map<string, any>().set('name', sourceName + '-' + targetName));

      // Adjust existing link to hit this channel
      const previousSource = link.get('source');
      const existingIsTap = link.attr('props/isTapLink');
      link.set('source', {
        id: newDestinationNode.id,
        port: 'output',
        magnet: '.output-port'
      });

      // New link to connect original source to new target
      flo.createLink(previousSource,
        {id: newDestinationNode.id, port: 'input', magnet: '.input-port'},
        null,
        new Map<string, any>().set('isTapLink', existingIsTap ? true : false));

      flo.performLayout();
    });
  }

  isChannel(e: dia.Cell): boolean {
    return e && (e.prop('metadata/name') === 'tap' || e.prop('metadata/name') === 'destination');
  }

  handleLinkSwitch(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const source = link.getSourceElement();
    // var target = graph.getCell(link.get('target').id);
    const isTapLink = link.attr('props/isTapLink');
    // This does nothing if the source is a destination/tap - there are no tap links allowed from destinations
    if (this.isChannel(source)) {
      return;
    }
    if (isTapLink === true) {
      LoggerService.log(`Converting link ${this.toLinkString(graph, link)} into a primary link`);
      link.attr('props/isTapLink', false);
      // Need to ensure no other links are still primary, that isn't allowed
      // const primaryLink = graph.getConnectedLinks(source, {outbound: true})
      //   .find(l => l !== link && l.attr('props/isTapLink'));
      // if (primaryLink) {
      //   primaryLink.attr('props/isTapLink', true);
      //   this.refreshVisuals(primaryLink, 'props/isTapLink', flo.getPaper());
      // }
    } else {
      LoggerService.log(`Converting link ${this.toLinkString(graph, link)} into a tap link`);
      link.attr('props/isTapLink', true);
    }
    this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
  }

  handleLinkAdded(link: dia.Link, flo: Flo.EditorContext) {
    const graph = flo.getGraph();
    const source = graph.getCell(link.get('source').id);
    const target = graph.getCell(link.get('target').id);
    LoggerService.log('render-service.handleLinkAdded');
    if (!target && source && !this.isChannel(source)) {
      // this is a new link being drawn in the UI (it is not connected to anything yet).
      // Need to decide whether to make it a tap link
      const outgoingLinks = graph.getConnectedLinks(source, {outbound: true});
      const primaryLinkExists = outgoingLinks.find(ol => ol !== link && _.isEqual(link.source(),
        ol.source()) && !ol.attr('props/isTapLink')) ? true : false;
      link.attr('props/isTapLink', primaryLinkExists);
    }
    if (link.attr('props/isTapLink') === true) {
      this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
    }
    if (source && source.prop('metadata/name') === 'destination' && target) {
      // A link is added from a source destination to a target. In these cases the
      // target will show the label (whether a real app or another destination).
      // This is done so that if a destination is connected to 5 outputs, this destination
      // won't track the 5 stream names, the nodes it links to will instead.
      target.attr('.stream-label/display', 'block'); // , { silent: true });
    }
    if (target && target.prop('metadata/name') === 'destination') {
      // Incoming link has been added -> hide stream label
      // Set silently because update will be called for the next property setting
      target.attr('.stream-label/display', 'none', {silent: true});
      // XXX target.attr('.output-port/display', 'none');
    }
    // If tap link has been added update the stream-label for the target
    if (link.attr('props/isTapLink') && target) {
      target.attr('.stream-label/display', 'block');
    }
  }

  handleLinkEvent(flo: Flo.EditorContext, event: string, link: dia.Link) {
    switch (event) {
      case 'options':
        this.propertiesEditor.showForLink(link);
        break;
      case 'change:source':
        this.handleLinkSourceChanged(link, flo);
        break;
      case 'change:target':
        this.handleLinkTargetChanged(link, flo);
        break;
      case 'remove':
        this.handleLinkRemoved(link, flo);
        break;
      case 'add':
        this.handleLinkAdded(link, flo);
        flo.getPaper().findViewByModel(link).on('switch', () => this.handleLinkEvent(flo, 'switch', link));
        flo.getPaper().findViewByModel(link).on('insert-channel', () => this.handleLinkEvent(flo, 'insert-channel', link));
        break;
      case 'switch':
        this.handleLinkSwitch(link, flo);
        break;
      case 'insert-channel':
        this.handleLinkInsertChannel(link, flo);
        break;
    }
  }

  getLinkAnchorPoint(linkView: dia.LinkView, view: dia.ElementView, magnet: SVGElement, reference: dia.Point) {
    if (magnet) {
      const paper: dia.Paper = (linkView as any).paper;
      const type = magnet.getAttribute('port');
      const bbox = joint.V(magnet).bbox(false, paper.viewport);
      const rect = joint.g.rect(bbox);
      if (type === 'input') {
        return joint.g.point(rect.x, rect.y + rect.height / 2);
      } else {
        return joint.g.point(rect.x + rect.width, rect.y + rect.height / 2);
      }
    }
  }

  getNodeView(): dia.ElementView {
    return ViewHelper.createNodeView(this.injector, this.applicationRef, this.componentFactoryResolver, ELEMENT_TYPE_COMPONENT_TYPES);
  }

  getLinkView(): dia.LinkView {
    return ViewHelper.createLinkView(this.injector, this.applicationRef, this.componentFactoryResolver, LINK_LABEL_COMPONENT_TYPES);
  }

  markersChanged(cell: dia.Cell, paper: dia.Paper) {
    const markers: Array<Flo.Marker> = cell.get('markers');
    const view = paper.findViewByModel(cell);
    if (view) {
      joint.V(view.el).toggleClass('validation-errors', markers.length > 0);
    }
  }

  getPaletteRenderer() {
    return {
      createGroupHeader: createPaletteGroupHeader
    };
  }

}
