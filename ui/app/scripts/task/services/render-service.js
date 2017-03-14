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
 * Flo Render service for Composed Task editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function(require) {
    'use strict';

    var joint = require('joint');

    var dagre = require('dagre');

   require('flo');

    var HANDLE_ICON_MAP = {
        'remove': 'images/icons/delete.svg',
        'properties': 'images/icons/cog.svg'
    };

    var DECORATION_ICON_MAP = {
        'error': 'images/icons/error.svg'
    };

    var IMAGE_W = 100;
    var IMAGE_H = 50;

    var CONTROL_NODE_SIZE = {
        width: 50,
        height: 50
    };

    var START_END_NODE_CENTRE_TRANSFORM = 'translate(' + CONTROL_NODE_SIZE.width / 2 + ' ' + CONTROL_NODE_SIZE.height/2 +')';

    var HORIZONTAL_PADDING = 5;

    joint.shapes.flo.TaskModule = joint.shapes.basic.Generic.extend({
        // extending Generic: http://stackoverflow.com/questions/23960312/can-i-add-new-attributes-in-jointjs-element
        markup:
        '<g class="composed-task">' +
        '<g class="shape">' +
        '<rect class="border"/>' +
        '<text class="label"/>' +
        '</g>' +
        '<circle class="input-port" />' +
        '<circle class="output-port" />' +
        '</g>',

        defaults: joint.util.deepSupplement({

            type: joint.shapes.flo.NODE_TYPE,
            position: {x: 0, y: 0},
            size: { width: IMAGE_W, height: IMAGE_H },
            attrs: {
                '.': { magnet: false },
                '.border': {
                    width: IMAGE_W,
                    height: IMAGE_H,
                    rx: 5,
                    ry: 5,
                    'stroke-width' : 1,
                    'stroke': '#34302D',
                    fill: '#6db33f'
                },
                '.input-port': {
                    r: 7,
                    type: 'input',
                    magnet: true,
                    fill: '#5fa134',
                    //transform: 'translate(' + (IMAGE_W/2) + ',' + 1 + ')',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0, // jointjs specific: relative position to ref'd element
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    stroke: '#34302D'
                },
                '.output-port': {
                    r: 7,
                    type: 'output',
                    magnet: true,
                    fill: '#5fa134',
                    //transform: 'translate(' + (IMAGE_W/2) + ',' + (IMAGE_H - 1) + ')',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.99999999, // jointjs specific: relative position to ref'd element
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    stroke: '#34302D',
                },
                '.label': {
                    //'text-anchor': 'middle',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.5, // jointjs specific: relative position to ref'd element
                    'y-alignment': 'middle',
                    'x-alignment': 'middle',
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    fill: 'white',
                    'font-family': 'Monospace',
                }
            },
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.flo.BatchLink = joint.dia.Link.extend({

        toolMarkup: [
            '<g class="link-tool composed-task">',
            '<g class="tool-remove" event="remove">',
            '<rect class="link-tools-container" width="47" height="22" transform="translate(-11 -11)"/>',
            '<circle r="11" />',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
            '<title>Remove link.</title>',
            '</g>',
            '<g class="tool-options" event="link:options">',
            '<circle r="11" transform="translate(25)"/>',
            '<path fill="white" transform="scale(.7) translate(20, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
            '<title>Properties</title>',
            '</g>',
            '</g>'
        ].join(''),

        arrowheadMarkup: [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<path class="marker-arrowhead" end="<%= end %>" d="M 16 0 L 0 8 L 16 16 z" />',
            '</g>'
        ].join(''),

        vertexMarkup: [
            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
            '<circle class="marker-vertex" idx="<%= idx %>" r="8" />',
            '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
            '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(8.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
            '<title>Remove vertex.</title>',
            '</path>',
            '</g>'
        ].join(''),

        defaults: joint.util.deepSupplement({
            attrs: {
                '.connection': { 'stroke-linecap': 'round'},
                '.marker-target': { d: 'M 5 0 L 0.67, 2.5 L 5 5 z', 'stroke-width' : 3},
                'props': {}
            }
        }, joint.dia.Link.prototype.defaults)
    });

    joint.shapes.flo.BatchStart = joint.shapes.basic.Generic.extend({
        markup: '<g class="composed-task"><g class="shape"><circle class="border" /><text class="label"/></g><circle class="output-port" /></g>',

        defaults: joint.util.deepSupplement({
            size: CONTROL_NODE_SIZE,
            attrs: {
                '.output-port': {
                    r: 7,
                    type: 'output',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0.99999999,
                    ref: '.border',
                    stroke: '#34302D',
                },
                '.border': {
                    r: CONTROL_NODE_SIZE.width / 2,
                    'stroke-width': 1,
                    fill: '#6db33f',
                    stroke: '#34302D',
                    transform: START_END_NODE_CENTRE_TRANSFORM
                },
                '.label': {
                    'text-anchor': 'middle',
                    transform: 'translate(' + CONTROL_NODE_SIZE.width/2 + ' -12)',
                    fill: 'black',
                    'font-family': 'Monospace',
                    'font-size': 20,
                    text: 'START'
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.flo.BatchEnd = joint.shapes.basic.Generic.extend({
        // Wrap ports in a dedicated group tag. Otherwise connection anchoring shape becomes the outer circle :-(
        markup: '<g class="composed-task"><g class="shape"><circle class="inner" /><circle class="outer"/><text class="label"/></g><g><circle class="input-port" /><circle class="output-port" /></g></g>',

        defaults: joint.util.deepSupplement({
            size: CONTROL_NODE_SIZE,
            attrs: {
                '.inner': { fill: '#6db33f', stroke: '#34302D', transform: START_END_NODE_CENTRE_TRANSFORM, r: CONTROL_NODE_SIZE.width / 2 - 10 },
                '.input-port': {
                    r: 7,
                    type: 'input',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0,
                    ref: '.outer',
                    stroke: '#34302D'
                },
                '.output-port': {
                    r: 7,
                    type: 'output',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0.99999999,
                    ref: '.outer',
                    stroke: '#34302D',
                },
                '.outer': {
                    fill: 'transparent',
                    stroke: '#34302D',
                    'stroke-width': 1,
                    transform: START_END_NODE_CENTRE_TRANSFORM,
                    r: CONTROL_NODE_SIZE.width / 2
                },
                '.label': {
                    //'text-anchor': 'middle',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.52, // jointjs specific: relative position to ref'd element
                    'x-alignment': 'middle',
                    'y-alignment': 'middle',
                    ref: '.', // jointjs specific: element for ref-x, ref-y
                    fill: 'white',
                    'font-family': 'Monospace',
                    'font-size': 10,
                    text: 'END'
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.flo.BatchSync = joint.shapes.basic.Generic.extend({
        markup: '<g class="composed-task"><g class="shape"><circle class="border" /><text class="label"/></g><circle class="input-port" /><circle class="output-port" /></g>',

        defaults: joint.util.deepSupplement({
            size: CONTROL_NODE_SIZE,
            attrs: {
                '.input-port': {
                    r: 7,
                    type: 'input',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0,
                    ref: '.border',
                    stroke: '#34302D'
                },
                '.output-port': {
                    r: 7,
                    type: 'output',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0.99999999,
                    ref: '.border',
                    stroke: '#34302D',
                },
                '.border': {
                    r: CONTROL_NODE_SIZE.width / 2,
                    'stroke-width': 1,
                    fill: '#6db33f',
                    stroke: '#34302D',
                    transform: START_END_NODE_CENTRE_TRANSFORM
                },
                '.label': {
                    //'text-anchor': 'middle',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.52, // jointjs specific: relative position to ref'd element
                    'y-alignment': 'middle',
                    'x-alignment': 'middle',
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    fill: 'white',
                    'font-family': 'Monospace',
                    text: 'SYNC'
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    var D = 7;
    var R = Math.max(CONTROL_NODE_SIZE.width, CONTROL_NODE_SIZE.height) / 2;

    var A = ((R - 7) - D / Math.sqrt(2)) / Math.sqrt(2);
    var B = D + A;

    joint.shapes.flo.BatchFail = joint.shapes.basic.Generic.extend({
        markup: '<g class="composed-task">' +
                '<g class="shape">' +
                '<circle class="border" />' +
                '<path class="fail-cross" d="M ' + (-D) + ',0' + ' ' + (-B) + ',' + (-A) + ' ' + (-A) + ',' + (-B) + ' 0' + ',' + (-D) + ' ' + (A) + ',' + (-B) + ' ' + B + ',' + (-A) + ' ' + D + ',0' + ' ' + B + ',' + A + ' ' + A + ',' + B + ' 0,' + D + ' ' + (-A) + ',' + B + ' ' + (-B) + ',' + A + 'z" />' +
                '<text class="label"/>' +
                '</g>' +
                '<circle class="input-port" /><circle class="output-port" />' +
                '</g>',

        defaults: joint.util.deepSupplement({
            size: CONTROL_NODE_SIZE,
            attrs: {
                '.input-port': {
                    r: 7,
                    type: 'input',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0,
                    ref: '.border',
                    stroke: '#34302D'
                },
                '.output-port': {
                    r: 7,
                    type: 'output',
                    magnet: true,
                    fill: '#5fa134',
                    'ref-x': 0.5,
                    'ref-y': 0.99999999,
                    ref: '.border',
                    stroke: '#34302D',
                },
                '.border': {
                    r: R,
                    'stroke-width': 1,
                    fill: '#6db33f',
                    stroke: '#34302D',
                    transform: START_END_NODE_CENTRE_TRANSFORM
                },
                '.fail-cross': {
                    stroke: '#34302D',
                    fill: '#34302D',
                    transform: START_END_NODE_CENTRE_TRANSFORM
                },
                '.label': {
//                    'text-anchor': 'middle',
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.52, // jointjs specific: relative position to ref'd element
                    'x-alignment': 'middle',
                    'y-alignment': 'middle',
                    'ref':'.',
//                    transform: 'translate(' + CONTROL_NODE_SIZE.width/2 + ' ' + (CONTROL_NODE_SIZE.height + 2) + ')',
                    fill: 'white',
                    'font-family': 'Monospace',
                    'font-size': 20,
                    text: 'FAIL'
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    return ['ComposedTasksMetamodelService', 'MetamodelUtils', 'DataflowUtils', 'PropertiesDialogService', 'FloBootstrapTooltip',
        function(metamodelService, metamodelUtils, utils, propertiesDialogService, bootstrapTooltip) {

        function fitLabel(paper, node, labelPath) {
            var view = paper.findViewByModel(node);
            if (view) {
                view.update();
                var textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
                var width = joint.V(textView).bbox(false, paper.viewport).width;
                var label = node.attr(labelPath);
                var threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING;
                for (var i = 1; i < label.length && width > threshold; i++) {
                    node.attr(labelPath, label.substr(0, label.length - i) + '\u2026');
                    view.update();
                    width = joint.V(textView).bbox(false, paper.viewport).width;
                }
            }
        }

        function createHandle(kind) {
            return new joint.shapes.flo.ErrorDecoration({
                size: {width: 10, height: 10},
                attrs: {
                    'image': {
                        'xlink:href': HANDLE_ICON_MAP[kind]
                    }
                }
            });
        }

        function createDecoration(kind) {
            return new joint.shapes.flo.ErrorDecoration({
                size: {width: 16, height: 16},
                attrs: {
                    'image': {
                        'xlink:href': DECORATION_ICON_MAP[kind]
                    }
                }
            });
        }

        function createNode(metadata) {
            if (metadata.group === joint.shapes.flo.batch.CONTROL_NODES) {
                if (metadata.name === joint.shapes.flo.batch.START_NODE_TYPE) {
                    return new joint.shapes.flo.BatchStart();
                } else if (metadata.name === joint.shapes.flo.batch.END_NODE_TYPE) {
                    return new joint.shapes.flo.BatchEnd();
                } else if (metadata.name === joint.shapes.flo.batch.SYNC_NODE_TYPE) {
                    return new joint.shapes.flo.BatchSync();
                } else if (metadata.name === joint.shapes.flo.batch.FAIL_NODE_TYPE) {
                    return new joint.shapes.flo.BatchFail();
                }
            }
            return new joint.shapes.flo.TaskModule();
        }

        function createLink() {
            var link = new joint.shapes.flo.BatchLink();
            metamodelService.load().then(function(metamodel) {
                link.attr('metadata', metamodelUtils.getMetadata(metamodel, 'link', 'links'));
            });
            return link;
        }

        function initializeNewNode(node, data) {
            var metadata = node.attr('metadata');
            if (metadata) {
                if (metadata.group === joint.shapes.flo.batch.CONTROL_NODES) {
                    // nothing to do here yet for control nodes
                } else {
                    node.attr('.label/text', node.attr('metadata/name'));
                    node.attr('.image/xlink:href', metadata && metadata.icon ? metadata.icon : 'icons/xd/unknown.png');

                    if (data.paper && node.attr('.label/text')) {
                        fitLabel(data.paper, node, '.label/text');
                    }
                }

                var paper = data.paper;
                var canvasType = paper.model.get('type');
                var view = paper.findViewByModel(node);
                // Attach angular style tooltip to a app view
                if (view) {
                    if (canvasType === joint.shapes.flo.CANVAS_TYPE) {

                        // IMPORTANT: Need to go before the element to avoid extra compile cycle!!!!
                        // Attach tooltips to ports. No need to compile against scope because parent element is being compiled
                        // and no specific scope is attached to port tooltips
                        view.$('[magnet]').each(function(index, magnet) {
                            var port = magnet.getAttribute('type');
                            if (port === 'input') {
                                bootstrapTooltip.attachBootstrapTextTooltip(magnet, null, 'Input Port', 'top', 500);
                            } else if (port === 'output') {
                                bootstrapTooltip.attachBootstrapTextTooltip(magnet, null, 'Output Port', 'top', 500);
                            }
                        });

                        bootstrapTooltip.attachCanvasNodeTooltip(view, '.shape', metamodelService);
                    } else if (canvasType === joint.shapes.flo.PALETTE_TYPE) {
                        bootstrapTooltip.attachPaletteNodeTooltip(view);
                    }
                }

            }
        }

        function refreshVisuals(element, changedPropertyPath, paper) {
            if (element instanceof joint.dia.Element && element.attr('metadata')) {
                if (changedPropertyPath.match(/.label*\/text/)) {
                    fitLabel(paper, element, changedPropertyPath);
                } else if (changedPropertyPath === 'node-label') {
                    var nodeLabel = element.attr('node-label');
                    // fitLabel() calls update as necessary, so set label text silently
                    element.attr('.label/text', nodeLabel ? nodeLabel : element.attr('metadata/name'));
                    fitLabel(paper, element, '.label/text');
                }
            }

            if (element instanceof joint.dia.Link && element.attr('metadata')) {
                if (changedPropertyPath === 'props/ExitStatus') {
                    //console.log('LINK LABEL: ' + element.attr('props/ExitStatus'));
                    element.set('labels', [
                        {
                            position: 0.5,
                            attrs: {
                                text: {
                                    text: element.attr('props/ExitStatus') || '',
                                    'stroke': 'black',
                                    'stroke-width': 1,
                                    'fill': 'black'
                                },
                                rect: {
                                    'fill': 'transparent',
                                    'stroke-width': 0
                                }
                            }
                        }
                    ]);
                    var view = paper.findViewByModel(element);
                    if (element.attr('props/ExitStatus')) {
                        _.each(view.el.querySelectorAll('.connection, .marker-source, .marker-target'), function(connection) {
                            joint.V(connection).addClass('composed-task-graph-transition');
                        });
                    } else {
                        _.each(view.el.querySelectorAll('.connection, .marker-source, .marker-target'), function(connection) {
                            joint.V(connection).removeClass('composed-task-graph-transition');
                        });
                    }
                }
            }
        }

        /**
         * After a link is constructed it is initialized, this is a chance to fill in the label for it
         * (which is used as the title in the properties view for it).
         */
        function initializeNewLink(link,context) { // context contains paper and graph
        	var paper = context.paper;
        	var sourceId = link.get('source');
        	var targetId = link.get('target');
        	var sourceElement = paper.findViewByModel(sourceId);
        	var targetElement = paper.findViewByModel(targetId);
        	var sourceLabel = sourceElement.model.attr('.label/text');
        	var targetLabel = targetElement.model.attr('.label/text');
        	link.attr('.label/text','Link from \''+sourceLabel+'\' to \''+targetLabel+'\'');
        	refreshVisuals(link,'props/ExitStatus',paper); // TODO this was set early on, why is this call required here?
        }

        function getLinkView() {
            return joint.dia.LinkView.extend({
                options: joint.util.deepSupplement({
                    'doubleLinkTools': true
                }, joint.dia.LinkView.prototype.options),

                _beforeArrowheadMove: function() {
                    if (this.model.get('source').id) {
                        this._oldSource = this.model.get('source');
                    }
                    if (this.model.get('target').id) {
                        this._oldTarget = this.model.get('target');
                    }
                    joint.dia.LinkView.prototype._beforeArrowheadMove.apply(this, arguments);
                },

                _afterArrowheadMove: function() {
                    joint.dia.LinkView.prototype._afterArrowheadMove.apply(this, arguments);
                    if (!this.model.get('source').id) {
                        if (this._oldSource) {
                            this.model.set('source', this._oldSource);
                        } else {
                            this.model.remove();
                        }
                    }
                    if (!this.model.get('target').id) {
                        if (this._oldTarget) {
                            this.model.set('target', this._oldTarget);
                        } else {
                            this.model.remove();
                        }
                    }
                    delete this._oldSource;
                    delete this._oldTarget;
                }

            });
        }

        function isSemanticProperty(propertyPath) {
            return propertyPath.match(/.label*\/text/) ||
                    propertyPath === 'node-label';
        }

        function layout(paper) {
            var start, end, empty = true;
            var deferred = utils.$q.defer();
            var graph = paper.model;

            var gridSize = paper.options.gridSize;
            if (gridSize <= 1) {
                gridSize = IMAGE_H / 2;
            }

            var g = new dagre.graphlib.Graph();
            g.setGraph({});
            g.setDefaultEdgeLabel(function () {
                return {};
            });

            graph.getElements().forEach(function (node) {
                // ignore embedded cells
                if (!node.get('parent')) {
                    g.setNode(node.id, node.get('size'));

                    // Determine start and end node
                    if (node.attr('metadata/name') === joint.shapes.flo.batch.START_NODE_TYPE && node.attr('metadata/group') === joint.shapes.flo.batch.CONTROL_NODES) {
                        start = node;
                    } else if (node.attr('metadata/name') === joint.shapes.flo.batch.END_NODE_TYPE && node.attr('metadata/group') === joint.shapes.flo.batch.CONTROL_NODES) {
                        end = node;
                    } else {
                        empty = false;
                    }
                }
            });

            graph.getLinks().forEach(function (link) {
                if (link.get('source').id && link.get('target').id) {
                    g.setEdge(link.get('source').id, link.get('target').id);
                    link.set('vertices', []);
                }
            });

            if (empty && start && end) {
                // Only start and end node are present
                // In this case ensure that start is located above the end. Fake a link between start and end nodes
                g.setEdge(start.get('id'), end.get('id'), {
                    minlen: 7
                });
            }

            g.graph().rankdir = 'TB';
            g.graph().marginx = gridSize;
            g.graph().marginy = gridSize;
            g.graph().nodesep = 2 * gridSize;
            g.graph().ranksep = 2 * gridSize;
            g.graph().edgesep = gridSize;

            dagre.layout(g);
            g.nodes().forEach(function (v) {
                var node = graph.getCell(v);
                if (node) {
                    var bbox = node.getBBox();
                    node.translate((g.node(v).x - g.node(v).width / 2) - bbox.x, (g.node(v).y - g.node(v).height / 2) - bbox.y);
                }
            });

            g.edges().forEach(function (o) {
                var edge = g.edge(o);
                console.log(JSON.stringify(edge.points));
            });
            deferred.resolve();

            return deferred.promise;

        }

        /**
         * When the source or target is changed for a link the label text needs to be updated.
         */
        function handleLinkEvent(paper, event, link) {
            if (event === 'remove') {
                // Ignore link removal events
                return;
            }
            if (event === 'options') {
                propertiesDialogService.show(link);
                return;
            }
            var sourceId = link.get('source');
            var targetId = link.get('target');
            // Ids could be an object with an id, or just a position {x:...,y:...}
            if (!sourceId.id || !targetId.id) {
                return false; // Ignore if they are position references
            }
            var sourceElement = paper.findViewByModel(sourceId);
            var targetElement = paper.findViewByModel(targetId);
            var sourceLabel = sourceElement.model.attr('.label/text');
            var targetLabel = targetElement.model.attr('.label/text');
            link.attr('.label/text','Link from \''+sourceLabel+'\' to \''+targetLabel+'\'');
            return true;
        }

        /**
        * Sets some initialization data on the handle Joint JS model object (view present)
        *
        * @param handle Joint JS model object for handle
        */
        function initializeNewHandle(handle, data) {
            // Attach angular-bootstrap-ui tooltip to handles
            if (data.paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE) {
                bootstrapTooltip.attachHandleTooltip(data.paper.findViewByModel(handle));
            }
        }

        /**
        * Sets some initialization data on the decoration Joint JS view object
        *
        * @param decoration Joint JS model object for decoration
        * @param data the data object holding references to paper and graph objects
        */
        function initializeNewDecoration(decoration, data) {
            // Attach angular-bootstrap-ui tooltip to error marker
            if (data.paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE && decoration.attr('./kind') === 'error') {
                bootstrapTooltip.attachErrorMarkerTooltip(data.paper.findViewByModel(decoration));
            }
        }

        function getNodeView() {
            return joint.dia.ElementView.extend({
                options: joint.util.deepSupplement({}, joint.dia.ElementView.prototype.options),

                render: function () {
                    joint.dia.ElementView.prototype.render.apply(this, arguments);
                    var type = this.model.get('type');
                    var contextData = {
                        paper: this.paper,
                        graph: this.paper.graph
                    };
                    if (type === joint.shapes.flo.NODE_TYPE) {
                        initializeNewNode(this.model, contextData);
                    } else if (type === joint.shapes.flo.DECORATION_TYPE) {
                        initializeNewDecoration(this.model, contextData);
                    } else if (type === joint.shapes.flo.HANDLE_TYPE) {
                        initializeNewHandle(this.model, contextData);
                    }
                }

            });
        }

        /*
         * Initialize node, handle and decoration are called when View object render is called. Hence no need
         * for Core Flo to call them. Otherwise we end up with 2 tooltips (one from render, one from core Flo init)
         */
        return {
            'createHandle': createHandle,
            'createDecoration': createDecoration,
            'createNode': createNode,
            'createLink': createLink,
            // 'initializeNewNode': initializeNewNode,
            'initializeNewLink': initializeNewLink,
            // 'initializeNewHandle': initializeNewHandle,
            // 'initializeNewDecoration': initializeNewDecoration,
            'handleLinkEvent': handleLinkEvent,
            'getNodeView': getNodeView,
            'getLinkView': getLinkView,
            'refreshVisuals': refreshVisuals,
            'layout': layout,
            'isSemanticProperty': isSemanticProperty
        };
    }];

});