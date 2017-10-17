/*
 * Copyright 2016-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import './support/shapes';
import { IMAGE_W, HORIZONTAL_PADDING } from './support/shapes';
import {
  Injectable, ComponentFactoryResolver, ComponentFactory, Injector, ApplicationRef, Type,
  ComponentRef
} from '@angular/core';
import { ApplicationType } from '../../shared/model/application-type';
import { MetamodelService } from './metamodel.service';
import { Flo, Constants } from 'spring-flo';
import { NodeComponent } from './node/node.component';
import { DecorationComponent } from '../../shared/flo/decoration/decoration.component';
import { HandleComponent } from '../../shared/flo/handle/handle.component';
import { BaseShapeComponent, ElementComponent } from '../../shared/flo/support/shape-component';
import { dia } from 'jointjs';
import { Utils } from './support/utils';
import { TYPE_INSTANCE_DOT, TYPE_INCOMING_MESSAGE_RATE, TYPE_OUTGOING_MESSAGE_RATE } from './support/shapes';
import { InstanceDotComponent } from './instance-dot/instance-dot.component';
import { MessageRateComponent } from './message-rate/message-rate.component';
import { layout } from './support/layout';
import * as _ from 'underscore';
import * as $ from 'jquery';
import * as _joint from 'jointjs';
const joint: any = _joint;


const HANDLE_ICON_MAP = new Map<string, string>()
    .set(Constants.REMOVE_HANDLE_TYPE, 'assets/img/delete.svg')
    .set(Constants.PROPERTIES_HANDLE_TYPE, 'assets/img/cog.svg');

const HANDLE_ICON_SIZE = new Map<string, dia.Size>()
    .set(Constants.REMOVE_HANDLE_TYPE, {width: 10, height: 10})
    .set(Constants.PROPERTIES_HANDLE_TYPE, {width: 11, height: 11});

const DECORATION_ICON_MAP = new Map<string, string>()
    .set(Constants.ERROR_DECORATION_KIND, 'assets/img/error.svg');

// Default icons (unicode chars) for each group member, unless they override
const GROUP_ICONS = new Map<string, string>()
        .set('source', '⤇')// 2907
        .set('processor', 'λ') // 3bb  //flux capacitor? 1D21B
        .set('sink', '⤇') // 2907
        .set('task', '☉') // 2609   ⚙=2699 gear (rubbish)
        .set('destination', '⦂') // 2982
        .set('tap', '⦂') // 2982
    ;

const ELEMENT_TYPE_COMPONENT_TYPE = new Map<string, Type<ElementComponent>>()
  .set(joint.shapes.flo.NODE_TYPE, NodeComponent)
  .set(joint.shapes.flo.DECORATION_TYPE, DecorationComponent)
  .set(joint.shapes.flo.HANDLE_TYPE, HandleComponent)
  .set(TYPE_INSTANCE_DOT, InstanceDotComponent);

const LINK_LABEL_COMPONENT_TYPE = new Map<string, Type<BaseShapeComponent>>()
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

    private nodeComponentFactory: ComponentFactory<NodeComponent>;

    constructor(
      private metamodelService: MetamodelService,
      private componentFactoryResolver?: ComponentFactoryResolver,
      private injector?: Injector,
      private applicationRef?: ApplicationRef
    ) {}

    createHandle(kind: string, parent: dia.Cell) {
        return new joint.shapes.flo.ErrorDecoration({
            size: HANDLE_ICON_SIZE.get(kind),
            attrs: {
                'image': {
                    'xlink:href': HANDLE_ICON_MAP.get(kind)
                }
            }
        });
    }

    createDecoration(kind: string, parent: dia.Cell) {
        return new joint.shapes.flo.ErrorDecoration({
            size: {width: 16, height: 16},
            attrs: {
                'image': {
                    'xlink:href': DECORATION_ICON_MAP.get(kind)
                }
            }
        });
    }


    fitLabel(paper: dia.Paper, node: dia.Element, labelPath: string): void {
        const label: string = node.attr(labelPath);
        if (label && label.length < 9) {
            return;
        }
        const view = paper.findViewByModel(node);
        if (view && label) {
            const textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
            let offset = 0;
            if (node.attr('.label2/text')) {
                const label2View = view.findBySelector('.label2')[0];
                if (label2View) {
                    const box = joint.V(label2View).bbox(false, paper.viewport);
                    offset = HORIZONTAL_PADDING + box.width;
                }
            }
            let width = joint.V(textView).bbox(false, paper.viewport).width;
            const threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING - offset;
            if (offset) {
                (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), {silent: true});
            }
            for (let i = 1; i < label.length && width > threshold; i++) {
                (<any>node).attr(labelPath, label.substr(0, label.length - i) + '\u2026', {silent: true});
                (<any>view).update();
                width = joint.V(textView).bbox(false, paper.viewport).width;
                if (offset) {
                    (<any>node).attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), {silent: true});
                }
            }
            (<any>view).update();
        }
    }


    createNode(metadata: Flo.ElementMetadata): dia.Element {
        switch (metadata.group) {

            case ApplicationType[ApplicationType.source]:
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.input-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': GROUP_ICONS.get(metadata.group)
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );

            case ApplicationType[ApplicationType.processor]:
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': GROUP_ICONS.get(metadata.group)
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );

            case ApplicationType[ApplicationType.sink]:
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.output-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': GROUP_ICONS.get(metadata.group)
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );

            case ApplicationType[ApplicationType.task]:
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.output-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': GROUP_ICONS.get(metadata.group)
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );

            default:
                if (metadata.name === 'tap') {
                    return new joint.shapes.flo.DataFlowApp(
                        joint.util.deepSupplement({
                            attrs: {
                                '.box': {
                                    'fill': '#eeeeff',
                                    'stroke': '#0000ff'
                                },
                                '.input-port': {
                                    display: 'none'
                                },
                                '.label1': {
                                    'text': metadata.name
                                },
                                '.label2': {
                                    'text': GROUP_ICONS.get(metadata.name)
                                }
                            }
                        }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                    );
                } else if (metadata.name === 'destination') {
                    return new joint.shapes.flo.Destination(
                        joint.util.deepSupplement({
                            attrs: {
                                '.box': {
                                    'fill': '#eeeeff',
                                    'stroke': '#0000ff'
                                },
                                '.label1': {
                                    'text': metadata.name
                                },
                                '.label2': {
                                    'text': GROUP_ICONS.get(metadata.name)
                                }
                            }
                        }, joint.shapes.flo.Destination.prototype.defaults)
                    );
                } else {
                    return new joint.shapes.flo.DataFlowApp();
                }

        }
    }


    initializeNewLink(link: dia.Link, viewerDescriptor: Flo.ViewerDescriptor) {
        link.set('smooth', true);
        link.attr('metadata/metadata/unselectable', true);
    }

    isSemanticProperty(propertyPath: string): boolean {
        return propertyPath === 'node-name' || propertyPath === 'stream-name';
    }

    refreshVisuals(cell: dia.Cell, changedPropertyPath: string, paper: dia.Paper): void {
        const metadata: Flo.ElementMetadata = cell.attr('metadata');
        const type = metadata ? metadata.name : undefined;

        if (cell instanceof joint.dia.Element) {
            const element = <dia.Element> cell;
            if (changedPropertyPath === 'stream-name') {
                element.attr('.stream-label/text', element.attr('stream-name'));
                element.attr('.stream-label/display', Utils.canBeHeadOfStream(paper.model, <dia.Element>element) ? 'block' : 'none');
            } else if ((type === 'destination' || type === 'tap') && changedPropertyPath === 'props/name') {
                // fitLabel() calls update as necessary, so set label text silently
                element.attr('.label1/text', element.attr('props/name') ? element.attr('props/name') : element.attr('metadata/name'));
                this.fitLabel(paper, element, '.label1/text');
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
                element.attr('.label1/text', nodeName ? nodeName : element.attr('metadata/name'));
                this.fitLabel(paper, element, '.label1/text');
            }
        }

        if (cell instanceof joint.dia.Link) {
            const link = <dia.Link> cell;
            if (changedPropertyPath === 'props/isTapLink') {
                const isTapLink = link.attr('props/isTapLink');
                const linkView = paper ? paper.findViewByModel(link) : undefined;
                if (linkView) {
                  if (isTapLink) {
                    linkView.$('.connection, .marker-source, .marker-target').toArray()
                      .forEach(connection => joint.V(connection).addClass('tapped-output-from-app'));
                  } else {
                    linkView.$('.connection, .marker-source, .marker-target').toArray()
                      .forEach(connection => joint.V(connection).removeClass('tapped-output-from-app'));
                  }
                }
            }
            console.log('link being refreshed');
        }
    }

    initializeNewNode(node: dia.Element, viewerDescriptor: Flo.ViewerDescriptor): void {
        const metadata: Flo.ElementMetadata = node.attr('metadata');
        if (metadata) {
            const paper = viewerDescriptor.paper;
            if (paper) {
                const isPalette = paper.model.get('type') === joint.shapes.flo.PALETTE_TYPE;
                const isCanvas = paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE;
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
              const primaryLink = outgoingLinks.find(ol => ol !== link && !ol.attr('props/isTapLink'));

              link.attr('props/isTapLink', primaryLink ? true : false);
              this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
            }

            // Show input port for 'destination' if outgoing links are gone
            if (oldSource && oldSource.attr('metadata/name') === 'destination'
              /*&& graph.getConnectedLinks(oldSource, {outbound: true}).length === 0*/) {
                // No outgoing links -> hide stream name label
                // Set silently, last attr call would refresh the view
                (<any>oldSource).attr('.stream-label/display', 'none', {silent: true});

                //     // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
                //     oldSource.attr('.input-port/display', 'block');
            }
            // // Hide input port for destination if it has a new outgoing link
            if (newSource && newSource.attr('metadata/name') === 'destination') {
                // Has outgoing link, there shouldn't be any incoming links yet -> show stream name label
                // Set silently, last attr call would refresh the view
                (<any>newSource).attr('.stream-label/display', 'block', {silent: true});

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
                if (oldTarget.attr('metadata/name') === 'destination') {
                    // old target is a destination. Ensure output port is showing now since incoming links are gone

                    // No more incoming links, there shouldn't be any outgoing links yet -> indeterminate, hide stream label
                    // Set silently, last attr call would refresh the view
                    (<any>oldTarget).attr('.stream-label/display', 'none', {silent: true});

                    //     // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
                    //     oldTarget.attr('.output-port/display', 'block');
                }
            }
            const newTarget = graph.getCell(newTargetId);
            if (newTarget) {
                if (newTarget.attr('metadata/name') === 'destination') {
                    // Incoming link -> hide stream name label
                    // Set silently, last attr call would refresh the view
                    (<any>newTarget).attr('.stream-label/display', 'none', {silent: true});

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
        if (source && source.attr('metadata/name') === 'destination'
          && graph.getConnectedLinks(source, {outbound: true}).length === 0) {
            // No more outgoing links, can't be any incoming links yet -> indeterminate, hide stream name label
            // Set silently, last attr call would refresh the view
            (<any>source).attr('.stream-label/display', 'none', {silent: true});
            source.removeAttr('.input-port/display');
            view = flo.getPaper().findViewByModel(source);
            if (view) {
                (<any>view).update();
            }
        }
        if (target && target.attr('metadata/name') === 'destination'
          && graph.getConnectedLinks(target, {inbound: true}).length === 0) {
            // No more incoming links, there shouldn't be any outgoing links yet -> leave stream label hidden
            // Set silently, last attr call would refresh the view
            (<any>target).attr('.stream-label/display', 'none', {silent: true});
            target.removeAttr('.output-port/display');
            view = flo.getPaper().findViewByModel(target);
            if (view) {
                (<any>view).update();
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
        return `${source ? source.attr('metadata/name') : '?'} -> ${target ? target.attr('metadata/name') : '?'}`;
    }

    // Should pass use Flo.EditorContext and pass metadata, props etc.
    handleLinkInsertChannel(link: dia.Link, flo: Flo.EditorContext) {
        const graph = flo.getGraph();
        const source = graph.getCell(link.get('source').id);
        const target = graph.getCell(link.get('target').id);
        // Create a node
        this.metamodelService.load().then(mm => {

            let sourceName = source.attr('metadata/name');
            if (sourceName === 'destination') {
              sourceName = source.attr('props/name');
            }
            let targetName = target.attr('metadata/name');
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
              selector: '.output-port'
            });

            // New link to connect original source to new target
            flo.createLink(previousSource,
              {'id': newDestinationNode.id, 'port': 'input', 'selector': '.input-port'},
              null,
              new Map<string, any>().set('isTapLink', existingIsTap ? true : false));

            flo.performLayout();
        });
    }

    isChannel(e: dia.Cell): boolean {
        return e && (e.attr('metadata/name') === 'tap' || e.attr('metadata/name') === 'destination');
    }

    handleLinkSwitch(link: dia.Link, flo: Flo.EditorContext) {
        const graph = flo.getGraph();
        const source = graph.getCell(link.get('source').id);
        // var target = graph.getCell(link.get('target').id);
        const isTapLink = link.attr('props/isTapLink');
        // This does nothing if the source is a destination/tap - there are no tap links allowed from destinations
        if (this.isChannel(source)) {
            return;
        }
        if (isTapLink === true) {
            console.log(`Converting link ${this.toLinkString(graph, link)} into a primary link`);
            link.attr('props/isTapLink', false);
            // Need to ensure no other links are still primary, that isn't allowed
            const primaryLink = graph.getConnectedLinks(source, {outbound: true})
                .find(l => l !== link && l.attr('props/isTapLink'));
            if (primaryLink) {
                primaryLink.attr('props/isTapLink', true);
                this.refreshVisuals(primaryLink, 'props/isTapLink', flo.getPaper());
            }
        } else {
            console.log(`Converting link ${this.toLinkString(graph, link)} into a tap link`);
            link.attr('props/isTapLink', true);
        }
        this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
    }

    handleLinkAdded(link: dia.Link, flo: Flo.EditorContext) {
        const graph = flo.getGraph();
        const source = graph.getCell(link.get('source').id);
        const target = graph.getCell(link.get('target').id);
        console.log('render-service.handleLinkAdded');
        if (!target && source && !this.isChannel(source)) {
            // this is a new link being drawn in the UI (it is not connected to anything yet).
            // Need to decide whether to make it a tap link
            const outgoingLinks = graph.getConnectedLinks(source, {outbound: true});
            const primaryLinkExists = outgoingLinks.find(ol => ol !== link && !ol.attr('props/isTapLink')) ? true : false;
            link.attr('props/isTapLink', primaryLinkExists ? true : false);
        }
        if (link.attr('props/isTapLink') === true) {
            this.refreshVisuals(link, 'props/isTapLink', flo.getPaper());
        }
        if (source && source.attr('metadata/name') === 'destination' && target) {
            // A link is added from a source destination to a target. In these cases the
            // target will show the label (whether a real app or another destination).
            // This is done so that if a destination is connected to 5 outputs, this destination
            // won't track the 5 stream names, the nodes it links to will instead.
            target.attr('.stream-label/display', 'block'); // , { silent: true });
        }
        if (target && target.attr('metadata/name') === 'destination') {
            // Incoming link has been added -> hide stream label
            // Set silently because update will be called for the next property setting
            (<any>target).attr('.stream-label/display', 'none', {silent: true});
            // XXX target.attr('.output-port/display', 'none');
        }
        // If tap link has been added update the stream-label for the target
        if (link.attr('props/isTapLink') && target) {
            target.attr('.stream-label/display', 'block');
        }
    }

    handleLinkEvent(flo: Flo.EditorContext, event: string, link: dia.Link) {
        if (event === 'change:source') {
            this.handleLinkSourceChanged(link, flo);
        } else if (event === 'change:target') {
            this.handleLinkTargetChanged(link, flo);
        } else if (event === 'remove') {
            this.handleLinkRemoved(link, flo);
        } else if (event === 'add') {
            this.handleLinkAdded(link, flo);
            flo.getPaper().findViewByModel(link).on('switch', () => this.handleLinkEvent(flo, 'switch', link));
            flo.getPaper().findViewByModel(link).on('insert-channel', () => this.handleLinkEvent(flo, 'insert-channel', link));
        } else if (event === 'switch') {
            this.handleLinkSwitch(link, flo);
        } else if (event === 'insert-channel') {
            this.handleLinkInsertChannel(link, flo);
        }
    }

    getLinkAnchorPoint(linkView: dia.LinkView, view: dia.ElementView, magnet: SVGElement, reference: dia.Point) {
        if (magnet) {
            const paper: dia.Paper = (<any>linkView).paper;
            const type = magnet.getAttribute('type');
            const bbox = joint.V(magnet).bbox(false, paper.viewport);
            const rect = joint.g.rect(bbox);
            if (type === 'input') {
                return joint.g.point(rect.x, rect.y + rect.height / 2);
            } else {
                return joint.g.point(rect.x + rect.width, rect.y + rect.height / 2);
            }
        } else {
            return reference;
        }
    }

  getNodeView(): dia.ElementView {

      const self = this;

      return joint.shapes.flo.ElementView.extend({
          options: joint.util.deepSupplement({}, joint.dia.ElementView.prototype.options),

          renderMarkup: function () {
            // Not called often. It's fine to destro old component and create the new one, because old DOM
            // may have been aletered by JointJS updates
            if (self.componentFactoryResolver && ELEMENT_TYPE_COMPONENT_TYPE.has(this.model.get('type'))) {

              if (this._angularComponentRef) {
                this._angularComponentRef.destroy();
              }

              const nodeComponentFactory = self.componentFactoryResolver
                .resolveComponentFactory(ELEMENT_TYPE_COMPONENT_TYPE.get(this.model.get('type')));

              const componentRef: ComponentRef<ElementComponent> = nodeComponentFactory.create(self.injector);
              self.applicationRef.attachView(componentRef.hostView);
              componentRef.instance.view = this;
              this._angularComponentRef = componentRef;
              const nodes = [];
              for (let i = 0; i < this._angularComponentRef.location.nativeElement.children.length; i++) {
                nodes.push(this._angularComponentRef.location.nativeElement.children.item(i));
              }

              const vNodes = nodes.map(childNode => new joint.V(childNode));
              this.vel.append(vNodes);

              this._angularComponentRef.changeDetectorRef.markForCheck();
              this._angularComponentRef.changeDetectorRef.detectChanges();
            } else {
              joint.dia.ElementView.prototype.renderMarkup.apply(this, arguments);
            }
          },

          onRemove: function() {
            if (this._angularComponentRef) {
              this._angularComponentRef.destroy();
            }
            joint.dia.ElementView.prototype.onRemove.apply(this, arguments);
          },

    });

  }

  getLinkView(): dia.LinkView {
      const self = this;

      const V = joint.V;
      const g = joint.g;

      return joint.shapes.flo.LinkView.extend({

        renderLabels: function() {

          if (!this._V.labels) {
            return this;
          }

          if (this._angularComponentRef) {
            Object.keys(this._angularComponentRef).forEach(k => this._angularComponentRef[k].destroy());
            this._angularComponentRef = {};
          }

          this._labelCache = {};
          const $labels = $(this._V.labels.node).empty();

          const labels = this.model.get('labels') || [];
          if (!labels.length) {
            return this;
          }

          const labelTemplate = joint.util.template(this.model.get('labelMarkup') || this.model.labelMarkup);
          // This is a prepared instance of a vectorized SVGDOM node for the label element resulting from
          // compilation of the labelTemplate. The purpose is that all labels will just `clone()` this
          // node to create a duplicate.
          const labelNodeInstance = V(labelTemplate());

          const canLabelMove = this.can('labelMove');

          _.each(labels, function(label: any, idx) {

            let labelNode;

            if (self.componentFactoryResolver && LINK_LABEL_COMPONENT_TYPE.has(label.type)) {
              // Inject link label component and take its DOM
              if (this._angularComponentRef && this._angularComponentRef[idx]) {
                this._angularComponentRef[idx].destroy();
              }

              const nodeComponentFactory = self.componentFactoryResolver
                .resolveComponentFactory(LINK_LABEL_COMPONENT_TYPE.get(label.type));

              const componentRef: ComponentRef<BaseShapeComponent> = nodeComponentFactory.create(self.injector);

              if (!this._angularComponentRef) {
                this._angularComponentRef = {};
              }

              this._angularComponentRef[idx] = componentRef;
              this._angularComponentRef[idx].changeDetectorRef.markForCheck();

              self.applicationRef.attachView(componentRef.hostView);
              componentRef.instance.data = label;
              this._angularComponentRef[idx].changeDetectorRef.detectChanges();

              labelNode = this._angularComponentRef[idx].location.nativeElement.children.item(0);
            } else {
              // Default JointJS behaviour
              labelNode = labelNodeInstance.clone().node;
            }

            V(labelNode).attr('label-idx', idx);
            if (canLabelMove) {
              V(labelNode).attr('cursor', 'move');
            }

            // Cache label nodes so that the `updateLabels()` can just update the label node positions.
            this._labelCache[idx] = V(labelNode);

            const $text = $(labelNode).find('text');
            const $rect = $(labelNode).find('rect');

            // Text attributes with the default `text-anchor` and font-size set.
            const textAttributes = _.extend({ 'text-anchor': 'middle', 'font-size': 14 }, joint.util.getByPath(label, 'attrs/text', '/'));

            $text.attr(_.omit(textAttributes, 'text'));

            if (!_.isUndefined(textAttributes.text)) {

              V($text[0]).text(textAttributes.text + '', { annotations: textAttributes.annotations });

            }

            // Note that we first need to append the `<text>` element to the DOM in order to
            // get its bounding box.
            $labels.append(labelNode);

            // `y-alignment` - center the text element around its y coordinate.
            const textBbox = V($text[0]).bbox(true, $labels[0]);
            V($text[0]).translate(0, -textBbox.height / 2);

            // Add default values.
            const rectAttributes = _.extend({

              fill: 'white',
              rx: 3,
              ry: 3

            }, joint.util.getByPath(label, 'attrs/rect', '/'));

            const padding = 1;

            $rect.attr(_.extend(rectAttributes, {
              x: textBbox.x - padding,
              y: textBbox.y - padding - textBbox.height / 2,  // Take into account the y-alignment translation.
              width: textBbox.width + 2 * padding,
              height: textBbox.height + 2 * padding
            }));

          }, this);

          return this;
        },

        onRemove: function() {
          if (this._angularComponentRef) {
            Object.keys(this._angularComponentRef).forEach(k => this._angularComponentRef[k].destroy());
          }
          joint.dia.LinkView.prototype.onRemove.apply(this, arguments);
        },

      });
  }


}
