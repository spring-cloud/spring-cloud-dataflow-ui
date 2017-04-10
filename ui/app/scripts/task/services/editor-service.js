/*
 * Copyright 2017 the original author or authors.
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
 * Flo Editor service for Composed Task editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function(require) {
    'use strict';

    var joint = require('joint');

    var DND_ENABLED = true; // Is smart DnD enabled?

    var DUPLICATE_LABEL_MSG = 'Duplicate label. Ensure unique labels for tasks';
    var DUPLICATE_TASK_MSG = 'Same task app can be used only if it has unique label';
    var LABEL_DUPLICATES_TASK_TYPE_MSG = 'Label duplicates task app type used in the definition';

    return ['$log', 'MetamodelUtils', 'PropertiesDialogService', function ($log, metamodelUtils, propertiesDialog) {

        function createHandles(flo, createHandle, element) {
            var metadata = element.attr('metadata');
            var bbox;
            var pt;

            // Handles for all elements except start and end nodes
            if (element instanceof joint.dia.Element && metadata && !(metadata.group === joint.shapes.flo.batch.CONTROL_NODES &&
                (metadata.name === joint.shapes.flo.batch.START_NODE_TYPE || metadata.name === joint.shapes.flo.batch.END_NODE_TYPE))) {
                bbox = element.getBBox();
                pt = bbox.origin().offset(bbox.width + 3, bbox.height + 3);
                createHandle(element, 'remove', flo.deleteSelectedNode, pt);
            }

            if (metadata && !element.attr('metadata/unresolved') && !element.attr('metadata/metadata/noEditableProps') && element instanceof joint.dia.Element) {
                bbox = element.getBBox();
                pt = bbox.origin().offset(-14, bbox.height + 3);
                // Properties handle
                createHandle(element, 'properties', function() {
                    propertiesDialog.show(element);
                }, pt);
            }

        }

        function validatePort(/*flo, cellView, magnet*/) {
            return true;
        }

        // TODO: experimental validation staff to uncomment
        //function findDistinctIncomingAndOutgoingLinks(graph, cell, excluding) {
        //    var incoming = [];
        //    var outgoing = [];
        //    var distinctSources = {};
        //    var distinctTargets = {};
        //    graph.getConnectedLinks(cell).forEach(function(link) {
        //        if (excluding && excluding.indexOf(link) !== -1) {
        //            return;
        //        }
        //        if (link.get('target').id === cell.get('id')) {
        //            var sourceId = link.get('source').id;
        //            if (sourceId && !distinctSources[sourceId]) {
        //                distinctSources[sourceId] = true;
        //                incoming.push(link);
        //            }
        //        } else {
        //            var targetId = link.get('target').id;
        //            if (targetId && !distinctTargets[targetId]) {
        //                distinctTargets[targetId] = true;
        //                outgoing.push(link);
        //            }
        //
        //        }
        //    });
        //    return {
        //        incoming: incoming,
        //        outgoing: outgoing
        //    };
        //}
        //
        //function findFlowRoot(graph, cell, excluding) {
        //    var links = findDistinctIncomingAndOutgoingLinks(graph, cell, excluding);
        //    if (links.outgoing.length > 1 || links.incoming.length === 0) {
        //        return cell;
        //    } else {
        //        return findFlowRoot(graph, graph.getCell(links.incoming[0].get('source').id));
        //    }
        //}


        function validateLink(flo, cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
            // Connections only between magnets/ports
            if (!magnetS || !magnetT) {
                return false;
            }
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

            /*
             *
             * Prevent the case below
             *
             *                   |
             *                   |
             *                  \|/
             *   ______        ______
             *   |  A |__new__\| B  |
             *   |____|       /|____|
             *      |
             *      |
             *     \|/
             *
             *
             */
            var source = cellViewS.model;
            var target = cellViewT.model;
            var graph = flo.getGraph();

            var sourceConnectedTo = {};
            var targetConnectedFrom = {};
            graph.getConnectedLinks(source, {outbound: true}).forEach(function(link) {
               if (link.get('target').id && link !== linkView.model) {
                   sourceConnectedTo[link.get('target').id] = link;
               }
            });
            graph.getConnectedLinks(target, {inbound: true}).forEach(function(link) {
                if (link.get('source').id && link !== linkView.model) {
                    targetConnectedFrom[link.get('source').id] = link;
                }
            });

            /*
             * 13-Nov-2015: removing this test, it doesn't allow me to build something that is allowed.
             * For example, start with <aaa | FAILED = kkk || bbb || ccc & ddd || eee || fff>
             * then try to draw a line from bbb to kkk because you also want a FAILED transition between those nodes.
             * This check prevents me drawing it.  It needs further tweaking.
            if (Object.keys(sourceConnectedTo).length > 0 && Object.keys(targetConnectedFrom).length > 0) {
                // Only allow link if there is already a link between the same source and target
            	
                return sourceConnectedTo[target.get('id')] && targetConnectedFrom[source.get('id')];
            }
            */

            // TODO: Experimental validation staff to uncomment
            //var targetFlowRoot = findFlowRoot(graph, target, [linkView.model]);
            //var sourceFlowRoot = findFlowRoot(graph, source, [linkView.model]);
            //
            //if (targetFlowRoot === target || sourceFlowRoot === source) {
            //    return true;
            //}
            //
            //return sourceFlowRoot === targetFlowRoot;

            return true;
        }

        function preDelete(flo, cell) {
            flo.getGraph().getConnectedLinks(cell).forEach(function(link) {
                link.remove();
            });
        }

        function _findErrorDecorationCell(element) {
            var embeds = element.getEmbeddedCells();
            for (var i = 0; i < embeds.length; i++) {
                if ('error' === embeds[i].attr('./kind')) {
                    return embeds[i];
                }
            }
        }

        function _validateNodeLabel(flo, node) {
            $log.debug('Validating: ' + node.id);
            var label = node.attr('node-label');
            var type = node.attr('metadata/name');
            var cells = flo.getGraph().getCells();
            var errorCell;
            var errorMessages;
            for (var i = 0; i < cells.length; i++) {
                var n = cells[i];
                if (n !== node && n instanceof joint.shapes.flo.TaskModule && !n.attr('metadata/unresolved') && n.attr('metadata/name')) {
                    errorCell = _findErrorDecorationCell(n);
                    errorMessages = errorCell && errorCell.attr('messages') ? errorCell.attr('messages') : [];
                    if (label) {
                        if (label === n.attr('node-label')) {
                            if (errorMessages.indexOf(DUPLICATE_LABEL_MSG) === -1) {
                                flo._postValidation(n.id);
                            }
                            return DUPLICATE_LABEL_MSG;
                        } else if (label === n.attr('metadata/name')) {
                            return LABEL_DUPLICATES_TASK_TYPE_MSG;
                        }
                    } else if (type) {
                        if (type === n.attr('node-label')) {
                            if (errorMessages.indexOf(LABEL_DUPLICATES_TASK_TYPE_MSG) === -1) {
                                flo._postValidation(n.id);
                            }
                        } else if (type === n.attr('metadata/name')) {
                            if (errorMessages.indexOf(DUPLICATE_TASK_MSG) === -1) {
                                flo._postValidation(n.id);
                            }
                            return DUPLICATE_TASK_MSG;
                        }
                    }
                }
            }
        }

        function validateNode(flo, element) {
            var errors = [];
            var graph = flo.getGraph();
            if (element.attr('metadata') && !element.attr('metadata/unresolved')) {
                var type = element.attr('metadata/name');
                var incoming = graph.getConnectedLinks(element, {inbound: true});
                var outgoing = graph.getConnectedLinks(element, {outbound: true});

                // Verify that there is no more than link with the same 'ExitStatus' coming out
                // Verify there are no outgoing links to same type tasks (to duplicates)
                var exitStatusNumber = {};
                var typesOfTasks = {};
                var number;
                outgoing.forEach(function(link) {
                    var exitStatus = link.attr('props/ExitStatus');
                    if (exitStatus) {
                        number = exitStatusNumber[exitStatus];
                        if (number) {
                            exitStatusNumber[exitStatus] = number + 1;
                        } else {
                            exitStatusNumber[exitStatus] = 1;
                        }
                    } else {
                        var targetId = link.get('target').id;
                        if (targetId) {
                            var target = graph.getCell(targetId);
                            if (target) {
                                var type = target.attr('metadata/name');
                                number = typesOfTasks[type];
                                if (number) {
                                    typesOfTasks[type] = number + 1;
                                } else {
                                    typesOfTasks[type] = 1;
                                }
                            }
                        }
                    }
                });
                Object.keys(exitStatusNumber).forEach(function(exitStatus) {
                    if (exitStatusNumber[exitStatus] && exitStatusNumber[exitStatus] > 1) {
                        errors.push(exitStatusNumber[exitStatus] + ' links with Exit Status "' + exitStatus + '". Should only be one such link');
                    }
                });
                Object.keys(typesOfTasks).forEach(function(type) {
                    if (typesOfTasks[type] && typesOfTasks[type] > 1) {
                        errors.push(typesOfTasks[type] + ' duplicate links to "' + type + '". Should only be one such link');
                    }
                });

                var i = 0;
                if (type === joint.shapes.flo.batch.START_NODE_TYPE) {
                    if (incoming.length !== 0) {
                        errors.push(type + ' node can only have outgoing links');
                    }
                    for (i = 0; i < outgoing.length; i++) {
                        if (outgoing[i].attr('props/ExitStatus')) {
                            errors.push('Links from START should not specify an Exit Status');
                            break;
                        }
                    }
                } else if (type === joint.shapes.flo.batch.END_NODE_TYPE) {
                    if (incoming.length === 0) {
                        errors.push('End state does not have anything leading to it');
                    }
                } else if (type === joint.shapes.flo.batch.FAIL_NODE_TYPE) {
                    if (incoming.length === 0) {
                        errors.push('Failed state does not have anything leading to it');
                    }
//                    if (outgoing.length !== 0) {
//                        errors.push(type + ' node can only have incoming links');
//                    }
                } else if (type === joint.shapes.flo.batch.SYNC_NODE_TYPE) {
                    if (incoming.length === 0) {
                        errors.push('Must have incoming links');
                    }
                    if (outgoing.length === 0) {
                        errors.push('Must have outgoing links');
                    }
                    for (i = 0; i < outgoing.length; i++) {
                        if (outgoing[i].attr('props/ExitStatus')) {
                            errors.push('Links should not specify an Exit Status');
                            break;
                        }
                    }
                } else {
                    var labelError = _validateNodeLabel(flo, element);
                    if (labelError) {
                        errors.push(labelError);
                    }
                    if (incoming.length === 0) {
                        errors.push('Must have an incoming link');
                    }
                    if (outgoing.length === 0) {
                        errors.push('Must have an outgoing link');
                    } else {
	                    // Cannot check this since a node fanning out to a split will have multiple
                    	// without exit statuses
//	                    var unconditionalLink;
//	            		for (var l=0;l<outgoing.length;l++) {
//	            			var link = outgoing[l];
//	            			var condition = link.attr('props/ExitStatus');
//	            			if (!condition || condition==='\'*\'') {
//	            				if (unconditionalLink) {
//	            					// already seen an unconditional link
//	            					errors.push('Only one link from a task should not specify an Exit Status');
//	            				} else {
//	            					unconditionalLink = link;
//	            				}
//	            			}
//	            		}
//	            		if (!unconditionalLink) {
//	            			errors.push('At least one link from a task should not indicate a specific ExitStatus');
//	            		}
                    }
                }
            } else {
                var msg = 'Unknown element \'' + element.attr('metadata/name') + '\'';
                if (element.attr('metadata/group')) {
                    msg += ' from group \'' + element.attr('metadata/group') + '\'.';
                }
                errors.push({
                    message: msg,
                    range: element.attr('range')
                });
            }

            // If possible, verify the properties specified match those allowed on this type of element
            // propertiesRanges are the ranges for each property included the entire '--name=value'.
            // The format of a range is {'start':{'ch':NNNN,'line':NNNN},'end':{'ch':NNNN,'line':NNNN}}
            var propertiesRanges = element.attr('propertiesranges');
            if (propertiesRanges) {
                var moduleSchema = element.attr('metadata');
                // Grab the list of supported properties for this module type
                moduleSchema.get('properties').then(function (moduleSchemaProperties) {
                    if (!moduleSchemaProperties) {
                        moduleSchemaProperties = {};
                    }
                    // Example moduleSchemaProperties:
                    // {"host":{"name":"host","type":"String","description":"the hostname of the mail server","defaultValue":"localhost","hidden":false},
                    //  "password":{"name":"password","type":"String","description":"the password to use to connect to the mail server ","defaultValue":null,"hidden":false}
                    var specifiedProperties = element.attr('props');
                    Object.keys(specifiedProperties).forEach(function (propertyName) {
                        if (!moduleSchemaProperties[propertyName]) {
                            // The schema does not mention that property
                            var propertyRange = propertiesRanges[propertyName];
                            if (propertyRange) {
                                errors.push({
                                    message: 'unrecognized option \'' + propertyName + '\' for module \'' + element.attr('metadata/name') + '\'',
                                    range: propertyRange
                                });
                            }
                        }
                    });
                });
            }
            return errors;
        }

        function setDefaultContent(flo, metamodel) {
            flo.createNode(metamodelUtils.getMetadata(metamodel, joint.shapes.flo.batch.START_NODE_TYPE, joint.shapes.flo.batch.CONTROL_NODES));
            flo.createNode(metamodelUtils.getMetadata(metamodel, joint.shapes.flo.batch.END_NODE_TYPE, joint.shapes.flo.batch.CONTROL_NODES));
            return flo.performLayout();
        }

        function moveNodeOnNode(flo, node, pivotNode, side, shouldRepairDamage) {
            side = side || 'bottom';

            var sourceIncomingLinks = flo.getGraph().getConnectedLinks(node, {inbound: true});
            var sourceOutgoingLinks = flo.getGraph().getConnectedLinks(node, {outbound: true});

            if (sourceIncomingLinks.length!==0 || sourceOutgoingLinks.length!==0) {
                $log.info('not linking node');
                // Don't allow it if the source is already connected to things, too messy (for now)
                return false;
            }

//            if (canSwap(flo, node, pivotNode, side)) {
            var link;
            var i;
            if (side === 'top') { // was left
                var sources = [];
//                    if (shouldRepairDamage) {
//                        repairDamage(flo, node);
//                    }
                var pivotTargetLinks = flo.getGraph().getConnectedLinks(pivotNode, {inbound: true});
                for (i = 0; i < pivotTargetLinks.length; i++) {
                    link = pivotTargetLinks[i];
                    sources.push(link.get('source').id);
                    link.remove();
                }
                for (i = 0; i < sources.length; i++) {
                    flo.createLink({
                        'id': sources[i],
                        'selector': '.output-port'
                    }, {
                        'id': node.id,
                        'selector': '.input-port'
                    });
                }
                flo.createLink({
                    'id': node.id,
                    'selector': '.output-port'
                }, {
                    'id': pivotNode.id,
                    'selector': '.input-port'
                });
            } else if (side === 'bottom') { // was right
                var targets = [];
                if (shouldRepairDamage) {
//                        repairDamage(flo, node);
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
                        'selector': '.output-port'
                    }, {
                        'id': targets[i],
                        'selector': '.input-port'
                    });
                }
                flo.createLink({
                    'id': pivotNode.id,
                    'selector': '.output-port'
                }, {
                    'id': node.id,
                    'selector': '.input-port'
                });
            }
