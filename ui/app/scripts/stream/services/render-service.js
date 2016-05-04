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

    joint.shapes.flo.ModuleXD = joint.shapes.basic.Generic.extend({

        markup:
        '<g class="shape">'+
            '<rect class="border"/>' +
            '<rect class="box"/>'+
            '<text class="label1"/>'+
            '<text class="label2"/>'+
        '</g>' +
        '<text class="stream-label"/>'+
        '<rect class="input-port" />'+
        '<rect class="output-port"/>'+
        '<circle class="tap-port"/>',

        defaults: joint.util.deepSupplement({

            type: joint.shapes.flo.NODE_TYPE,
            position: {x: 0, y: 0},
            size: { width: IMAGE_W, height: IMAGE_H },
            attrs: {
                '.': {
                    magnet: false,
                },
                // rounded edges around image
                '.border': {
                    width: IMAGE_W,
                    height: IMAGE_H,
                    rx: 2,
                    ry: 2,
                    'fill-opacity':0, // see through
                    stroke: '#eeeeee',
                    'stroke-width': 0,
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
                    ref: '.border',
                    stroke: '#34302D'
                },
                '.label1': {
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.525,
                    'y-alignment': 'middle',
                    'x-alignment' : 'middle',
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    fill: 'black',
                    'font-size': 14
                },
                '.label2': {
//	            	'text': '\u2603', //snowman thing
//	            	'text': '\u263A',// smiley
//                    'text': '\u21d2',
                    'y-alignment': 'middle',
                    'ref-x': HORIZONTAL_PADDING+2, // jointjs specific: relative position to ref'd element
                    'ref-y': 0.55, // jointjs specific: relative position to ref'd element
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    fill: 'black',
                    'font-size': 20
                },
                '.stream-label': {
                    'x-alignment': 'middle',
                    'y-alignment': -0.999999,
                    'ref-x': 0.5, // jointjs specific: relative position to ref'd element
                    'ref-y': 0, // jointjs specific: relative position to ref'd element
                    ref: '.border', // jointjs specific: element for ref-x, ref-y
                    fill: '#AAAAAA',
                    'font-size': 15
                },
                '.shape': {
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.flo.LinkXD = joint.dia.Link.extend({
        defaults: joint.util.deepSupplement({
            type: joint.shapes.flo.LINK_TYPE,
            smooth: true,
            attrs: {
                '.connection': { stroke: '#34302d', 'stroke-width': 2 },
                '.connection-wrap': { display : 'none' },
//	            '.marker-source': { stroke: '#9B59B6', fill: '#9B59B6', d: 'M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z' },
//	            '.marker-target': { stroke: '#F39C12', fill: '#F39C12', d: 'M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z' },

//	        	'.connection': { 'stroke':'black'},
//	        	'.': { filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } } },
//	        	'.connection': { 'stroke-width': 10, 'stroke-linecap': 'round' },
                // This means: moveto 10 0, lineto 0 5, lineto, 10 10 closepath(z)
//	        	'.marker-target': { d: 'M 5 0 L 0 7 L 5 14 z', stroke: '#34302d','stroke-width' : 1},
//	        	'.marker-target': { d: 'M 14 2 L 9,2 L9,0 L 0,7 L 9,14 L 9,12 L 14,12 z', 'stroke-width' : 1, fill: '#34302d', stroke: '#34302d'},
//	        	'.marker-source': {d: 'M 5 0 L 5,10 L 0,10 L 0,0 z', 'stroke-width' : 0, fill: '#34302d', stroke: '#34302d'},

//	            '.marker-target': { stroke: '#E74C3C', fill: '#E74C3C', d: 'M 10 0 L 0 5 L 10 10 z' },
                '.marker-arrowheads': { display: 'none' },
                '.tool-options': { display: 'none' }
            },
//	    	connector: { name: 'normalDimFix' }
        }, joint.dia.Link.prototype.defaults)
    });


    return ['$compile', '$rootScope', '$log', 'StreamMetamodelServiceXD', function($compile, $rootScope, $log, metamodelService) {

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
                var width = joint.V(textView).bbox(false, paper.viewport).width; // jshint ignore:line
                var threshold = IMAGE_W - HORIZONTAL_PADDING - HORIZONTAL_PADDING - offset;
                if (offset) {
                    node.attr('.label1/ref-x', Math.max((offset + HORIZONTAL_PADDING + width / 2) / IMAGE_W, 0.5), { silent: true });
                }
                for (var i = 1; i < label.length && width > threshold; i++) {
                    node.attr(labelPath, label.substr(0, label.length - i) + '\u2026', { silent: true });
                    view.update();
                    width = joint.V(textView).bbox(false, paper.viewport).width; // jshint ignore:line
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

        function createNewNode(metadata) {
            if (metadata.group === 'source') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else if (metadata.group === 'processor') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else if (metadata.group === 'sink') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else if (metadata.group === 'task') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else if (metadata.name === 'tap') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else if (metadata.name === 'destination') {
                return new joint.shapes.flo.ModuleXD(
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
                    }, joint.shapes.flo.ModuleXD.prototype.defaults)
                );
            } else {
                return new joint.shapes.flo.ModuleXD();
            }
        }

        /**
         * Attached angular-bootstrap-ui text tooltip to Joint JS view
         *
         * @param domElement DOM element
         * @param scope Tooltip compilation scope
         * @param tooltip Tooltip text
         * @param location Tooltip location
         * @param delay Tooltip appearance delay in milliseconds
         * @param tooltipClass Tooltip CSS class
         */
        function attachBootstrapTextTooltip(domElement, scope, tooltip, location, delay, tooltipClass) {
            // Set tooltip attributes on the DOM element.
            domElement.setAttribute('tooltip-placement', location);
            domElement.setAttribute('tooltip', tooltip);
            domElement.setAttribute('tooltip-append-to-body', true);
            if (typeof delay === 'number') {
                domElement.setAttribute('tooltip-popup-delay', delay);
            }
            if (typeof tooltipClass === 'string' && tooltipClass) {
                domElement.setAttribute('tooltip-class', tooltipClass);
            }

            if (scope && typeof scope.disabled === 'boolean') {
                // 2-way binding for disabled attribute to be able to enable/disable tooltip programatically via scope.disabled property
                // Use 'disabled' attribute rather than 'tooltip-enable' which just enables/disables triggers for showing/hiding tooltip
                // Disabled attribute change to true would also cancel scheduled tooltip appearance
                domElement.setAttribute('disabled', '{{disabled}}');
            }

            if (scope && typeof scope.tooltipIsOpen === 'boolean') {
                // 2-way binding for tooltip-is-open attribute to be able to close tooltip programatically via scope.tooltipIsOpen property
                domElement.setAttribute('tooltip-is-open', 'tooltipIsOpen');
            }

            // Destroy scope when DOM node is destroyed
            if (scope) {
                $(domElement).on('$destroy', function() {
                    scope.$destroy();
                });
            }
        }

        /**
         * Attached angular-bootstrap-ui HTML template tooltip to Joint JS view.
         * Adds necessary content to the DOM, disables default tooltips
         *
         * @param domElement dom element
         * @param scope Tooltip compilation scope
         * @param template HTML template for the tooltip content
         * @param placement Tooltip's placement
         * @param delay Tooltips appearance delay in milliseconds
         * @param tooltipClass Tooltip CSS class
         */
        function attachBootstrapTemplateTooltip(domElement, scope, template, placement, delay, tooltipClass) {
            // Set tooltip attributes on the DOM element.
            domElement.setAttribute('tooltip-placement', placement);
            domElement.setAttribute('tooltip-append-to-body', true);
            if (typeof delay === 'number') {
                domElement.setAttribute('tooltip-popup-delay', delay);
            }
            if (typeof tooltipClass === 'string' && tooltipClass) {
                domElement.setAttribute('tooltip-class', tooltipClass);
            }
            domElement.setAttribute('tooltip-template', '\'' + template + '\'');

            if (scope && typeof scope.disabled === 'boolean') {
                // 2-way binding for disabled attribute to be able to enable/disable tooltip programatically via scope.disabled property
                // Use 'disabled' attribute rather than 'tooltip-enable' which just enables/disables triggers for showing/hiding tooltip
                // Disabled attribute change to true would also cancel scheduled tooltip appearance
                domElement.setAttribute('disabled', '{{disabled}}');
            }

            if (scope && typeof scope.tooltipIsOpen === 'boolean') {
                // 2-way binding for tooltip-is-open attribute to be able to close tooltip programatically via scope.tooltipIsOpen property
                domElement.setAttribute('tooltip-is-open', 'tooltipIsOpen');
            }

            // Destroy scope when DOM node is destroyed
            if (scope) {
                $(domElement).on('$destroy', function() {
                    scope.$destroy();
                });
            }

        }

        /**
         * Attach angular-bootstrap-ui tooltip to a module shape on the main canvas
         *
         * @param view module shape Joint JS view
         */
        function attachCanvasModuleTooltip(view) {
            var node = view.model;

            // Create scope for the tooltip
            var scope = $rootScope.$new(true);
            // Pass Joint JS model onto the tooltip scope
            scope.cell = node;
            // Template uses Object#keys function. Need to pass it on the scope to make it available to angular template compiler
            scope.keys = Object.keys;
            // Tooltip should be closed initially
            scope.tooltipIsOpen = false;

            // Track shape DnD event to hide the tooltip if DnD started
            view.on('cell:pointermove', function() {
                scope.tooltipIsOpen = false;
                // Occurs outside of angular digest cycle, so trigger angular listeners update
                scope.$digest();
            });

            scope.isCode = function(key) {
                return scope.schema && scope.schema[key] && typeof scope.schema[key].contentType === 'string';
            };

            scope.getPropertyValue = function(key) {
                var value = node.attr('props/' + key);
                if (value && scope.isCode(key)) {
                    value = metamodelService.dsl2multiline(value);
                }
                return value;
            };

            // Track when tooltip is showing to load some data asynchronously when tooltip is showing
            scope.$watch('tooltipIsOpen', function(newValue) {
                if (newValue) {
                    node.attr('metadata').get('description').then(function(description) {
                        scope.description = description;
                    }, function(error) {
                        if (error) {
                            $log.error(error);
                        }
                    });
                    node.attr('metadata').get('properties').then(function(schema) {
                        scope.schema = schema;
                    });
                }
            });

            // Disallow Core Flo tooltip
            if (view.showTooltip && view.showTooltip.call) {
                view.showTooltip = function() {};
            }
            if (view.hideTooltip && view.hideTooltip.call) {
                view.hideTooltip = function() {};
            }

            // Attach tooltips to ports. No need to compile against scope because parent element is being compiled
            // and no specific scope is attached to port tooltips
            view.$('[magnet]').each(function(index, magnet) {
                var port = magnet.getAttribute('port');
                if (port === 'input') {
                    attachBootstrapTextTooltip(magnet, null, 'Input Port', 'top', 500);
                } else if (port === 'output') {
                    attachBootstrapTextTooltip(magnet, null, 'Output Port', 'top', 500);
                } else if (port === 'tap') {
                    attachBootstrapTextTooltip(magnet, null, 'Tap Port', 'top', 500);
                }
            });

            // Scope is prepared. Attach the tooltip using specific HTML template
            // to shape group element (not the view group element) such that tooltip is not shown when hovering on ports
            attachBootstrapTemplateTooltip(view.$el.find('.shape')[0], scope, 'scripts/stream/views/canvas-module-tooltip.html', 'top', 500, 'canvas-module-tooltip');

            // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
            $compile(view.el)(scope);

        }

        /**
         * Attach to a palette module entry angular-bootstrap-ui tooltip for showing info about the module and its parameters
         *
         * @param view palette module entry Joint JS view
         */
        function attachPaletteModuleTooltip(view) {
            var node = view.model;

            // Create scope for the tooltip
            var scope = $rootScope.$new(true);
            // Pass the Joint JS model on to the tooltip scope
            scope.cell = node;
            // Template uses Object#keys function. Need to pass it on the scope to make it available to angular template compiler
            scope.keys = Object.keys;
            // Tooltip should be closed initially
            scope.tooltipIsOpen = false;

            if (node.attr('metadata')) {
                // Watch for tooltip opening/closing
                scope.$watch('tooltipIsOpen', function(newValue) {
                    if (newValue) {

                        // Tooltip is showing! Load properties and description data via promises asynchronously now

                        node.attr('metadata').get('description').then(function(description) {
                            scope.description = description;
                        }, function(error) {
                            if (error) {
                                $log.error(error);
                            }
                        });

                        node.attr('metadata').get('properties').then(function(properties) {
                            scope.properties = properties;
                        }, function(error) {
                            if (error) {
                                $log.error(error);
                            }
                        });
                    }
                });
            }

            // Disallow Core Flo tooltip
            if (view.showTooltip && view.showTooltip.call) {
                view.showTooltip = function() {};
            }
            if (view.hideTooltip && view.hideTooltip.call) {
                view.hideTooltip = function() {};
            }

            // Scope is prepared. Attach the tooltip using specific HTML template
            attachBootstrapTemplateTooltip(view.el, scope, 'scripts/stream/views/palette-module-tooltip.html', 'bottom', 500, 'palette-module-tooltip');

            // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
            $compile(view.el)(scope);

        }

        /**
         * Attach angular-bootstrap-ui tooltip to error mareker shape to show error details
         *
         * @param view Joint JS view of the error marker
         */
        function attachErrorMarkerTooltip(view) {
            var node = view.model;
            // Create tooltip scope
            var scope = $rootScope.$new(true);
            // Pass the error messages to the tooltip scope
            scope.errors = function() {
                return node.attr('messages');
            };
            // Tooltip should be closed initially
            scope.tooltipIsOpen = false;
            // Disallow Core Flo tooltip
            if (view.showTooltip && view.showTooltip.call) {
                view.showTooltip = function() {};
            }
            if (view.hideTooltip && view.hideTooltip.call) {
                view.hideTooltip = function() {};
            }
            // Attach the tooltip using created above scope and specific HTML template
            attachBootstrapTemplateTooltip(view.el, scope, 'scripts/stream/views/error-marker-tooltip.html', 'right', 100, 'red-tooltip');
            // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
            $compile(view.el)(scope);
        }

        function initializeNewNode(node, context) {
            var metadata = node.attr('metadata');
            var view = context.paper.findViewByModel(node);
            if (metadata) {
                var isPalette = view && (context.graph.attributes.type === joint.shapes.flo.PALETTE_TYPE);

                if (metadata.name === 'tap') {
                    refreshVisuals(node, 'props/name', context.paper);
                } else if (metadata.name === 'destination') {
                    refreshVisuals(node, 'props/name', context.paper);
                } else {
                    refreshVisuals(node, 'node-name', context.paper);
                }

                if (!isPalette) {
                    refreshVisuals(node, 'stream-name', context.paper);
                }

                // Attach angular style tooltip to a module view
                if (view) {
                    if (context.graph.attributes.type === joint.shapes.flo.CANVAS_TYPE) {
                        attachCanvasModuleTooltip(view);
                    } else if (isPalette) {
                        attachPaletteModuleTooltip(view);
                    }
                }
            }
        }

        /**
         * Sets some initialization data on the decoration Joint JS model element
         *
         * @param decoration Joint JS model object for decoration
         * @param context The context of the object (corresponding Joint JS graph and paper objects)
         */
        function initializeNewDecoration(decoration, context) {
            // Find the Joint JS view object giveb the model. View object should exist by now.
            var view = context.paper.findViewByModel(decoration);
            // Attach angular-bootstrap-ui tooltip to error marker
            if (view && decoration.attr('./kind') === 'error') {
                attachErrorMarkerTooltip(view);
            }
        }

        /**
         * Sets some initialization data on the handle Joint JS model element
         *
         * @param handle Joint JS model object for handle
         * @param context The context of the object (corresponding Joint JS graph and paper objects)
         */
        function initializeNewHandle(handle, context) {
            // Find the Joint JS view object giveb the model. View object should exist by now.
            var view = context.paper.findViewByModel(handle);
            if (view) {

                // Attach angular-bootstrap-ui tooltip to handles

                // For some reason angular-bootstrap-ui 0.13.4 tooltip module doesn't detect mouseleave for handles
                // Therefore we track mouselave (or mouseout in Joint JS terms) and hide tooltip ourselves
                var scope = $rootScope.$new(true);
                scope.disabled = false;

                // Enable tooltip when the mouse is over the shape
                view.on('cell:mouseover', function() {
                    // Enable tooltip
                    scope.disabled = false;
                    // Occurs outside of angular digest cycle, so trigger angular listeners update
                    scope.$digest();
                });

                // Hide tooltip if mouse pointer has left the shape. Angular 0.13.4 fails to detect it for handles properly :-(
                view.on('cell:mouseout', function() {
                    // Disable tooltip
                    scope.disabled = true;
                    // Occurs outside of angular digest cycle, so trigger angular listeners update
                    scope.$digest();
                });

                // Hide tooltip if handle has been clicked.
                // The 'cell:pointerup' event is important! None of the others work properly
                view.on('cell:pointerup', function() {
                    // Disable tooltip
                    scope.disabled = true;
                    // Occurs outside of angular digest cycle, so trigger angular listeners update
                    scope.$digest();
                });

                if (handle.attr('./kind') === 'remove') {
                    attachBootstrapTextTooltip(view.el, scope, 'Remove Element', 'bottom', 500);
                    // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
                    $compile(view.el)(scope);
                } else if (handle.attr('./kind') === 'properties') {
                    attachBootstrapTextTooltip(view.el, scope, 'Edit Properties', 'bottom', 500);
                    // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
                    $compile(view.el)(scope);
                }
            }
        }

        function createNewLink() {
            return new joint.shapes.flo.LinkXD();
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

        function initializeNewLink(link) {
            link.set('smooth', true);
        }

        function isSemanticProperty(propertyPath) {
            return propertyPath === 'node-name' || propertyPath === 'stream-name';
        }

        function refreshVisuals(element, changedPropertyPath, paper) { // jshint ignore:line
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

        function handleLinkEvent(paper, event, link) {
            var graph = paper.model;
            var source, target, view;
            // Source has changed
            if (event === 'change:source') {
                var newSourceId = link.get('source').id;
                var oldSourceId = link.previous('source').id;
                var targetId = link.get('target').id;
                if (newSourceId !== oldSourceId) {
                    var newSource = graph.getCell(newSourceId);
                    var oldSource = graph.getCell(oldSourceId);
                    target = graph.getCell(targetId);
                    // Show input port for 'destination' if outgoing links are gone
                    if (oldSource && oldSource.attr('metadata/name') === 'destination' /*&& graph.getConnectedLinks(oldSource, {outbound: true}).length === 0*/) {
                        //oldSource.removeAttr('.input-port/display');
                        //// Removing an attr doesn't cause refresh of the view. Refresh it ourselves
                        //var view = paper.findViewByModel(oldSource);
                        //if (view) {
                        //    view.update();
                        //}

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
            } else if (event === 'change:target') {
                var newTargetId = link.get('target').id;
                var oldTargetId = link.previous('target').id;
                var sourceId = link.get('source').id;
                if (newTargetId !== oldTargetId) {
                    var oldTarget = graph.getCell(oldTargetId);
                    if (oldTarget) {
                        if (oldTarget.attr('metadata/name') === 'destination' /*&& graph.getConnectedLinks(oldTarget, {inbound: true}).length === 0*/) {
                            // old target is a destination. Ensure output port is showing now since incoming links are gone
                            //oldTarget.removeAttr('.output-port/display');
                            //// Removing an attr doesn't cause refresh of the view. Refresh it ourselves
                            //var view = paper.findViewByModel(oldTarget);
                            //if (view) {
                            //    view.update(oldTarget, oldTarget.attr('.output-port'));
                            //}

                            // No more incoming links, there shouldn't be any outgoing links yet -> indeterminate, hide stream label
                            // Set silently, last attr call would refresh the view
                            oldTarget.attr('.stream-label/display', 'none', { silent: true });

                            // Can't remove attr and update the view because port marking is being wiped out, so set 'block' display
                            oldTarget.attr('.output-port/display', 'block');
                        }
                    }
                    var newTarget = graph.getCell(newTargetId);
                    source = graph.getCell(sourceId);
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
            } else if (event === 'remove') {
                source = graph.getCell(link.get('source').id);
                target = graph.getCell(link.get('target').id);
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
            } else if (event === 'add') {
                source = graph.getCell(link.get('source').id);
                target = graph.getCell(link.get('target').id);
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
        }
        
        return {
            'createNewNode': createNewNode,
            'createHandle': createHandle,
            'createDecoration': createDecoration,
            'initializeNewNode': initializeNewNode,
            'initializeNewDecoration': initializeNewDecoration,
            'initializeNewHandle': initializeNewHandle,
            'createNewLink': createNewLink,
            'getLinkView': getLinkView,
            'layout': layout,
            'initializeNewLink': initializeNewLink,
            'handleLinkEvent': handleLinkEvent,
            'isSemanticProperty': isSemanticProperty,
            'refreshVisuals': refreshVisuals
        };

    }];

});