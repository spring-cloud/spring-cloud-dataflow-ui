/*
 * Copyright 2015-2016 the original author or authors.
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

/**
 * Editor Service for Flo based Stream Definition Graph editor.
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function(require) {
    'use strict';
    
    var joint = require('joint');
    var angular = require('angular');
    var utils = require('stream/services/utils');
    require('flo');

    return [ '$modal', '$log', function ($modal,$log) {

        function createHandles(flo, createHandle, element) {
            var bbox = element.getBBox();

            // Delete handle
            var pt = bbox.origin().offset(bbox.width + 3, bbox.height + 3);
            createHandle(element, 'remove', flo.deleteSelectedNode, pt);

            // Properties handle
            pt = bbox.origin().offset(-14, bbox.height + 3);
            createHandle(element, 'properties', function() {
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/stream/views/properties-dialog.html',
                    controller: 'PropertiesDialogController',
                    size: 'lg',
                    resolve: {
                        cell: function () {
                            return element;
                        },
                        streamInfo: function() {
                            if (utils.canBeHeadOfStream(flo.getGraph(), element)) {
                                var info = {
                                    streamNames: []
                                };
                                flo.getGraph().getElements().forEach(function(e) {
                                   if (element !== e && utils.canBeHeadOfStream(flo.getGraph(), e)) {
                                       if (e.attr('stream-name')) {
                                           info.streamNames.push(e.attr('stream-name'));
                                       }
                                   } 
                                });
                                return info;
                            }
                        }
                    }
                }).result.then(function (results) {

                        var properties = results.properties || {};
                        var derivedProperties = results.derivedProperties || {};
                        var property;

                        element.trigger('batch:start', { batchName: 'update properties' });

                        Object.keys(derivedProperties).forEach(function(key) {
                            property = derivedProperties[key];
                            if (property.attr) {
                                if (angular.isDefined(property.value)) {
                                    element.attr(property.attr, property.value);
                                } else {
                                    element.attr(property.attr, '');
                                }
                            }
                        });

                        Object.keys(properties).forEach(function (key) {
                            property = properties[key];
                            if ((typeof property.value === 'boolean' && !property.defaultValue && !property.value) ||
                                (property.value === property.defaultValue || property.value === '' || property.value === undefined || property.value === null)) {
                                if (angular.isDefined(element.attr('props/' + property.nameInUse))) {
                                    // Remove attr doesn't fire appropriate event. Set default value first as a workaround to schedule DSL resync
                                    element.attr('props/' + property.nameInUse, property.defaultValue === undefined ? null : property.defaultValue);
                                    element.removeAttr('props/' + property.nameInUse);
                                }
                            } else {
                                element.attr('props/' + property.nameInUse, property.value);
                            }
                        });

                        element.trigger('batch:stop', { batchName: 'update properties' });
                    });

            }, pt);
        }

        function validatePort(/*flo, cellView, magnet*/) {
            return true;
        }

        function validateLink(flo, cellViewS, magnetS, cellViewT, magnetT, end, linkView) {

            $log.info('SOURCE=' + cellViewS.model.attr('metadata/name') + ' TARGET=' + cellViewT.model.attr('metadata/name'));
            // Prevent linking from input ports.
            if (magnetS && magnetS.getAttribute('type') === 'input') {
                return false;
            }
            // Prevent linking from output ports to input ports within one element.
            if (cellViewS === cellViewT) {
                return false;
            }
            // Prevent linking to input ports.
            if (magnetT && magnetT.getAttribute('type') === 'output') {
                return false;
            }

            var graph = flo.getGraph();

            if (cellViewS.model.attr('metadata') && cellViewT.model.attr('metadata')) {
                // Target is a SOURCE node? Disallow link!
                if (cellViewT.model.attr('metadata/group') === 'source') {
                    return false;
                }
                // Target is an explicit tap? Disallow link!
                if (cellViewT.model.attr('metadata/name') === 'tap') {
                    return false;
                }
                // Target is a DESTINATION with outgoing links? Disallow, because DESTINATION can either be SOURCE or SINK but not both
                if (cellViewT.model.attr('metadata/name') === 'destination' && graph.getConnectedLinks(cellViewT.model, { outbound: true }).length ) {
                    return false;
                }
                // Sinks and Tasks cannot have outgoing links
                if (cellViewS.model.attr('metadata/group') === 'sink' || cellViewS.model.attr('metadata/group') === 'task') {
                    return false;
                }
                // Source is a DESTINATION with incoming links? Disallow, because DESTINATION can either be SOURCE or SINK but not both
                if (cellViewS.model.attr('metadata/name') === 'destination' && graph.getConnectedLinks(cellViewS.model, { inbound: true }).length) {
                    return false;
                }

                var idx;
                var i;
                var targetIncomingLinks = graph.getConnectedLinks(cellViewT.model, { inbound: true });
                idx = targetIncomingLinks.indexOf(linkView.model);
                if (idx >= 0) {
                    targetIncomingLinks.splice(idx, 1);
                }
                var outgoingSourceLinks = graph.getConnectedLinks(cellViewS.model, { outbound: true });
                idx = outgoingSourceLinks.indexOf(linkView.model);
                if (idx >= 0) {
                    outgoingSourceLinks.splice(idx, 1);
                }

                if (targetIncomingLinks.length > 0) {
                    return false;
                }

                if (outgoingSourceLinks.length > 0) {
                    // Make sure there is no link between this source and target already
                    for (i = 0; i < outgoingSourceLinks.length; i++) {
                        if (outgoingSourceLinks[i].get('target').id) {
                            var t = graph.getCell(outgoingSourceLinks[i].get('target').id);
                            if (t && t === cellViewT.model) {
                                return false;
                            }
                        }
                    }

                    // Invalid if output-port has more than one outgoing link
                    if (magnetS.getAttribute('class') === 'output-port') {
                        for (i = 0; i < outgoingSourceLinks.length; i++) {
                            var selector = outgoingSourceLinks[i].get('source').selector;
                            // Another link from the 'output-port' is present
                            if (selector) {
                                var port = cellViewS.el.querySelector(selector);
                                if (port && port.getAttribute('class') === 'output-port') {
                                    return false;
                                }
                            }
                        }
                    }
                }

                // All checks passed, valid connection.
                return true;
            }
        }

        function getOutgoingStreamLinks(graph,node) {
            var links = [];
            // !node only possible if call is occurring during link drawing (one end connected but not the other)
            if (node) {
                graph.getConnectedLinks(node, {outbound: true}).forEach(function(link) {
                    var source = link.get('source');
                    if (source.port === 'output') {
                        links.push(link);
                    }
                });
            }
            return links;
        }

        function calculateDragDescriptor(flo, draggedView, targetUnderMouse, point, context) {
            // check if it's a tap being dragged
            var source = draggedView.model;
            if ((targetUnderMouse instanceof joint.dia.Element) && source.attr('metadata/name') === 'tap') {
                return {
                    context: context,
                    source: {
                        cell: draggedView.model,
                    },
                    target: {
                        cell: targetUnderMouse,
                    }
                };
            }

            // Find closest port
            var range = 30;
            var graph = flo.getGraph();
            var paper = flo.getPaper();
            var closestData;
            var minDistance = Number.MAX_VALUE;
            var hasIncomingPort = draggedView.model.attr('.input-port') && draggedView.model.attr('.input-port/display') !== 'none';
            // Ignore tap-port for the dragged view. Only allow making connections to/from input and output port for node-on-node DnD
            var hasOutgoingPort = draggedView.model.attr('.output-port') && draggedView.model.attr('.output-port/display') !== 'none';
            if (!hasIncomingPort && !hasOutgoingPort) {
                return;
            }
            var elements = graph.findModelsInArea(joint.g.rect(point.x - range, point.y - range, 2 * range, 2 * range));
            if (Array.isArray(elements)) {
                elements.forEach(function(model) {
                    var view = paper.findViewByModel(model);
                    if (view && view !== draggedView && model instanceof joint.dia.Element) {
                        var targetHasIncomingPort = view.model.attr('.input-port') && view.model.attr('.input-port/display') !== 'none';
                        // 2 output ports: output-port and tap-port
                        var targetHasOutgoingPort = (view.model.attr('.output-port') && view.model.attr('.output-port/display') !== 'none') ||
                            view.model.attr('.tap-port') && view.model.attr('.tap-port/display') !== 'none';
                        view.$('[magnet]').each(function(index, magnet) {
                            var type = magnet.getAttribute('type');
                            if ((type === 'input' && targetHasIncomingPort && hasOutgoingPort) || (type === 'output' && targetHasOutgoingPort && hasIncomingPort)) {
                                var bbox = joint.V(magnet).bbox(false, paper.viewport);
                                var distance = point.distance({
                                    x: bbox.x + bbox.width / 2,
                                    y: bbox.y + bbox.height / 2
                                });
                                if (distance < range && distance < minDistance) {
                                    minDistance = distance;
                                    closestData = {
                                        context: context,
                                        source: {
                                            cell: draggedView.model,
                                            selector: type === 'output' ? '.input-port' : '.output-port',
                                            port: type === 'output' ? 'input' : 'output'
                                        },
                                        target: {
                                            cell: model,
                                            selector: '.' + magnet.getAttribute('class'),
                                            port: magnet.getAttribute('port')
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
            var sourceType = source.attr('metadata/name');
            var sourceGroup = source.attr('metadata/group');
            if (targetUnderMouse instanceof joint.dia.Link && !(sourceType === 'destination' || sourceGroup === 'sink' || sourceGroup === 'source') && graph.getConnectedLinks(source).length === 0) {
                return {
                    context: context,
                    source: {
                        cell: source
                    },
                    target: {
                        cell: targetUnderMouse
                    }
                };
            }

            return {
                context: context,
                source: {
                    cell: source
                },
            };
        }

        function validateSource(element, incoming, outgoing, tap, errors) {
            if (incoming.length !== 0) {
                errors.push({
                    message: 'Sources must appear at the start of a stream',
                    range: element.attr('range')
                });
            }
            if (outgoing.length !== 1) {
                errors.push({
                    message: outgoing.length === 0 ? 'Should direct its output to an app' : 'Output should be directed to only one app',
                    range: element.attr('range')
                });
            }
        }

        function validateProcessor(element, incoming, outgoing, tap, errors) {
            if (incoming.length !== 1) {
                errors.push({
                    message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                    range: element.attr('range')
                });
            }
            if (outgoing.length !== 1) {
                errors.push({
                    message: outgoing.length === 0 ? 'Should direct its output to an app' : 'Output should be directed to only one app',
                    range: element.attr('range')
                });
            }
        }

        function validateSink(element, incoming, outgoing, tap, errors) {
            if (incoming.length !== 1) {
                errors.push({
                    message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                    range: element.attr('range')
                });
            }
            if (outgoing.length !== 0) {
                errors.push({
                    message: 'Sink should be at the end of a stream',
                    range: element.attr('range')
                });
            }
            if (tap.length !== 0) {
                errors.push({
                    message: 'Cannot tap into a sink app',
                    range: element.attr('range')
                });
            }
        }

        function validateTask(element, incoming, outgoing, tap, errors) {
            if (incoming.length !== 1) {
                errors.push({
                    message: incoming.length === 0 ? 'Should have an input from an app' : 'Input should come from one app only',
                    range: element.attr('range')
                });
            }
            if (outgoing.length !== 0) {
                errors.push({
                    message: 'Task should be at the end of a stream',
                    range: element.attr('range')
                });
            }
            if (tap.length !== 0) {
                errors.push({
                    message: 'Cannot tap into a task app',
                    range: element.attr('range')
                });
            }
        }

        function validateTap(element, incoming, outgoing, tap, errors) {
            if (incoming.length !== 0) {
                errors.push({
                    message: 'Tap must appear at the start of a stream',
                    range: element.attr('range')
                });
            }
            if (outgoing.length !== 1) {
                errors.push({
                    message: outgoing.length === 0 ? 'Should direct its output to an app' : 'Output should be directed to only one app',
                    range: element.attr('range')
                });
            }
            if (tap.length !== 0) {
                errors.push({
                    message: 'Cannot tap into a tap app',
                    range: element.attr('range')
                });
            }
        }

        function validateDestination(element, incoming, outgoing, tap, errors) {
            if (incoming.length > 0 && outgoing.length > 0) {
                errors.push({
                    message: 'Destination should either have input or output but not both at the same time',
                    range: element.attr('range')
                });
            }
            if (tap.length !== 0) {
                errors.push({
                    message: 'Cannot tap into a destination app',
                    range: element.attr('range')
                });
            }
        }

        function validateConnectedLinks(flo, element, errors) {
            var group = element.attr('metadata/group');
            var type = element.attr('metadata/name');
            var graph = flo.getGraph();
            var incoming = [], outgoing = [], tap = [], invalidIncoming = [], invalidOutgoing = [];
            var port;

            graph.getConnectedLinks(element).forEach(function(link) {
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
                    message: 'Invalid incoming link' + (invalidIncoming.length > 1 ? 's' : ''),
                    range: element.attr('range')
                });
            }

            if (invalidOutgoing.length > 0) {
                errors.push({
                    message: 'Invalid outgoing link' + (invalidOutgoing.length > 1 ? 's' : ''),
                    range: element.attr('range')
                });
            }

            if (group === 'source') {
                validateSource(element, incoming, outgoing, tap, errors);
            } else if (group === 'processor') {
                validateProcessor(element, incoming, outgoing, tap, errors);
            } else if (group === 'sink') {
                validateSink(element, incoming, outgoing, tap, errors);
            } else if (group === 'task') {
                validateTask(element, incoming, outgoing, tap, errors);
            } else if (group === 'other') {
                if (type === 'tap') {
                    validateTap(element, incoming, outgoing, tap, errors);
                } else if (type === 'destination') {
                    validateDestination(element, incoming, outgoing, tap, errors);
                }
            }
        }

        function validateProperties(element, errors) {
            // If possible, verify the properties specified match those allowed on this type of element
            // propertiesRanges are the ranges for each property included the entire '--name=value'.
            // The format of a range is {'start':{'ch':NNNN,'line':NNNN},'end':{'ch':NNNN,'line':NNNN}}
            var propertiesRanges = element.attr('propertiesranges');
            if (propertiesRanges) {
                var appSchema = element.attr('metadata');
                // Grab the list of supported properties for this app type
                appSchema.get('properties').then(function(appSchemaProperties) {
                    if (!appSchemaProperties) {
                        appSchemaProperties = {};
                    }
                    // Example appSchemaProperties:
                    // {"host":{"name":"host","type":"String","description":"the hostname of the mail server","defaultValue":"localhost","hidden":false},
                    //  "password":{"name":"password","type":"String","description":"the password to use to connect to the mail server ","defaultValue":null,"hidden":false}
                    var specifiedProperties = element.attr('props');
                    Object.keys(specifiedProperties).forEach(function(propertyName) {
                        if (!appSchemaProperties[propertyName]) {
                            // The schema does not mention that property
                            var propertyRange = propertiesRanges[propertyName];
                            if (propertyRange) {
                                errors.push({
                                    message: 'unrecognized option \''+propertyName+'\' for app \''+element.attr('metadata/name')+'\'',
                                    range: propertyRange
                                });
                            }
                        }
                    });
                });
            }
        }

        function validateMetadta(element, errors) {
            // Unresolved elements validation
            if (!element.attr('metadata') || element.attr('metadata/unresolved')) {
                var msg = 'Unknown element \'' + element.attr('metadata/name') + '\'';
                if (element.attr('metadata/group')) {
                    msg += ' from group \'' + element.attr('metadata/group') + '\'.';
                }
                errors.push({
                    message: msg,
                    range: element.attr('range')
                });
            }
        }

        function validateNode(flo, element) {
            var errors = [];

            validateMetadta(element, errors);

            validateConnectedLinks(flo, element, errors);

            validateProperties(element, errors);

            return errors;
        }

        function repairDamage(flo, node) {
            /*
             * remove incoming, outgoing links and cache their sources and targets not equal to current node
             */
            var sources = [];
            var targets = [];
            var i = 0;
            var links = flo.getGraph().getConnectedLinks(node);
            for (i = 0; i < links.length; i++) {
                var targetId = links[i].get('target').id;
                var sourceId = links[i].get('source').id;
                if (targetId === node.id) {
                    links[i].remove();
                    sources.push(sourceId);
                } else if (sourceId === node.id) {
                    links[i].remove();
                    targets.push(targetId);
                }
            }
            /*
             * best attempt to connect source and targets bypassing the node
             */
            if (sources.length === 1) {
                var source = sources[0];
                for (i = 0; i < targets.length; i++) {
                    flo.createLink({
                        'id': source,
                        'selector': '.output-port',
                        'port': 'output'
                    }, {
                        'id': targets[i],
                        'selector': '.input-port',
                        'port': 'input'
                    });
                }
            } else if (targets.length === 1) {
                var target = targets[0];
                for (i = 0; i < sources.length; i++) {
                    flo.createLink({
                        'id': sources[i],
                        'selector': '.output-port',
                        'port': 'output'
                    }, {
                        'id': target,
                        'selector': '.input-port',
                        'port': 'input'
                    });
                }
            }
        }

        /**
         * Check if node being dropped and drop target node next to each other such that they won't be swapped by the drop
         */
        function canSwap(flo, dropee, target, side) {
            var i, targetId, sourceId, noSwap = (dropee.id === target.id);
            if (dropee === target) {
                $log.debug('What!??? Dragged == Dropped!!! id = ' + target);
            }
            var links = flo.getGraph().getConnectedLinks(dropee);
            for (i = 0; i < links.length && !noSwap; i++) {
                targetId = links[i].get('target').id;
                sourceId = links[i].get('source').id;
                noSwap = (side === 'left' && targetId === target.id && sourceId === dropee.id) || (side === 'right' && targetId === dropee.id && sourceId === target.id);
            }
            return !noSwap;
        }

        function preDelete(flo, cell) {
            repairDamage(flo, cell);
        }

        function moveNodeOnNode(flo, node, pivotNode, side, shouldRepairDamage) {
            side = side || 'left';
            if (canSwap(flo, node, pivotNode, side)) {
                var link;
                var i;
                if (side === 'left') {
                    var sources = [];
                    if (shouldRepairDamage) {
                        repairDamage(flo, node);
                    }
                    var pivotTargetLinks = flo.getGraph().getConnectedLinks(pivotNode, {inbound: true});
                    for (i = 0; i < pivotTargetLinks.length; i++) {
                        link = pivotTargetLinks[i];
                        sources.push(link.get('source').id);
                        link.remove();
                    }
                    for (i = 0; i < sources.length; i++) {
                        flo.createLink({
                            'id': sources[i],
                            'selector': '.output-port',
                            'port': 'output'
                        }, {
                            'id': node.id,
                            'selector': '.input-port',
                            'port': 'input'
                        });
                    }
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
                    var targets = [];
                    if (shouldRepairDamage) {
                        repairDamage(flo, node);
                    }
                    var pivotSourceLinks = flo.getGraph().getConnectedLinks(pivotNode, {outbound: true});
                    for (i = 0; i < pivotSourceLinks.length; i++) {
                        link = pivotSourceLinks[i];
                        targets.push(link.get('target').id);
                        link.remove();
                    }
                    for (i = 0; i < targets.length; i++) {
                        flo.createLink({
                            'id': node.id,
                            'selector': '.output-port',
                            'port': 'output'
                        }, {
                            'id': targets[i],
                            'selector': '.input-port',
                            'port': 'input'
                        });
                    }
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

        function moveNodeOnLink(flo, node, link, shouldRepairDamage) {
            var source = link.get('source').id;
            var target = link.get('target').id;
            
            var sourceTap = link.get('source').port === 'tap';

            if (shouldRepairDamage) {
                repairDamage(flo, node);
            }
            link.remove();

            if (source) {
                flo.createLink({'id': source, 'selector': sourceTap?'.tap-port':'.output-port', 'port': sourceTap?'tap':'output'},
                                        {'id': node.id, 'selector': '.input-port', 'port': 'input' });
            }
            if (target) {
                flo.createLink({'id': node.id,'selector': '.output-port','port': 'output'}, 
                                        {'id': target, 'selector': '.input-port', 'port': 'input' });
            }
        }

        function handleNodeDropping(flo, dragDescriptor) {
            var relinking = dragDescriptor.context && dragDescriptor.context.palette;
            var graph = flo.getGraph();
            var source = dragDescriptor.source ? dragDescriptor.source.cell : undefined;
            var target = dragDescriptor.target ? dragDescriptor.target.cell : undefined;
            var type = source.attr('metadata/name');
            // NODE DROPPING TURNED OFF FOR NOW
            if (false && target instanceof joint.dia.Element && target.attr('metadata/name')) {
                if (dragDescriptor.target.selector === '.output-port') {
                    moveNodeOnNode(flo, source, target, 'right', true);
                    relinking = true;
                } else if (dragDescriptor.target.selector === '.input-port') {
                    moveNodeOnNode(flo, source, target, 'left', true);
                    relinking = true;
                } else if (dragDescriptor.target.selector === '.tap-port') {
                    flo.createLink({
                        'id': target.id,
                        'selector': dragDescriptor.target.selector,
                        'port': dragDescriptor.target.port
                    }, {
                        'id': source.id,
                        'selector': dragDescriptor.source.selector,
                        'port': dragDescriptor.source.port
                    });
                }
                //}
            } else if (target instanceof joint.dia.Link && type !== 'tap' && type !== 'destination') {
                moveNodeOnLink(flo, source, target);
            } else if (flo.autolink && relinking) {
                // Search the graph for open ports - if only 1 is found, and it matches what
                // the dropped node needs, join it up!
                var group = source.attr('metadata/group');
                var wantOpenInputPort = false; // want something with an open input port
                var wantOpenOutputPort = false; // want something with an open output port
                if (group === 'source') {
                    wantOpenInputPort = true;
                } else if (group === 'sink') {
                    wantOpenOutputPort = true;
                } else if (group === 'processor') {
                    wantOpenInputPort = true;
                    wantOpenOutputPort = true;
                }
                var openPorts=[];
                var elements = graph.getElements();
                var linksIn, linksOut;
                for (var i=0;i<elements.length;i++) {
                    var element = elements[i];
                    if (element.id === source.id) {
                        continue;
                    }
                    if (element.attr('metadata/name')) {
                        if (element.attr('metadata/group')==='source') {
                            if (wantOpenOutputPort) {
                                linksOut = getOutgoingStreamLinks(graph,element);
                                if (linksOut.length===0) {
                                    openPorts.push({'node':element,'openPort':'output'});
                                }
                            }
                        } else if (element.attr('metadata/group')==='sink') {
                            if (wantOpenInputPort) {
                                linksIn = graph.getConnectedLinks(element,{inbound:true});
                                if (linksIn.length===0) {
                                    openPorts.push({'node':element,'openPort':'input'});
                                }
                            }
                        } else if (element.attr('metadata/group') === 'processor') {
                            if (wantOpenOutputPort) {
                                linksOut = getOutgoingStreamLinks(graph,element);
                                if (linksOut.length===0) {
                                    openPorts.push({'node':element,'openPort':'output'});
                                }
                            }
                            if (wantOpenInputPort) {
                                linksIn = graph.getConnectedLinks(element,{inbound:true});
                                if (linksIn.length===0) {
                                    openPorts.push({'node':element,'openPort':'input'});
                                }
                            }
                        }
                    }
                }
                if (openPorts.length === 1) {
                    // One candidate match!
                    var match = openPorts.shift();
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

        return {
            'createHandles': createHandles,
            'validatePort': validatePort,
            'validateLink': validateLink,
            'calculateDragDescriptor': calculateDragDescriptor,
            'handleNodeDropping': handleNodeDropping,
            'validateNode': validateNode,
            'preDelete': preDelete,
            'interactive': {
                'vertexAdd': false
            },
            'allowLinkVertexEdit': false
        };

    }];

});
