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
 * Attaches boot strap tooltip to Flo/JointJS shapes
 *
 * @author Alex Boyko
 */
define(function(require) {
    'use strict';

    var angular = require('angular');

    return ['$rootScope', '$compile', '$log', function($rootScope, $compile, $log) {

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

            if (template && /^\/?([\w,\s-]+\/)*[\w,\s-]+\.[A-Za-z\d]+$/.test(template)) {
                // template is just a file name not some kind of expression
                domElement.setAttribute('tooltip-template', '\'' + template + '\'');
            } else {
                domElement.setAttribute('tooltip-template', template);
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
         * Attach angular-bootstrap-ui tooltip to a app shape on the main canvas
         *
         * @param view app shape Joint JS view
         * @param selector CSS class of an SVG element within node to attach tooltip to
         * @param metamodelService the Flo editor metamodel service
         */
        function attachCanvasNodeTooltip(view, selector, metamodelService) {
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
                if (scope.schema) {
                    // Key is a property name, properties are indexed by ids of a form <prefix><name>
                    var prefix = '';
                    var ids = scope.keys(scope.schema);
                    // Check if property is a property name, i.e. . char is a delimiter between prefixes
                    if (key.lastIndexOf('.') < 0 && ids.length) {
                        var propertyId = ids[0];
                        var idx = propertyId.lastIndexOf('.');
                        if (idx >= 0) {
                            prefix = propertyId.substring(0, idx + 1);
                        }
                    }
                    var id = prefix + key;
                    return scope.schema[id] && typeof scope.schema[id].contentType === 'string';
                }
            };

            scope.getPropertyValue = function(key) {
                var value = node.attr('props/' + key);
                if (value && scope.isCode(key)) {
                    value = metamodelService.decodeTextFromDSL(value);
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
            if (angular.isFunction(view.showTooltip)) {
                view.showTooltip = function() {};
            }
            if (angular.isFunction(view.hideTooltip)) {
                view.hideTooltip = function() {};
            }

            // Scope is prepared. Attach the tooltip using specific HTML template
            // to shape group element (not the view group element) such that tooltip is not shown when hovering on ports
            attachBootstrapTemplateTooltip(view.$el.find(selector)[0], scope, 'scripts/shared/views/canvas-node-tooltip.html', 'top', 500, 'canvas-app-tooltip');

            // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
            $compile(view.el)(scope);

        }

        /**
         * Attach to a palette app entry angular-bootstrap-ui tooltip for showing info about the app and its parameters
         *
         * @param view palette app entry Joint JS view
         */
        function attachPaletteNodeTooltip(view) {
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
            if (angular.isFunction(view.showTooltip)) {
                view.showTooltip = function() {};
            }
            if (angular.isFunction(view.hideTooltip)) {
                view.hideTooltip = function() {};
            }

            // Scope is prepared. Attach the tooltip using specific HTML template
            attachBootstrapTemplateTooltip(view.el, scope, 'scripts/shared/views/palette-node-tooltip.html', 'bottom', 500, 'palette-app-tooltip');

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
            if (angular.isFunction(view.showTooltip)) {
                view.showTooltip = function() {};
            }
            if (angular.isFunction(view.hideTooltip)) {
                view.hideTooltip = function() {};
            }
            // Attach the tooltip using created above scope and specific HTML template
            attachBootstrapTemplateTooltip(view.el, scope, 'scripts/shared/views/error-marker-tooltip.html', 'right', 100, 'red-tooltip');
            // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
            $compile(view.el)(scope);
        }

        function attachHandleTooltip(view) {
            // For some reason angular-bootstrap-ui 0.13.4 tooltip app doesn't detect mouseleave for handles
            // Therefore we track mouselave (or mouseout in Joint JS terms) and hide tooltip ourselves
            var scope = $rootScope.$new(true);
            scope.disabled = false;

            // Enable tooltip when the mouse is over the shape
            view.on('cell:mouseover', function () {
                // Enable tooltip
                scope.disabled = false;
                // Occurs outside of angular digest cycle, so trigger angular listeners update
                scope.$digest();
            });

            // Hide tooltip if mouse pointer has left the shape. Angular 0.13.4 fails to detect it for handles properly :-(
            view.on('cell:mouseout', function () {
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

            if (view.model.attr('./kind') === 'remove') {
                attachBootstrapTextTooltip(view.el, scope, 'Remove Element', 'bottom', 500);
                // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
                $compile(view.el)(scope);
            } else if (view.model.attr('./kind') === 'properties') {
                attachBootstrapTextTooltip(view.el, scope, 'Edit Properties', 'bottom', 500);
                // All DOM modifications should be in place now. Let angular compile the DOM element to fuse scope and HTML
                $compile(view.el)(scope);
            }
        }

        return {
            attachBootstrapTextTooltip: attachBootstrapTextTooltip,
            attachBootstrapTemplateTooltip: attachBootstrapTemplateTooltip,
            attachCanvasNodeTooltip: attachCanvasNodeTooltip,
            attachPaletteNodeTooltip: attachPaletteNodeTooltip,
            attachErrorMarkerTooltip: attachErrorMarkerTooltip,
            attachHandleTooltip: attachHandleTooltip
        };

    }];

});
