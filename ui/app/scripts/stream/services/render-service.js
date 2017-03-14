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

/**
 * Render Service for Flo based Stream Definition graph editor
 *
 * @author Alex Boyko
 * @author Andy Clement
 */
define(function(require) {
    'use strict';

    var joint = require('joint');
    require('flo');
    var layout = require('stream/services/layout');
    var utils = require('stream/services/utils');

    var HANDLE_ICON_MAP = {
        'remove': 'images/icons/delete.svg',
        'properties': 'images/icons/cog.svg'
    };

    var HANDLE_ICON_SIZE = {
        'remove': {width: 10, height: 10},
        'properties': {width: 11, height: 11}
    };

    var DECORATION_ICON_MAP = {
        'error': 'images/icons/error.svg'
    };

    var IMAGE_W = 120,
        IMAGE_H = 40;

    var HORIZONTAL_PADDING = 5;

    joint.shapes.flo.DataFlowApp = joint.shapes.basic.Generic.extend({

        markup:
        '<g class="stream-module">' +
            '<g class="shape">'+
                '<rect class="box"/>'+
                '<text class="label1"/>'+
                '<text class="label2"/>'+
            '</g>' +
            '<text class="stream-label"/>'+
            '<rect class="input-port" />'+
            '<rect class="output-port"/>'+
            '<circle class="tap-port"/>' +
        '</g>',

        defaults: joint.util.deepSupplement({

            type: joint.shapes.flo.NODE_TYPE,
            position: {x: 0, y: 0},
            size: { width: IMAGE_W, height: IMAGE_H },
            attrs: {
                '.': {
                    magnet: false,
                },
                '.box': {
                    width: IMAGE_W,
                    height: IMAGE_H,
                    rx: 2,
                    ry: 2,
                    //'fill-opacity':0, // see through
                    stroke: '#6db33f',
                    fill: '#eeeeee',
                    'stroke-width': 2,
                },
                '.input-port': {
                    type: 'input',
                    port: 'input',
                    height: 8, width: 8,
                    magnet: true,
                    fill: '#eeeeee',
                    transform: 'translate(' + -4 + ',' + ((IMAGE_H/2)-4) + ')',
                    stroke: '#34302d',
                    'stroke-width': 1,
                },
                '.output-port': {
                    type: 'output',
                    port: 'output',
                    height: 8, width: 8,
                    magnet: true,
                    fill: '#eeeeee',
                    transform: 'translate(' + (IMAGE_W-4) + ',' + ((IMAGE_H/2)-4) + ')',
                    stroke: '#34302d',
                    'stroke-width': 1,
                },
                '.tap-port': {
                    type: 'output',
                    port: 'tap',
                    r: 4,
                    magnet: true,
                    fill: '#eeeeee',
                    'ref-x': 0.5,
                    'ref-y': 0.99999999,
                    ref: '.box',
                    stroke: '#34302D'
                },
                '.label1': {
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.525,
                    'y-alignment': 'middle',
                    'x-alignment' : 'middle',
                    ref: '.box', // jointjs specific: element for ref-x, ref-y
                    fill: 'black',
                    'font-size': 14
                },
                '.label2': {
                    'y-alignment': 'middle',
                    'ref-x': HORIZONTAL_PADDING+2, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.55, // jointjs specific: relative position to ref'd element
                    ref: '.box', // jointjs specific: element for ref-x, ref-y
                    fill: 'black',
                    'font-size': 20
                },
                '.stream-label': {
                    'x-alignment': 'middle',
                    'y-alignment': -0.999999,
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0, // jointjs specific: relative position to ref'd element
                    ref: '.box', // jointjs specific: element for ref-x, ref-y
                    fill: '#AAAAAA',
                    'font-size': 15
                },
                '.shape': {
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.flo.LinkDataflow = joint.dia.Link.extend({
        defaults: joint.util.deepSupplement({
            type: joint.shapes.flo.LINK_TYPE,
            smooth: true,
            attrs: {
                '.connection': { stroke: '#34302d', 'stroke-width': 2 },
                '.connection-wrap': { display : 'none' },
                '.marker-arrowheads': { display: 'none' },
                '.tool-options': { display: 'none' }
            },
        }, joint.dia.Link.prototype.defaults)
    });


    return ['$compile', '$rootScope', '$log', 'StreamMetamodelService', 'FloBootstrapTooltip', function($compile, $rootScope, $log, metamodelService, bootstrapTooltip) {

        function fitLabel(paper, node, labelPath) {
            var label = node.attr(labelPath);
            if (label && label.length<9) {
                return;
            }
            var view = paper.findViewByModel(node);
            if (view && label) {
                var textView = view.findBySelector(labelPath.substr(0, labelPath.indexOf('/')))[0];
                var offset = 0;
                if (node.attr('.label2/text')) {
                    var label2View = view.findBySelector('.label2')[0];
                    if (label2View) {
                        var box = joint.V(label2View).bbox(false, paper.viewport);
                        offset = HORIZONTAL_PADDING + box.width;
                    }
                }
                var width = joint.V(textView).bbox(false, paper.viewport).width;
                var threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING - offset;
                if (offset) {
                    node.attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), { silent: true });
                }
                for (var i = 1; i < label.length && width > threshold; i++) {
                    node.attr(labelPath, label.substr(0, label.length - i) + '\u2026', { silent: true });
                    view.update();
                    width = joint.V(textView).bbox(false, paper.viewport).width;
                    if (offset) {
                        node.attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), { silent: true });
                    }
                }
                view.update();
            }
        }

        function createHandle(kind) {
            return new joint.shapes.flo.ErrorDecoration({
                size: HANDLE_ICON_SIZE[kind],
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
            if (metadata.group === 'source') {
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
                                'text': metadata.metadata.unicodeChar
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else if (metadata.group === 'processor') {
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
                                'text': metadata.metadata.unicodeChar
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else if (metadata.group === 'sink') {
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.tap-port': {
                                display: 'none'
                            },
                            '.output-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': metadata.metadata.unicodeChar
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else if (metadata.group === 'task') {
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eef4ee'
                            },
                            '.tap-port': {
                                display: 'none'
                            },
                            '.output-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': metadata.metadata.unicodeChar
                            },
                            '.stream-label': {
                                display: 'none'
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else if (metadata.name === 'tap') {
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
                            '.tap-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': metadata.metadata.unicodeChar
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else if (metadata.name === 'destination') {
                return new joint.shapes.flo.DataFlowApp(
                    joint.util.deepSupplement({
                        attrs: {
                            '.box': {
                                'fill': '#eeeeff',
                                'stroke': '#0000ff'
                            },
                            '.tap-port': {
                                display: 'none'
                            },
                            '.label1': {
                                'text': metadata.name
                            },
                            '.label2': {
                                'text': metadata.metadata.unicodeChar
                            }
                        }
                    }, joint.shapes.flo.DataFlowApp.prototype.defaults)
                );
            } else {
                return new joint.shapes.flo.DataFlowApp();
            }
        }

        function initializeNewLink(link) {
            link.set('smooth', true);
        }

        function isSemanticProperty(propertyPath) {
            return propertyPath === 'node-name' || propertyPath === 'stream-name';
        }

        function refreshVisuals(element, changedPropertyPath, paper) {
            var metadata = element.attr('metadata');
            var type = metadata ? metadata.name : undefined;
            if (changedPropertyPath === 'stream-name') {
                element.attr('.stream-label/text', element.attr('stream-name'));
                element.attr('.stream-label/display', utils.canBeHeadOfStream(paper.model, element) ? 'block' : 'none');
            } else if ((type === 'destination' || type === 'tap') && changedPropertyPath === 'props/name') {
                // fitLabel() calls update as necessary, so set label text silently
                element.attr('.label1/text', element.attr('props/name') ? element.attr('props/name') : element.attr('metadata/name'));
                fitLabel(paper, element, '.label1/text');
            } else if (changedPropertyPath === 'props/language') {
                /*
                 * Check if 'language' property has changed and 'script' property is present
                 */
                metadata.get('properties').then(function(properties) {
                    if (properties.script && properties.script.source) {
                        properties.script.source.type = element.attr('props/language');
                        properties.script.source.mime = element.attr('props/language') === 'javascript' ? 'text/javascript' : 'text/x-' + element.attr('props/language');
                    }
                });
            } else if (changedPropertyPath === 'node-name') {
                var nodeName =  element.attr('node-name');
                // fitLabel() calls update as necessary, so set label text silently
                element.attr('.label1/text', nodeName ? nodeName : element.attr('metadata/name'));
                fitLabel(paper, element, '.label1/text');
            }
        }

        function initializeNewNode(view) {
            var node = view.model;
            var metadata = node.attr('metadata');
            if (metadata) {
                var paper = view.paper;
                var isPalette = paper.model.get('type') === joint.shapes.flo.PALETTE_TYPE;
                var isCanvas = paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE;
                if (metadata.name === 'tap') {
                    refreshVisuals(node, 'props/name', paper);
                } else if (metadata.name === 'destination') {
                    refreshVisuals(node, 'props/name', paper);
                } else {
                    refreshVisuals(node, 'node-name', paper);
                }

                if (isCanvas) {
                    refreshVisuals(node, 'stream-name', paper);
                }

                // Attach angular style tooltip to a app view
                if (view) {
                    if (isCanvas) {

                        // IMPORTANT: Need to go before the element to avoid extra compile cycle!!!!
                        // Attach tooltips to ports. No need to compile against scope because parent element is being compiled
                        // and no specific scope is attached to port tooltips
                        view.$('[magnet]').each(function(index, magnet) {
                            var port = magnet.getAttribute('port');
                            if (port === 'input') {
                                bootstrapTooltip.attachBootstrapTextTooltip(magnet, null, 'Input Port', 'top', 500);
                            } else if (port === 'output') {
                                bootstrapTooltip.attachBootstrapTextTooltip(magnet, null, 'Output Port', 'top', 500);
                            } else if (port === 'tap') {
                                bootstrapTooltip.attachBootstrapTextTooltip(magnet, null, 'Tap Port', 'top', 500);
                            }
                        });

                        bootstrapTooltip.attachCanvasNodeTooltip(view, '.shape', metamodelService);
                    } else if (isPalette) {
                        bootstrapTooltip.attachPaletteNodeTooltip(view);
                    }
                }
            }
        }

        /**
         * Sets some initialization data on the decoration Joint JS view object
         *
         * @param view Joint JS view object for decoration
         */
        function initializeNewDecoration(view) {
            // Attach angular-bootstrap-ui tooltip to error marker
            if (view.paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE && view.model.attr('./kind') === 'error') {
                bootstrapTooltip.attachErrorMarkerTooltip(view);
            }
        }

        /**
         * Sets some initialization data on the handle Joint JS view object
         *
         * @param view Joint JS view object for handle
         */
        function initializeNewHandle(view) {
            // Attach angular-bootstrap-ui tooltip to handles
            if (view.paper.model.get('type') === joint.shapes.flo.CANVAS_TYPE) {
                bootstrapTooltip.attachHandleTooltip(view);
            }
        }

        function createLink() {
            return new joint.shapes.flo.LinkDataflow();
        }

        function getLinkView() {
            return joint.dia.LinkView.extend({
                options: joint.util.deepSupplement({
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

        function getNodeView() {
            return joint.dia.ElementView.extend({
                options: joint.util.deepSupplement({
                }, joint.dia.ElementView.prototype.options),

                render: function() {
                    joint.dia.ElementView.prototype.render.apply(this, arguments);
                    var type = this.model.get('type');
                    if (type === joint.shapes.flo.NODE_TYPE) {
                        initializeNewNode(this);
                    } else if (type === joint.shapes.flo.DECORATION_TYPE) {
                        initializeNewDecoration(this);
                    } else if (type === joint.shapes.flo.HANDLE_TYPE) {
                        initializeNewHandle(this);
                    }
                }

            });
        }

        function handleLinkSourceChanged(link, paper) {
            var graph = paper.model;
            var newSourceId = link.get('source').id;
            var oldSourceId = link.previous('source').id;
            var targetId = link.get('target').id;
            if (newSourceId !== oldSourceId) {
                var newSource = graph.getCell(newSourceId);
                var oldSource = graph.getCell(oldSourceId);
                var target = graph.getCell(targetId);
                // Show input port for 'destination' if outgoing links are gone
                if (oldSource && oldSource.attr('metadata/name') === 'destination' /*&& graph.getConnectedLinks(oldSource, {outbound: true}).length === 0*/) {
                    // No outgoing links -> hide stream name label
                    // Set silently, last attr call would refresh the view
                    oldSource.attr('.stream-label/display', 'none', { silent: true });

                    // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
                    oldSource.attr('.input-port/display', 'block');
                }
                // Hide input port for destination if it has a new outgoing link
                if (newSource && newSource.attr('metadata/name') === 'destination') {
                    // Has outgoing link, there shouldn't be any incoming links yet -> show stream name label
                    // Set silently, last attr call would refresh the view
                    newSource.attr('.stream-label/display', 'block', { silent: true });

                    newSource.attr('.input-port/display', 'none');
                }

                // If tap link has been reconnected update the stream-label for the target if necessary
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

        function handleLinkTargetChanged(link, paper) {
            var graph = paper.model;
            var newTargetId = link.get('target').id;
            var oldTargetId = link.previous('target').id;
            if (newTargetId !== oldTargetId) {
                var oldTarget = graph.getCell(oldTargetId);
                if (oldTarget) {
                    if (oldTarget.attr('metadata/name') === 'destination') {
                        // old target is a destination. Ensure output port is showing now since incoming links are gone

                        // No more incoming links, there shouldn't be any outgoing links yet -> indeterminate, hide stream label
                        // Set silently, last attr call would refresh the view
                        oldTarget.attr('.stream-label/display', 'none', { silent: true });

                        // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
                        oldTarget.attr('.output-port/display', 'block');
                    }
                }
                var newTarget = graph.getCell(newTargetId);
                if (newTarget) {
                    if (newTarget.attr('metadata/name') === 'destination') {
                        // Incoming link -> hide stream name label
                        // Set silently, last attr call would refresh the view
                        newTarget.attr('.stream-label/display', 'none', { silent: true });

                        // new target is destination? Hide output port then.
                        newTarget.attr('.output-port/display', 'none');
                    }
                }

                // If tap link has been reconnected update the stream-label for the new target and old target
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

        function handleLinkRemoved(link, paper) {
            var graph = paper.model;
            var source = graph.getCell(link.get('source').id);
            var target = graph.getCell(link.get('target').id);
            var view;
            if (source && source.attr('metadata/name') === 'destination' && graph.getConnectedLinks(source, {outbound: true}).length === 0) {
                // No more outgoing links, can't be any incoming links yet -> indeterminate, hide stream name label
                // Set silently, last attr call would refresh the view
                source.attr('.stream-label/display', 'none', { silent: true });
                source.removeAttr('.input-port/display');
                view = paper.findViewByModel(source);
                if (view) {
                    view.update();
                }
            }
            if (target && target.attr('metadata/name') === 'destination' && graph.getConnectedLinks(target, {inbound: true}).length === 0) {
                // No more incoming links, there shouldn't be any outgoing links yet -> leave stream label hidden
                // Set silently, last attr call would refresh the view
                target.attr('.stream-label/display', 'none', { silent: true });
                target.removeAttr('.output-port/display');
                view = paper.findViewByModel(target);
                if (view) {
                    view.update();
                }
            }
            // If tap link is removed update stream-name value for the target, i.e. don't display stream anymore
            if (link.get('source').port === 'tap' && target) {
                target.attr('.stream-label/display', 'none');
            }
        }

        function handleLinkAdded(link, paper) {
            var graph = paper.model;
            var source = graph.getCell(link.get('source').id);
            var target = graph.getCell(link.get('target').id);
            if (source && source.attr('metadata/name') === 'destination') {
                // New outgoing link added, there can't be any incoming links yet -> show stream label
                // Set silently because explicit update is called next
                source.attr('.stream-label/display', 'block', { silent: true });
                source.attr('.input-port/display', 'none');
            }
            if (target && target.attr('metadata/name') === 'destination') {
                // Incoming link has been added -> hide stream label
                // Set silently because update will be called for the next property setting
                target.attr('.stream-label/display', 'none', { silent: true });
                target.attr('.output-port/display', 'none');
            }
            // If tap link has been added update the stream-label for the target
            if (link.get('source').port === 'tap' && target) {
                target.attr('.stream-label/display', 'block');
            }
        }

        function handleLinkEvent(paper, event, link) {
            if (event === 'change:source') {
                handleLinkSourceChanged(link, paper);
            } else if (event === 'change:target') {
                handleLinkTargetChanged(link, paper);
            } else if (event === 'remove') {
                handleLinkRemoved(link, paper);
            } else if (event === 'add') {
                handleLinkAdded(link, paper);
            }
        }

        function getLinkAnchorPoint(linkView, view, magnet, reference) {
            if (magnet) {
                var type = magnet.getAttribute('type');
                var bbox = joint.V(magnet).bbox(false, linkView.paper.viewport);
                var rect = joint.g.rect(bbox);
                if (type === 'input') {
                    return joint.g.point(rect.x, rect.y + rect.height / 2);
                } else {
                    //if (magnet.getAttribute('class') === 'tap-port') {
                    //    return joint.g.point(rect.x + rect.width / 2, rect.y + rect.height);
                    //} else {
                    return joint.g.point(rect.x + rect.width, rect.y + rect.height / 2);
                    //}
                }
            } else {
                return reference;
            }
        }

        return {
            'createNode': createNode,
            'createLink': createLink,
            'createHandle': createHandle,
            'createDecoration': createDecoration,
            'getLinkView': getLinkView,
            'getNodeView': getNodeView,
            'layout': layout,
            'initializeNewLink': initializeNewLink,
            'handleLinkEvent': handleLinkEvent,
            'isSemanticProperty': isSemanticProperty,
            'refreshVisuals': refreshVisuals,
            'getLinkAnchorPoint': getLinkAnchorPoint
        };

    }];

});
