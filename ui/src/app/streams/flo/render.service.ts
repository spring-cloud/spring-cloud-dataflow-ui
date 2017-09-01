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

import './shapes';
import { IMAGE_W, HORIZONTAL_PADDING } from './shapes';
import { Injectable } from '@angular/core';
import { ApplicationType } from '../../shared/model/application-type';
import { MetamodelService } from './metamodel.service';
import { Flo, Constants } from 'spring-flo';
import { dia } from 'jointjs';
import { Utils } from './utils';
import { layout } from './layout';
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
        .set('task', '☉')//2609   ⚙=2699 gear (rubbish)
        .set('destination', '⦂') // 2982
        .set('tap', '⦂') // 2982
    ;



/**
 * Render Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class RenderService implements Flo.Renderer {

    constructor(private metamodelService: MetamodelService) {
    }

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
        let label: string = node.attr(labelPath);
        if (label && label.length < 9) {
            return;
        }
        let view = paper.findViewByModel(node);
        if (view && label) {
            let textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
            let offset = 0;
            if (node.attr('.label2/text')) {
                let label2View = view.findBySelector('.label2')[0];
                if (label2View) {
                    let box = joint.V(label2View).bbox(false, paper.viewport);
                    offset = HORIZONTAL_PADDING + box.width;
                }
            }
            let width = joint.V(textView).bbox(false, paper.viewport).width;
            let threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING - offset;
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
        link.attr('metadata/metadata/unselectable', 'true');
        // var isTapLink = link.attr('props/isTapLink');
        // if (isTapLink === 'true') {
        //     var linkView = paperAndGraph.paper.findViewByModel(link);
        //     _.each(linkView.el.querySelectorAll('.connection, .marker-source, .marker-target'), function(connection) {
        //         joint.V(connection).addClass('tapped-output-from-app');
        //     });
        // }
        // TODO remove this on link delete !!
        // paperAndGraph.paper.findViewByModel(link).on('switch',function() {
        //     handleLinkEvent(paperAndGraph.paper, 'switch', link);
        // });
    }

    isSemanticProperty(propertyPath: string): boolean {
        return propertyPath === 'node-name' || propertyPath === 'stream-name';
    }

    refreshVisuals(cell: dia.Cell, changedPropertyPath: string, paper: dia.Paper): void {
        let metadata: Flo.ElementMetadata = cell.attr('metadata');
        let type = metadata ? metadata.name : undefined;

        if (cell instanceof joint.dia.Element) {
            let element = <dia.Element> cell;
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
                //TODO: Reevaluate when get to `code-editor` directive migration
                // metadata.properties().then(properties => {
                //     if (properties.get('script') && properties.get('script').source) {
                //         properties.get('script').source.type = element.attr('props/language');
                //         properties.get('script').source.mime = element.attr('props/language') === 'javascript' ? 'text/javascript' : 'text/x-' + element.attr('props/language');
                //     }
                // });
            } else if (changedPropertyPath === 'node-name') {
                let nodeName = element.attr('node-name');
                // fitLabel() calls update as necessary, so set label text silently
                element.attr('.label1/text', nodeName ? nodeName : element.attr('metadata/name'));
                this.fitLabel(paper, element, '.label1/text');
            }
        }

        if (cell instanceof joint.dia.Link) {
            let link = <dia.Link> cell;
            if (changedPropertyPath === 'props/isTapLink') {
                let isTapLink = link.attr('props/isTapLink');
                let linkView = paper.findViewByModel(link);
                console.log('Adjusting link class isTapLink?' + isTapLink);
                //TODO: Check if need to switch bacl to _.each(...)
                if (isTapLink === 'true') {
                    linkView.el.querySelectorAll('.connection, .marker-source, .marker-target').forEach(connection => joint.V(connection).addClass('tapped-output-from-app'));
                } else {
                    linkView.el.querySelectorAll('.connection, .marker-source, .marker-target').forEach(connection => joint.V(connection).removeClass('tapped-output-from-app'));
                }
            }
            console.log('link being refreshed');
        }
    }

    initializeNewNode(node: dia.Element, viewerDescriptor: Flo.ViewerDescriptor): void {
        let metadata: Flo.ElementMetadata = node.attr('metadata');
        if (metadata) {
            let paper = viewerDescriptor.paper;
            if (paper) {
                let isPalette = paper.model.get('type') === joint.shapes.flo.PALETTE_TYPE;
                let isCanvas = paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE;
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

    handleLinkSourceChanged(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let newSourceId = link.get('source').id;
        let oldSourceId = link.previous('source').id;
        let targetId = link.get('target').id;
        if (newSourceId !== oldSourceId) {
            let newSource = graph.getCell(newSourceId);
            let oldSource = graph.getCell(oldSourceId);
            let target = graph.getCell(targetId);
            // Show input port for 'destination' if outgoing links are gone
            if (oldSource && oldSource.attr('metadata/name') === 'destination' /*&& graph.getConnectedLinks(oldSource, {outbound: true}).length === 0*/) {
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
            //TODO: Isn't tap port removed?
            if (target) {
                if (link.previous('source').port === 'tap') {
                    target.attr('.stream-label/display', 'none');
                }
                if (link.get('source').port === 'tap') {
                    target.attr('.stream-label/display', 'block');
                }
            }
        }
    }

    handleLinkTargetChanged(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let newTargetId = link.get('target').id;
        let oldTargetId = link.previous('target').id;
        if (newTargetId !== oldTargetId) {
            let oldTarget = graph.getCell(oldTargetId);
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
            let newTarget = graph.getCell(newTargetId);
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
            //TODO: Isn't tap port removed?
            if (link.get('source').port === 'tap') {
                if (oldTarget) {
                    oldTarget.attr('.stream-label/display', 'none');
                }
                if (newTarget) {
                    newTarget.attr('.stream-label/display', 'block');
                }
            }

        }
    }

    handleLinkRemoved(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let source = graph.getCell(link.get('source').id);
        let target = graph.getCell(link.get('target').id);
        let view: dia.CellView;
        if (source && source.attr('metadata/name') === 'destination' && graph.getConnectedLinks(source, {outbound: true}).length === 0) {
            // No more outgoing links, can't be any incoming links yet -> indeterminate, hide stream name label
            // Set silently, last attr call would refresh the view
            (<any>source).attr('.stream-label/display', 'none', {silent: true});
            source.removeAttr('.input-port/display');
            view = paper.findViewByModel(source);
            if (view) {
                (<any>view).update();
            }
        }
        if (target && target.attr('metadata/name') === 'destination' && graph.getConnectedLinks(target, {inbound: true}).length === 0) {
            // No more incoming links, there shouldn't be any outgoing links yet -> leave stream label hidden
            // Set silently, last attr call would refresh the view
            (<any>target).attr('.stream-label/display', 'none', {silent: true});
            target.removeAttr('.output-port/display');
            view = paper.findViewByModel(target);
            if (view) {
                (<any>view).update();
            }
        }
        // If tap link is removed update stream-name value for the target, i.e. don't display stream anymore
        //TODO: Isn't tap port removed?
        if (link.get('source').port === 'tap' && target) {
            target.attr('.stream-label/display', 'none');
        }
    }

    toLinkString(graph: dia.Graph, link: dia.Link): string {
        let source = graph.getCell(link.get('source').id);
        let target = graph.getCell(link.get('target').id);
        return `${source ? source.attr('metadata/name') : '?'} -> ${target ? target.attr('metadata/name') : '?'}`;
    }

    //TODO: Rewrite this! Should be creating elements on the graph manually! Should pass use Flo.EditorContext and pass metadata, props etc.
    handleLinkInsertChannel(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let source = graph.getCell(link.get('source').id);
        let target = graph.getCell(link.get('target').id);
        // Create a node
        this.metamodelService.load().then(mm => {
            let metadata = Flo.getMetadata(mm, 'destination', 'other');
            let newDestinationNode = new joint.shapes.flo.Destination(
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
                            'text': metadata.metadata.unicodeChar
                        }
                    }
                }, joint.shapes.flo.Destination.prototype.defaults)
            );

            let sourceName = source.attr('metadata/name');
            if (sourceName === 'destination') {
                sourceName = source.attr('props/name');
            }
            let targetName = target.attr('metadata/name');
            if (targetName === 'destination') {
                targetName = target.attr('props/name');
            }

            newDestinationNode.set('type', joint.shapes.flo.NODE_TYPE);
            newDestinationNode.attr('props', {'name': sourceName + '-' + targetName});
            newDestinationNode.attr('metadata', metadata);
            graph.addCell(newDestinationNode);
            let nodeView = paper.findViewByModel(newDestinationNode);
            this.initializeNewNode(<dia.Element>nodeView.model, {'paper': paper, 'graph': graph});

            // Adjust existing link to hit this channel
            let previousSource = link.get('source');
            let existingIsTap = (link.attr('props/isTapLink') === 'true');
            link.set('source', {'id': newDestinationNode.id, 'port': 'output', 'selector': '.output-port'});

            // New link to connect original source to new target
            let newlink = this.createLink(null, null);
            newlink.set('target', {'id': newDestinationNode.id, 'port': 'input', 'selector': '.input-port'});
            newlink.set('source', previousSource);
            newlink.set('type', joint.shapes.flo.LINK_TYPE);
            newlink.attr('metadata', {});
            graph.addCell(newlink);
            newlink.attr('.marker-vertices/display', 'none');
            newlink.attr('props/isTapLink', existingIsTap ? 'true' : 'false');
            this.initializeNewLink(newlink, {'paper': paper, 'graph': graph});
            this.layout(paper);
        });
    }

    handleLinkSwitch(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let source = graph.getCell(link.get('source').id);
        // var target = graph.getCell(link.get('target').id);
        let isTapLink = (link.attr('props/isTapLink') === 'true');
        if (isTapLink) {
            console.log(`Converting link ${this.toLinkString(graph, link)} into a primary link`);
            link.attr('props/isTapLink', 'false');
            // Need to ensure no other links are still primary, that isn't allowed
            let primaryLink = graph.getConnectedLinks(source, {outbound: true})
                .find(l => l !== link && l.attr('props/isTapLink') !== 'true');
            if (primaryLink) {
                primaryLink.attr('props/isTapLink', 'true');
                this.refreshVisuals(primaryLink, 'props/isTapLink', paper);
            }
        } else {
            console.log(`Converting link ${this.toLinkString(graph, link)} into a tap link`);
            link.attr('props/isTapLink', 'true');
        }
        this.refreshVisuals(link, 'props/isTapLink', paper);
        // if (source) {
        //     var outputLinks = graph.getConnectedLinks(source, {outbound: true});
        //     var isPrimaryLink = true;
        //     for (var i=0;i<outputLinks.length;i++) {
        //         var ol = outputLinks[i];
        //         if (ol === link || (ol.attr('props/isTapLink')==='true')) {
        //             continue;
        //         }
        //         isPrimaryLink = false;
        //         break;
        //     }
        //     console.log("marking primary? "+isPrimaryLink);
        //     link.attr('props/isTapLink',isPrimaryLink?'false':'true');
        //     refreshVisuals(link, 'props/isTapLink', paper);
        // }
    }

    handleLinkAdded(link: dia.Link, paper: dia.Paper) {
        let graph = paper.model;
        let source = graph.getCell(link.get('source').id);
        let target = graph.getCell(link.get('target').id);
        console.log('render-service.handleLinkAdded');
        if (source) {
            let nonPrimaryLink = graph.getConnectedLinks(source, {outbound: true})
                .find(ol => ol !== link && ol.attr('props/isTapLink') !== 'true');

            link.attr('props/isTapLink', nonPrimaryLink ? 'true' : 'false');
            this.refreshVisuals(link, 'props/isTapLink', paper);
        }
        if (source && source.attr('metadata/name') === 'destination' && target) {
            // A link is added from a source destination to a target. In these cases the
            // target will show the label (whether a real app or another destination).
            // This is done so that if a destination is connected to 5 outputs, this destination
            // won't track the 5 stream names, the nodes it links to will instead.
            target.attr('.stream-label/display', 'block');//, { silent: true });
        }
        if (target && target.attr('metadata/name') === 'destination') {
            // Incoming link has been added -> hide stream label
            // Set silently because update will be called for the next property setting
            (<any>target).attr('.stream-label/display', 'none', {silent: true});
            // XXX target.attr('.output-port/display', 'none');
        }
        // If tap link has been added update the stream-label for the target
        //TODO: Tap port? Isn't it removed?
        if (link.get('source').port === 'tap' && target) {
            target.attr('.stream-label/display', 'block');
        }
    }

    handleLinkEvent(paper: dia.Paper, event: string, link: dia.Link) {
        if (event === 'change:source') {
            this.handleLinkSourceChanged(link, paper);
        } else if (event === 'change:target') {
            this.handleLinkTargetChanged(link, paper);
        } else if (event === 'remove') {
            this.handleLinkRemoved(link, paper);
        } else if (event === 'add') {
            this.handleLinkAdded(link, paper);
            paper.findViewByModel(link).on('switch', () => this.handleLinkEvent(paper, 'switch', link));
            paper.findViewByModel(link).on('insert-channel', () => this.handleLinkEvent(paper, 'insert-channel', link));
        } else if (event === 'switch') {
            this.handleLinkSwitch(link, paper);
        } else if (event === 'insert-channel') {
            this.handleLinkInsertChannel(link, paper);
        }
    }

    getLinkAnchorPoint(linkView: dia.LinkView, view: dia.ElementView, magnet: SVGElement, reference: dia.Point) {
        if (magnet) {
            let paper: dia.Paper = (<any>linkView).paper;
            let type = magnet.getAttribute('type');
            let bbox = joint.V(magnet).bbox(false, paper.viewport);
            let rect = joint.g.rect(bbox);
            if (type === 'input') {
                return joint.g.point(rect.x, rect.y + rect.height / 2);
            } else {
                return joint.g.point(rect.x + rect.width, rect.y + rect.height / 2);
            }
        } else {
            return reference;
        }
    }

}
