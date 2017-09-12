/*
 * Copyright 2015-2017 the original author or authors.
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

import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { ApplicationType } from '../../shared/model/application-type';
import { Flo, Constants } from 'spring-flo';
import { dia } from 'jointjs';
import { PropertiesDialogComponent } from './properties/properties-dialog.component';
import { Utils } from './support/utils';
import * as _joint from 'jointjs';
const joint: any = _joint;

const NODE_DROPPING = false;

/**
 * Editor Service for Flo based Stream Definition Graph editor.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
@Injectable()
export class EditorService implements Flo.Editor {

    constructor(private bsModalService: BsModalService) {}

    createHandles(flo: Flo.EditorContext, createHandle: (owner: dia.CellView, kind: string,
                                                         action: () => void, location: dia.Point) => void, owner: dia.CellView): void {
        if (owner.model instanceof joint.dia.Link) {
            return;
        } else if (owner.model instanceof joint.dia.Element) {
            const element = <dia.Element> owner.model;
            const bbox = element.getBBox();

            // Delete handle
            let pt = (<any>bbox).origin().offset(bbox.width + 3, bbox.height + 3);
            createHandle(owner, Constants.REMOVE_HANDLE_TYPE, flo.deleteSelectedNode, pt);

            // Properties handle
            if (!element.attr('metadata/unresolved')) {
                pt = (<any>bbox).origin().offset(-14, bbox.height + 3);
                createHandle(owner, Constants.PROPERTIES_HANDLE_TYPE, () => {
                    const modalRef = this.bsModalService.show(PropertiesDialogComponent);
                    modalRef.content.title = `Properties for ${element.attr('metadata/name').toUpperCase()}`;
                    modalRef.content.setData(element, flo.getGraph());
                }, pt);
            }
        }
    }

    validateLink(flo: Flo.EditorContext, cellViewS: dia.ElementView, magnetS: SVGElement,
                 cellViewT: dia.ElementView, magnetT: SVGElement, isSource: boolean, linkView: dia.LinkView): boolean {
        let idx: number;

        // Prevent linking FROM node input port
        if (magnetS && magnetS.getAttribute('type') === 'input') {
            return false;
        }

        // Prevent linking from output port to input port of same element.
        if (cellViewS === cellViewT) {
            return false;
        }

        // Prevent linking TO node output port
        if (magnetT && magnetT.getAttribute('type') === 'output') {
            return false;
        }

        const graph = flo.getGraph();

        if (cellViewS.model.attr) {
            const currentSourceLinks = graph.getConnectedLinks(cellViewS.model, { outbound: true });
            idx = currentSourceLinks.indexOf(linkView.model);
            // For a second link we will see:
            // Index into outgoing source links for this link = 1 link count = 2
            // if (idx > 0) {
            //     // Dash the link
            //     _.each(linkView.el.querySelectorAll('.connection, .marker-source, .marker-target'), function(connection) {
            //         joint.V(connection).addClass('tapped-output-from-app');
            //     });
            // }
        }

        if (cellViewS.model.attr('metadata') && cellViewT.model.attr('metadata')) {
            // Target is a SOURCE node? Disallow link!
            if (cellViewT.model.attr('metadata/group') === ApplicationType[ApplicationType.source]) {
                return false;
            }
            // Target is an explicit tap? Disallow link!
            if (cellViewT.model.attr('metadata/name') === 'tap') {
                return false;
            }
            // Sinks and Tasks cannot have outgoing links
            if (cellViewS.model.attr('metadata/group') === ApplicationType[ApplicationType.sink] ||
                cellViewS.model.attr('metadata/group') === ApplicationType[ApplicationType.task]) {
                return false;
            }

            const targetIncomingLinks = graph.getConnectedLinks(cellViewT.model, { inbound: true });
            idx = targetIncomingLinks.indexOf(linkView.model);
            if (idx >= 0) {
                targetIncomingLinks.splice(idx, 1);
            }
            const outgoingSourceLinks = graph.getConnectedLinks(cellViewS.model, { outbound: true });
            idx = outgoingSourceLinks.indexOf(linkView.model);
            if (idx >= 0) {
                outgoingSourceLinks.splice(idx, 1);
            }

            if (targetIncomingLinks.length > 0) {
                // It is ok if the target is a destination
                if (cellViewT.model.attr('metadata/name') !== 'destination') {
                    return false;
                }
            }

            if (outgoingSourceLinks.length > 0) {
                // Make sure there is no link between this source and target already
                const anotherLink = outgoingSourceLinks
                    .map(l => l.get('target').id)
                    .filter(id => typeof id === 'string')
                    .map(id => graph.getCell(id))
                    .find(t => t && t === cellViewT.model);
                if (anotherLink) {
                    return false;
                }

                // Invalid if output-port has more than one outgoing link (if not destination)
                // if (magnetS.getAttribute('class') === 'output-port' &&
                //     cellViewS.model.attr('metadata/name') !== 'destination') {
                //     for (i = 0; i < outgoingSourceLinks.length; i++) {
                //         var selector = outgoingSourceLinks[i].get('source').selector;
                //         // Another link from the 'output-port' is present
                //         if (selector) {
                //             var port = cellViewS.el.querySelector(selector);
                //             if (port && port.getAttribute('class') === 'output-port') {
                //                 return false;
                //             }
                //         }
                //     }
                // }
            }

            // All checks passed, valid connection.
            return true;
        }
    }

    private getOutgoingStreamLinks(graph: dia.Graph, node: dia.Element): Array<dia.Link> {
        // !node only possible if call is occurring during link drawing (one end connected but not the other)
        return node ? graph.getConnectedLinks(node, {outbound: true})
            .filter(link => link.get('source') && link.get('source').port === 'output') : [];
    }

    calculateDragDescriptor(flo: Flo.EditorContext, draggedView: dia.CellView, viewUnderMouse: dia.CellView,
                            point: dia.Point, sourceComponent: string): Flo.DnDDescriptor {
        const source = draggedView.model;
        const paper = flo.getPaper();
        const targetUnderMouse = viewUnderMouse ? viewUnderMouse.model : undefined;
        // If node dropping not enabled then short-circuit
        if (!NODE_DROPPING && !(targetUnderMouse instanceof joint.dia.Link
          && targetUnderMouse.attr('metadata/name') !== 'tap'
          && targetUnderMouse.attr('metadata/name') !== 'destination')) {
          return {
            sourceComponent: sourceComponent,
            source: {
              view: draggedView
            }
          };
        }
        // check if it's a tap being dragged
        if ((targetUnderMouse instanceof joint.dia.Element) && source.attr('metadata/name') === 'tap') {
            return {
                sourceComponent: sourceComponent,
                source: {
                    view: draggedView
                },
                target: {
                    view: viewUnderMouse
                }
            };
        }

        // Find closest port
        const range = 30;
        const graph = flo.getGraph();
        let closestData: Flo.DnDDescriptor;
        let minDistance = Number.MAX_VALUE;
        const hasIncomingPort = draggedView.model.attr('.input-port') && draggedView.model.attr('.input-port/display') !== 'none';
        // Ignore tap-port for the dragged view. Only allow making connections to/from input and output port for node-on-node DnD
        const hasOutgoingPort = draggedView.model.attr('.output-port') && draggedView.model.attr('.output-port/display') !== 'none';
        if (!hasIncomingPort && !hasOutgoingPort) {
            return;
        }
        const elements = graph.findModelsInArea(joint.g.rect(point.x - range, point.y - range, 2 * range, 2 * range));
        if (Array.isArray(elements)) {
            elements.forEach(function(model) {
                const view = paper.findViewByModel(model);
                if (view && view !== draggedView && model instanceof joint.dia.Element) {
                    const targetHasIncomingPort = view.model.attr('.input-port')
                      && view.model.attr('.input-port/display') !== 'none';
                    // 2 output ports: output-port and tap-port
                    const targetHasOutgoingPort = (view.model.attr('.output-port')
                      && view.model.attr('.output-port/display') !== 'none') ||
                        view.model.attr('.tap-port') && view.model.attr('.tap-port/display') !== 'none';
                    view.$('[magnet]').each((index, magnet) => {
                        const type = magnet.getAttribute('type');
                        if ((type === 'input' && targetHasIncomingPort && hasOutgoingPort)
                          || (type === 'output' && targetHasOutgoingPort && hasIncomingPort)) {
                            const bbox = joint.V(magnet).bbox(false, paper.viewport);
                            const distance = (<any>point).distance({
                                x: bbox.x + bbox.width / 2,
                                y: bbox.y + bbox.height / 2
                            });
                            if (distance < range && distance < minDistance) {
                                minDistance = distance;
                                closestData = {
                                    sourceComponent: sourceComponent,
                                    source: {
                                        cssClassSelector: type === 'output' ? '.input-port' : '.output-port',
                                        view: draggedView
                                    },
                                    target: {
                                        cssClassSelector: '.' + magnet.getAttribute('class').split(/\s+/)[0],
                                        view: view
                                    },
                                    range: minDistance
                                };
                            }
                        }
                    });
                }
            });
        }
        if (closestData) {
           return closestData;
        }

        // Check if drop on a link is allowed
        const sourceType = source.attr('metadata/name');
        const sourceGroup = source.attr('metadata/group');
        if (targetUnderMouse instanceof joint.dia.Link && !(sourceType === 'destination'
          || sourceGroup === 'sink' || sourceGroup === 'source') && graph.getConnectedLinks(source).length === 0) {
            return {
                sourceComponent: sourceComponent,
                source: {
                    view: draggedView
                },
                target: {
                    view: paper.findViewByModel(targetUnderMouse)
                }
            };
        }
    }

    private validateSource(element: dia.Element, incoming: Array<dia.Link>,
                           outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        if (incoming.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Sources must appear at the start of a stream',
                range: element.attr('range')
            });
        }
        if (outgoing.length === 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Should direct its output to an app',
                range: element.attr('range')
            });
        }
    }

    private validateProcessor(element: dia.Element, incoming: Array<dia.Link>,
                              outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        if (incoming.length !== 1) {
            errors.push({
                severity: Flo.Severity.Error,
                message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                range: element.attr('range')
            });
        }
        if (outgoing.length === 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Should direct its output to an app',
                range: element.attr('range')
            });
        }
    }

    private validateSink(element: dia.Element, incoming: Array<dia.Link>,
                         outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        if (incoming.length !== 1) {
            errors.push({
                severity: Flo.Severity.Error,
                message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                range: element.attr('range')
            });
        }
        if (outgoing.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Sink should be at the end of a stream',
                range: element.attr('range')
            });
        }
        if (tap.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Cannot tap into a sink app',
                range: element.attr('range')
            });
        }
    }

    private validateTask(element: dia.Element, incoming: Array<dia.Link>,
                         outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        if (incoming.length !== 1) {
            errors.push({
                severity: Flo.Severity.Error,
                message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                range: element.attr('range')
            });
        }
        if (outgoing.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Task should be at the end of a stream',
                range: element.attr('range')
            });
        }
        if (tap.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Cannot tap into a task app',
                range: element.attr('range')
            });
        }
    }

    private validateTap(element: dia.Element, incoming: Array<dia.Link>,
                        outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        if (incoming.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Tap must appear at the start of a stream',
                range: element.attr('range')
            });
        }
        if (outgoing.length === 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Should direct its output to an app',
                range: element.attr('range')
            });
        }
        if (tap.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Cannot tap into a tap app',
                range: element.attr('range')
            });
        }
    }

    private validateDestination(element: dia.Element, incoming: Array<dia.Link>,
                                outgoing: Array<dia.Link>, tap: Array<dia.Link>, errors: Array<Flo.Marker>) {
        // TODO: no 'tap' port anymore hence no more such links
        if (tap.length !== 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Cannot tap into a destination app',
                range: element.attr('range')
            });
        }
    }

    private validateConnectedLinks(graph: dia.Graph, element: dia.Element, errors: Array<Flo.Marker>) {
        const group = element.attr('metadata/group');
        const type = element.attr('metadata/name');
        const incoming: Array<dia.Link> = [];
        const outgoing: Array<dia.Link> = [];
        const tap: Array<dia.Link> = [];
        const invalidIncoming: Array<dia.Link> = [];
        const invalidOutgoing: Array<dia.Link> = [];
        let port: string;

        graph.getConnectedLinks(element).forEach(link => {
            if (link.get('source').id === element.id) {
                port = link.get('source').port;
                if (port === 'output') {
                    outgoing.push(link);
                } else if (port === 'tap') {
                    tap.push(link);
                } else {
                    invalidOutgoing.push(link);
                }
            } else if (link.get('target').id === element.id) {
                port = link.get('target').port;
                if (port === 'input') {
                    incoming.push(link);
                } else {
                    invalidIncoming.push(link);
                }
            }
        });

        if (invalidIncoming.length > 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Invalid incoming link' + (invalidIncoming.length > 1 ? 's' : ''),
                range: element.attr('range')
            });
        }

        if (invalidOutgoing.length > 0) {
            errors.push({
                severity: Flo.Severity.Error,
                message: 'Invalid outgoing link' + (invalidOutgoing.length > 1 ? 's' : ''),
                range: element.attr('range')
            });
        }

        switch (group) {
            case ApplicationType[ApplicationType.source]:
                this.validateSource(element, incoming, outgoing, tap, errors);
                break;
            case ApplicationType[ApplicationType.processor]:
                this.validateProcessor(element, incoming, outgoing, tap, errors);
                break;
            case ApplicationType[ApplicationType.sink]:
                this.validateSink(element, incoming, outgoing, tap, errors);
                break;
            case ApplicationType[ApplicationType.task]:
                this.validateTask(element, incoming, outgoing, tap, errors);
                break;
            default:
                if (type === 'tap') {
                    this.validateTap(element, incoming, outgoing, tap, errors);
                } else if (type === 'destination') {
                    this.validateDestination(element, incoming, outgoing, tap, errors);
                }
        }
    }

    private validateProperties(element: dia.Element, errors: Array<Flo.Marker>) {
        // If possible, verify the properties specified match those allowed on this type of element
        // propertiesRanges are the ranges for each property included the entire '--name=value'.
        // The format of a range is {'start':{'ch':NNNN,'line':NNNN},'end':{'ch':NNNN,'line':NNNN}}
        const propertiesRanges = element.attr('propertiesranges');
        if (propertiesRanges) {
            const appSchema = element.attr('metadata');
            // Grab the list of supported properties for this app type
            appSchema.properties().then(appSchemaProperties => {
                if (!appSchemaProperties) {
                    appSchemaProperties = new Map<string, Flo.PropertyMetadata>();
                }
                // Example appSchemaProperties:
                // {"host":{"name":"host","type":"String",
                // "description":"the hostname of the mail server","defaultValue":"localhost","hidden":false},
                //  "password":{"name":"password","type":"String",
                //  "description":"the password to use to connect to the mail server ","defaultValue":null,"hidden":false}
                const specifiedProperties = element.attr('props');
                Object.keys(specifiedProperties).forEach(propertyName => {
                    if (!appSchemaProperties.has(propertyName)) {
                        // The schema does not mention that property
                        const propertyRange = propertiesRanges[propertyName];
                        if (propertyRange) {
                            errors.push({
                                severity: Flo.Severity.Error,
                                message: 'unrecognized option \'' + propertyName + '\' for app \'' + element.attr('metadata/name') + '\'',
                                range: propertyRange
                            });
                        }
                    }
                });
            });
        }
    }

    private validateMetadata(element: dia.Cell, errors: Array<Flo.Marker>) {
        // Unresolved elements validation
        if (!element.attr('metadata') || element.attr('metadata/unresolved')) {
            let msg = 'Unknown element \'' + element.attr('metadata/name') + '\'';
            if (element.attr('metadata/group')) {
                msg += ' from group \'' + element.attr('metadata/group') + '\'.';
            }
            errors.push({
                severity: Flo.Severity.Error,
                message: msg,
                range: element.attr('range')
            });
        }
    }

    private validateNode(graph: dia.Graph, element: dia.Element, errors: Array<Flo.Marker>) {
        this.validateMetadata(element, errors);
        this.validateConnectedLinks(graph, element, errors);
        this.validateProperties(element, errors);
    }

    validate(graph: dia.Graph): Promise<Map<string, Array<Flo.Marker>>> {
        return new Promise(resolve => {
            const allMarkers: Map<string, Array<Flo.Marker>> = new Map();
            graph.getElements().filter(e => !e.get('parent') && e.attr('metadata')).forEach(e => {
                const markers: Array<Flo.Marker> = [];
                this.validateNode(graph, e, markers);
                allMarkers.set(e.id, markers);
            });
            resolve(allMarkers);
        });
    }

    private repairDamage(flo: Flo.EditorContext, node: dia.Element) {
        /*
         * remove incoming, outgoing links and cache their sources and targets not equal to current node
         */
        const sources: Array<string> = [];
        const targets: Array<string> = [];
        const i = 0;
        flo.getGraph().getConnectedLinks(node).forEach(link => {
            const targetId = link.get('target').id;
            const sourceId = link.get('source').id;
            if (targetId === node.id) {
                link.remove();
                sources.push(sourceId);
            } else if (sourceId === node.id) {
                link.remove();
                targets.push(targetId);
            }
        });
        /*
         * best attempt to connect source and targets bypassing the node
         */
        if (sources.length === 1) {
            const source = sources[0];
            // TODO: replace selector CSS class with the result of view.getSelector(...)
            targets.forEach(target => flo.createLink({
                'id': source,
                'selector': '.output-port',
                'port': 'output'
            }, {
                'id': target,
                'selector': '.input-port',
                'port': 'input'
            }));
        } else if (targets.length === 1) {
            const target = targets[0];
            sources.forEach(source => flo.createLink({
                'id': sources[i],
                'selector': '.output-port',
                'port': 'output'
            }, {
                'id': target,
                'selector': '.input-port',
                'port': 'input'
            }));
        }
    }

    /**
     * Check if node being dropped and drop target node next to each other such that they won't be swapped by the drop
     */
    private canSwap(flo: Flo.EditorContext, dropee: dia.Element, target: dia.Element, side: string) {
        let i: number, targetId: string, sourceId: string, noSwap = (dropee.id === target.id);
        if (dropee === target) {
          // Shouldn't happen
        }
        const links = flo.getGraph().getConnectedLinks(dropee);
        for (i = 0; i < links.length && !noSwap; i++) {
            targetId = links[i].get('target').id;
            sourceId = links[i].get('source').id;
            noSwap = (side === 'left' && targetId === target.id && sourceId === dropee.id)
              || (side === 'right' && targetId === dropee.id && sourceId === target.id);
        }
        return !noSwap;
    }

    preDelete(flo: Flo.EditorContext, cell: dia.Cell) {
        if (cell instanceof joint.dia.Element) {
            this.repairDamage(flo, <dia.Element> cell);
        }
    }

    private moveNodeOnNode(flo: Flo.EditorContext, node: dia.Element, pivotNode: dia.Element, side: string, shouldRepairDamage: boolean) {
        side = side || 'left';
        if (this.canSwap(flo, node, pivotNode, side)) {
            if (side === 'left') {
                const sources: Array<string> = [];
                if (shouldRepairDamage) {
                    this.repairDamage(flo, node);
                }
                flo.getGraph().getConnectedLinks(pivotNode, {inbound: true}).forEach(link => {
                    sources.push(link.get('source').id);
                    link.remove();
                });
                // TODO: replace selector CSS class with the result of view.getSelector(...)
                sources.forEach(source => {
                    flo.createLink({
                        'id': source,
                        'selector': '.output-port',
                        'port': 'output'
                    }, {
                        'id': node.id,
                        'selector': '.input-port',
                        'port': 'input'
                    });
                });
                flo.createLink({
                    'id': node.id,
                    'selector': '.output-port',
                    'port': 'output'
                }, {
                    'id': pivotNode.id,
                    'selector': '.input-port',
                    'port': 'input'
                });
            } else if (side === 'right') {
                const targets: Array<string> = [];
                if (shouldRepairDamage) {
                    this.repairDamage(flo, node);
                }
                flo.getGraph().getConnectedLinks(pivotNode, {outbound: true}).forEach(link => {
                    targets.push(link.get('target').id);
                    link.remove();
                });
                // TODO: replace selector CSS class with the result of view.getSelector(...)
                targets.forEach(target => {
                    flo.createLink({
                        'id': node.id,
                        'selector': '.output-port',
                        'port': 'output'
                    }, {
                        'id': target,
                        'selector': '.input-port',
                        'port': 'input'
                    });
                });
                flo.createLink({
                    'id': pivotNode.id,
                    'selector': '.output-port',
                    'port': 'output'
                }, {
                    'id': node.id,
                    'selector': '.input-port',
                    'port': 'input'
                });
            }
        }
    }

    private moveNodeOnLink(flo: Flo.EditorContext, node: dia.Element, link: dia.Link, shouldRepairDamage?: boolean) {
        const source = link.get('source').id;
        const target = link.get('target').id;

        const sourceTap = link.get('source').port === 'tap';

        if (shouldRepairDamage) {
            this.repairDamage(flo, node);
        }
        link.remove();

        // TODO: replace selector CSS class with the result of view.getSelector(...)
        if (source) {
            flo.createLink({
                    'id': source,
                    'selector': sourceTap ? '.tap-port' : '.output-port',
                    'port': sourceTap ? 'tap' : 'output'
                }, {
                    'id': node.id,
                    'selector': '.input-port',
                    'port': 'input'
                });
        }
        if (target) {
            flo.createLink({
                    'id': node.id,
                    'selector': '.output-port',
                    'port': 'output'
                }, {
                    'id': target,
                    'selector': '.input-port',
                    'port': 'input'
                });
        }
    }

    handleNodeDropping(flo: Flo.EditorContext, dragDescriptor: Flo.DnDDescriptor) {
        let relinking = dragDescriptor.sourceComponent === Constants.PALETTE_CONTEXT;
        const graph = flo.getGraph();
        const source = dragDescriptor.source ? dragDescriptor.source.view.model : undefined;
        const target = dragDescriptor.target ? dragDescriptor.target.view.model : undefined;
        const type = source.attr('metadata/name');
        // NODE DROPPING TURNED OFF FOR NOW
        if (NODE_DROPPING && target instanceof joint.dia.Element && target.attr('metadata/name')) {
            if (dragDescriptor.target.cssClassSelector === '.output-port') {
                this.moveNodeOnNode(flo, <dia.Element> source, <dia.Element> target, 'right', true);
                relinking = true;
            } else if (dragDescriptor.target.cssClassSelector === '.input-port') {
                this.moveNodeOnNode(flo,  <dia.Element> source,  <dia.Element> target, 'left', true);
                relinking = true;
            } else if (dragDescriptor.target.cssClassSelector === '.tap-port') {
                // TODO: replace selector CSS class with the result of view.getSelector(...)
                flo.createLink({
                    'id': target.id,
                    'selector': dragDescriptor.target.cssClassSelector,
                    // 'port': dragDescriptor.target.port
                }, {
                    'id': source.id,
                    'selector': dragDescriptor.source.cssClassSelector,
                    // 'port': dragDescriptor.source.port
                });
            }
        } else if (target instanceof joint.dia.Link && type !== 'tap' && type !== 'destination') {
            this.moveNodeOnLink(flo, <dia.Element> source, <dia.Link> target);
        } else if (flo.autolink && relinking) {
            // Search the graph for open ports - if only 1 is found, and it matches what
            // the dropped node needs, join it up!
            const group = source.attr('metadata/group');
            let wantOpenInputPort = false; // want something with an open input port
            let wantOpenOutputPort = false; // want something with an open output port
            if (group === ApplicationType[ApplicationType.source]) {
                wantOpenInputPort = true;
            } else if (group === ApplicationType[ApplicationType.sink]) {
                wantOpenOutputPort = true;
            } else if (group === ApplicationType[ApplicationType.processor]) {
                wantOpenInputPort = true;
                wantOpenOutputPort = true;
            }
            const openPorts = [];
            const elements = graph.getElements();
            let linksIn, linksOut;

            graph.getElements().filter(e => e.id !== source.id && e.attr('metadata/name')).forEach(element => {
               switch (element.attr('metadata/group')) {
                   case ApplicationType[ApplicationType.source]:
                       if (wantOpenOutputPort) {
                           linksOut = this.getOutgoingStreamLinks(graph, element);
                           if (linksOut.length === 0) {
                               openPorts.push({'node': element, 'openPort': 'output'});
                           }
                       }
                       break;
                   case ApplicationType[ApplicationType.sink]:
                       if (wantOpenInputPort) {
                           linksIn = graph.getConnectedLinks(element, {inbound: true});
                           if (linksIn.length === 0) {
                               openPorts.push({'node': element, 'openPort': 'input'});
                           }
                       }
                       break;
                   case ApplicationType[ApplicationType.processor]:
                       if (wantOpenOutputPort) {
                           linksOut = this.getOutgoingStreamLinks(graph, element);
                           if (linksOut.length === 0) {
                               openPorts.push({'node': element, 'openPort': 'output'});
                           }
                       }
                       if (wantOpenInputPort) {
                           linksIn = graph.getConnectedLinks(element, {inbound: true});
                           if (linksIn.length === 0) {
                               openPorts.push({'node': element, 'openPort': 'input'});
                           }
                       }
                       break;
                   default:
               }
            });

            if (openPorts.length === 1) {
                // One candidate match!
                const match = openPorts.shift();
                // TODO: replace selector CSS class with the result of view.getSelector(...)
                if (match.openPort === 'input') {
                    flo.createLink({
                        'id': source.id,
                        'selector': '.output-port', // /.output-port/.input-port
                        'port': 'output' // input/output
                    }, {
                        'id': match.node.id,
                        'selector': '.input-port',
                        'port': 'input'
                    });
                } else { // match.openPort === 'output'
                    flo.createLink({
                        'id': match.node.id,
                        'selector': '.output-port', // /.output-port/.input-port
                        'port': 'output' // input/output
                    }, {
                        'id': source.id,
                        'selector': '.input-port',
                        'port': 'input'
                    });
                }
            }

        }
    }

    get allowLinkVertexEdit() {
        return false;
    }

}