//            }
        }

        /**
         * Handle dropping of a node on a link, return true if some rework was done on the graph, otherwise false.
         */
        function moveNodeOnLink(flo, node, link/*, shouldRepairDamage*/) {
            var source = link.get('source');
            var target = link.get('target');
            var sourceId = source.id;
            var sourceSelector = source.selector;
            var targetId = target.id;
            var targetSelector = target.selector;

            var sourceIncomingLinks = flo.getGraph().getConnectedLinks(node, {inbound: true});
            var sourceOutgoingLinks = flo.getGraph().getConnectedLinks(node, {outbound: true});

            if (sourceIncomingLinks.length!==0 || sourceOutgoingLinks.length!==0) {
                // Don't allow it if the source is already connected to things, too messy (for now)
                return false;
            }
//            if (shouldRepairDamage) {
//                repairDamage(flo, node);
//            }
            // If there is a source and target and they are at the same x offset, put this node at the same offset
            if (source && target) {
                var paper = flo.getPaper();
                var sourceElement = paper.findViewByModel(source);
                var targetElement = paper.findViewByModel(target);
                var sourceElementPosition = sourceElement.model.position(); // return {x:...,y:...}
                var targetElementPosition = targetElement.model.position(); // return {x:...,y:...}
                if (sourceElementPosition.x === targetElementPosition.x) {
                    node.position(sourceElementPosition.x,node.position().y);
                }
//            	var sourceLabel = sourceElement.model.attr('.label/text');
//            	var targetLabel = targetElement.model.attr('.label/text');
            }
            link.remove();

            if (source) {
                flo.createLink(
                    {'id': sourceId,'selector': sourceSelector},
                    {'id': node.id,'selector': '.input-port'});
            }
            if (target) {
                flo.createLink(
                    {'id': node.id,'selector': '.output-port'},
                    {'id': targetId,'selector': targetSelector});
            }
        }

        function handleNodeDropping(flo, dragDescriptor) {
        	// TODO Should only do something if thing being dropped has no links
        	if (!DND_ENABLED) {
        		return;
        	}
            var relinking = dragDescriptor.context && dragDescriptor.context.palette;
            var source = dragDescriptor.source ? dragDescriptor.source.cell : undefined;
            var target = dragDescriptor.target ? dragDescriptor.target.cell : undefined;
            if (target instanceof joint.dia.Element && target instanceof joint.dia.Element) {//} && target.attr('metadata/name')) {
            	$log.info('DND:'+dragDescriptor.target.selector);
                    if (dragDescriptor.target.selector === '.output-port') {
                        moveNodeOnNode(flo, source, target, 'bottom', true);
//                        relinking = true;
                    } else if (dragDescriptor.target.selector === '.input-port') {
                        moveNodeOnNode(flo, source, target, 'top', true);
//                        relinking = true;
                    }
            } else 
            if (source instanceof joint.dia.Element && target instanceof joint.dia.Link) {
                $log.info('DnD: element dropped on link');

                $log.info('sourceElement?'+(source instanceof joint.dia.Element));
            	moveNodeOnLink(flo, source, target);
                relinking = true;
            }
//            if (relinking) {
//                flo.performLayout();
//            }
        }
        
        function calculateDragDescriptor(flo, draggedView, targetUnderMouse, point, context) {
        	if (!DND_ENABLED) {
        		return;
        	}
            // check if it's a tap being dragged
            var source = draggedView.model;

            // Find closest port
            var range = 30;
            var graph = flo.getGraph();
            var paper = flo.getPaper();
            var closestData;
            var minDistance = Number.MAX_VALUE;
            var maxIcomingLinks = draggedView.model.attr('metadata/constraints/maxIncomingLinksNumber');
            var maxOutgoingLinks = draggedView.model.attr('metadata/constraints/maxOutgoingLinksNumber');
            var hasIncomingPort = typeof maxIcomingLinks !== 'number' || maxIcomingLinks > 0;
            var hasOutgoingPort = typeof maxOutgoingLinks !== 'number' || maxOutgoingLinks > 0;
            if (!hasIncomingPort && !hasOutgoingPort) {
                return;
            }
            var elements = graph.findModelsInArea(joint.g.rect(point.x - range, point.y - range, 2 * range, 2 * range));
            if (Array.isArray(elements)) {
                elements.forEach(function(model) {
                    var view = paper.findViewByModel(model);
                    if (view && view !== draggedView && model instanceof joint.dia.Element) {
                        var targetMaxIcomingLinks = view.model.attr('metadata/constraints/maxIncomingLinksNumber');
                        var targetMaxOutgoingLinks = view.model.attr('metadata/constraints/maxOutgoingLinksNumber');
                        var targetHasIncomingPort = typeof targetMaxIcomingLinks !== 'number' || targetMaxIcomingLinks > 0;
                        var targetHasOutgoingPort = typeof targetMaxOutgoingLinks !== 'number' || targetMaxOutgoingLinks > 0;
                        if (view.model.attr('metadata/constraints/xorSourceSink')) {
                            if (targetHasIncomingPort) {
                                targetHasIncomingPort = targetHasIncomingPort && graph.getConnectedLinks(view.model, { outbound: true }).length === 0;
                            }
                            if (targetHasOutgoingPort) {
                                targetHasOutgoingPort = targetHasOutgoingPort && graph.getConnectedLinks(view.model, { inbound: true }).length === 0;
                            }
                        }
                        if (draggedView.model.attr('metadata/constraints/xorSourceSink')) {
                            if (hasIncomingPort) {
                                targetHasOutgoingPort = targetHasOutgoingPort && graph.getConnectedLinks(view.model, { outbound: true }).length === 0;
                            }
                            if (hasOutgoingPort) {
                                targetHasIncomingPort = targetHasIncomingPort && graph.getConnectedLinks(view.model, { inbound: true }).length === 0;
                            }
                        }
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
                                            view: draggedView
                                        },
                                        target: {
                                            cell: model,
                                            selector: '.' + type+'-port',
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
            if (targetUnderMouse instanceof joint.dia.Link) {//} && !(source.attr('metadata/constraints/xorSourceSink') || source.attr('metadata/constraints/maxOutgoingLinksNumber') === 0 || source.attr('metadata/constraints/maxIncomingLinksNumber') === 0) && graph.getConnectedLinks(source).length === 0) {
                return {
                    context: context,
                    source: {
                        cell: source,
                        view: draggedView
                    },
                    target: {
                        cell: targetUnderMouse,
                        view: paper.findViewByModel(targetUnderMouse)
                    }
                };
            }
        }
        
//        /**
//         * Check if node being dropped and drop target node next to each other such that they won't be swapped by the drop
//         * @param dropee the element being dropped
//         * @param target the target of the drop (possibly a link or an element)
//         * @param side either top or bottom
//         */
//        function canSwap(flo, dropee, target, side) {
//            var i, targetId, sourceId, noSwap = (dropee.id === target.id);
//            if (dropee === target) {
//                $log.info('Unexpected: Dragged == Dropped!!! id = ' + target);
//            }
//            
//            var dropeeLinks = flo.getGraph().getConnectedLinks(dropee);
//            for (i = 0; i < dropeeLinks.length && !noSwap; i++) {
//                targetId = dropeeLinks[i].get('target').id;
//                sourceId = dropeeLinks[i].get('source').id;
//                noSwap = (side === 'top' && targetId === target.id && sourceId === dropee.id) || 
//                         (side === 'right' && targetId === dropee.id && sourceId === target.id);
//            }
//            return !noSwap;
//        }

        return {
            'createHandles': createHandles,
            'validatePort': validatePort,
            'validateLink': validateLink,
            'validateNode': validateNode,
            'preDelete': preDelete,
            'handleNodeDropping': handleNodeDropping,
            'calculateDragDescriptor': calculateDragDescriptor,
            'setDefaultContent': setDefaultContent,
            'interactive': {
                'vertexAdd': true
            },
            'allowLinkVertexEdit': true
        };

    }];

});
