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
 * Definition of the read-only Flo Stream controller
 *
 * @author Alex Boyko
 */
define(function (require) {
    'use strict';

    var joint = require('joint');
    var angular = require('angular');

    var INSTANCE_INDEX_PROP = /*'spring.cloud.stream.instanceIndex`*/ 'spring.application.index';
    var INSTANCE_COUNT_PROP = 'spring.cloud.stream.instanceCount';

    var MAGNITUDE_NUMBERS = [ 1000000000, 1000000, 1000];
    var MAGNITUDE_LITERALS = ['B', 'M', 'K'];

    var statusToFilter = {
        undeployed: 'grayscale',
        deploying: 'grayscale',
        partial: 'grayscale',
        incomplete: 'orangescale',
        failed: 'redscale'
    };

    var InstanceLabel = joint.shapes.basic.Generic.extend({

        markup: '<text class="label"/>',

        defaults: joint.util.deepSupplement({

            type: 'dataflow.InstanceLabel',
            attrs: {
                '.': { magnet: false },
                '.label': {
                    'text-anchor': 'middle',
                    fill: 'black',
                    'font-size': 8
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    joint.shapes.dataflow = joint.shapes.dataflow || {};
    joint.shapes.dataflow.InstanceDot = joint.shapes.basic.Generic.extend({

        markup: '<g class="rotatable"><g class="scalable"><circle class="instance-dot"/></g></g>',

        defaults: joint.util.deepSupplement({
            type: 'dataflow.InstanceDot',
            size: { width: 60, height: 60 },
            attrs: {
                'circle': { r: 30, transform: 'translate(30, 30)' }
            }
        }, joint.shapes.basic.Generic.prototype.defaults)
    });

    return ['$scope', '$compile', 'FloBootstrapTooltip', 'DataflowUtils',
        function ($scope, $compile, floBootstrapTooltip, utils) {

        function findStreamMetrics(metrics) {
            var status = $scope.item.status.toLowerCase();
            if (status === 'deployed' && metrics && angular.isArray(metrics)) {
                return metrics.find(function (e) {
                    return e.name === $scope.item.name;
                });
            }
        }

        function findModuleMetrics(metrics, name) {
            if (metrics && angular.isArray(metrics.applications)) {
                return metrics.applications.find(function(e) {
                    return e.name === name;
                });
            }
        }

        function colorApp(cell) {
            // Check if it one the apps, destination or tap shapes
            if (cell.attr('metadata/group')) {
                var filter = statusToFilter[$scope.item.status.toLowerCase()];
                cell.attr('.shape/filter', filter ? {name: filter, args: {amount: 1}} : null);
            }
        }

        function animateGraph() {
            var paper = $scope.flo.getPaper();
            var status = $scope.item.status ? $scope.item.status.toLowerCase() : undefined;
            if (status === 'deploying' || status === 'partial') {
                joint.V(paper.el).addClass('stream-deploying');
            } else {
                joint.V(paper.el).removeClass('stream-deploying');
            }
        }

        function setupLabelNode(link, index, location, isolateScope) {
            var node = $scope.flo.getPaper().findViewByModel(link).$el.find('.labels').find('.label')[index];
            var model = link.get('labels')[index];

            // Initialize the scope of the label and tooltip
            if (!isolateScope) {
                isolateScope = $scope.$new(true);
                isolateScope.rate = model.rate;
                isolateScope.rateLabel = function() {
                    var postFix, division, index = -1, fixed = 3;
                    do {
                        division = this.rate / MAGNITUDE_NUMBERS[++index];
                    } while (!Math.floor(division) && index < MAGNITUDE_NUMBERS.length);
                    if (index === MAGNITUDE_NUMBERS.length) {
                        postFix = '';
                        division = this.rate;
                    } else {
                        postFix = MAGNITUDE_LITERALS[index];
                    }
                    for (var decimal = 1; decimal <= 100 && Math.floor(division / decimal); decimal*=10) {
                        fixed--;
                    }
                    return division.toFixed(fixed) + postFix;
                };
            }

            // Set ui-bootstrap tooltip attributes
            floBootstrapTooltip.attachBootstrapTextTooltip(node, isolateScope, '{{rate}}', location);

            // Listen to SVG label text element changes to update the rectangle element
            // (This is due to bypassing Joint JS rendering of labels that recreates DOM elements)
            var $text = $(node).find('text');
            var $rect = $(node).find('rect');
            var padding = {left: 2, right: 2, top: 2, bottom: 2};

            $text[0].firstChild.addEventListener('DOMCharacterDataModified', function() {
                var textBbox = joint.V($text[0]).bbox(true, node);
                $rect.attr({
                    x: textBbox.x - padding.left,
                    y: textBbox.y - textBbox.height/2 - padding.top,  // Take into account the y-alignment translation.
                    width: textBbox.width + padding.left + padding.right,
                    height: textBbox.height + padding.top + padding.bottom
                });
            });

            // Compile the label DOM element with angular against the scope defined above
            $compile(node)(isolateScope);
        }


        function updateMessageRates(streamMetrics) {
            var graph = $scope.flo.getGraph();
            graph.getLinks().forEach(function(link) {
                if (link.get('type') === 'sinspctr.Link') {
                    var linkView = $scope.flo.getPaper().findViewByModel(link);
                    var outgoingIndex, incomingIndex;
                    var name;
                    var moduleMetrics;
                    var scope;
                    var views = linkView.$el.find('.labels').find('.label');
                    var labels = link.get('labels');

                    // Find incoming and outgoing message rates labels
                    if (labels && Array.isArray(labels)) {
                        labels.forEach(function(label, i) {
                            if (label.type === 'outgoing-rate') {
                                outgoingIndex = i;
                            } else if (label.type === 'incoming-rate') {
                                incomingIndex = i;
                            }
                        });
                    } else {
                        labels = [];
                    }

                    if (!streamMetrics || $scope.item.status === 'undeployed' || $scope.item.status === 'failed') {
                        if (typeof outgoingIndex === 'number') {
                            // Delete the scope to ensure that tooltip goes away upon removal of the message rate labe;
                            angular.element(views[outgoingIndex]).scope().$destroy();
                        }
                        if (typeof incomingIndex === 'number') {
                            // Delete the scope to ensure that tooltip goes away upon removal of the message rate labe;
                            angular.element(views[incomingIndex]).scope().$destroy();
                        }
                        if (typeof outgoingIndex === 'number' || typeof incomingIndex === 'number') {
                            // Need to set the labels if labels were removed. Must be a new array object.
                            var newLabels = [];
                            labels.forEach(function(label, i) {
                                if (i !== outgoingIndex && i !== incomingIndex) {
                                    newLabels.push(label);
                                }
                            });
                            link.set('labels', newLabels);
                        }
                    } else {
                        var labelsReset = false;

                        var source = graph.getCell(link.get('source').id);
                        var target = graph.getCell(link.get('target').id);

                        if (source) {
                            name = source.attr('node-name') ? source.attr('node-name') : source.attr('metadata/name');
                            moduleMetrics = findModuleMetrics(streamMetrics, name);
                            if (moduleMetrics && angular.isNumber(moduleMetrics.outgoingRate)) {
                                if (typeof outgoingIndex === 'number') {
                                    // Labels DOM element is present. Update the scope of the DOM element with new rate
                                    // UI will reflect the changes done to the scope
                                    utils.$log.debug('SOURCE LABEL UPDATE: rate = ' + moduleMetrics.outgoingRate);
                                    labels[outgoingIndex].rate = moduleMetrics.outgoingRate;
                                    scope = angular.element(views[outgoingIndex]).scope();
                                    if (scope) {
                                        scope.rate = moduleMetrics.outgoingRate;
                                    } else {
                                        utils.$log.warn('No scope for outgoing message rate label for node "' + name + '"');
                                    }
                                } else {
                                    utils.$log.debug('SOURCE LABEL CREATED: rate = ' + moduleMetrics.outgoingRate);
                                    // Create new label for outgoing message rate
                                    outgoingIndex = link.get('labels') ? link.get('labels').length : 0;
                                    link.label(outgoingIndex, {
                                        position: 15,
                                        type: 'outgoing-rate',
                                        rate: moduleMetrics.outgoingRate,
                                        attrs: {
                                            text: {
                                                transform: 'translate(0, -10)',
                                                text: '{{rateLabel()}}',
                                                'fill': 'black',
                                                'stroke': 'none',
                                                'font-size': '8'
                                            },
                                            rect: {
                                                transform: 'translate(0, -10)',
                                                stroke: 'black',
                                                'stroke-width': 1,
                                                fill: '#CFE2F3'
                                            }
                                        }
                                    });
                                    labelsReset = true;
                                }
                            }
                        }

                        if (target) {
                            name = target.attr('node-name') ? target.attr('node-name') : target.attr('metadata/name');
                            moduleMetrics = findModuleMetrics(streamMetrics, name);
                            if (moduleMetrics && angular.isNumber(moduleMetrics.incomingRate)) {
                                if (typeof incomingIndex === 'number') {
                                    // Labels DOM element is present. Update the scope of the DOM element with new rate
                                    // UI will reflect the changes done to the scope
                                    labels[incomingIndex].rate = moduleMetrics.incomingRate;
                                    scope = angular.element(views[incomingIndex]).scope();
                                    if (scope) {
                                        scope.rate = moduleMetrics.incomingRate;
                                    } else {
                                        utils.$log.warn('No scope for incoming message rate label for node "' + name + '"');
                                    }
                                } else {
                                    // Create new label for incoming message rate
                                    incomingIndex = link.get('labels') ? link.get('labels').length : 0;
                                    link.label(incomingIndex, {
                                        position: -15,
                                        type: 'incoming-rate',
                                        rate: moduleMetrics.incomingRate,
                                        attrs: {
                                            text: {
                                                transform: 'translate(0, 11)',
                                                text: '{{rateLabel()}}',
                                                'fill': 'white',
                                                'stroke': 'none',
                                                'font-size': '8'
                                            },
                                            rect: {
                                                transform: 'translate(0, 11)',
                                                stroke: '#3498DB',
                                                fill: '#3498DB'
                                            }
                                        }
                                    });
                                    labelsReset = true;
                                }
                            }
                        }

                        // Update label DOM elements once labels are set.
                        // Joint JS label setting removes all labels from the DOM and then recreates them
                        // Recreation of labels destroys angular comilation of DOM elements.
                        // Therefore, process DOM elements once Jint JS labels are processed
                        if (labelsReset) {
                            if (typeof outgoingIndex === 'number') {
                                setupLabelNode(link, outgoingIndex, 'top');
                            }
                            if (typeof incomingIndex === 'number') {
                                setupLabelNode(link, incomingIndex, 'bottom');
                            }
                        }

                    }
                }
            });
        }

        function findInstance(instances, index) {
            return instances.find(function(instance) {
                if (angular.isObject(instance) && angular.isObject(instance.properties)) {
                    return Number(instance.properties[INSTANCE_INDEX_PROP]) === index;
                }
            });
        }

        function updateInstanceDecorations(cell, moduleMetrics) {
            var label, dots = [];
            // Find label or dots currently painted
            cell.getEmbeddedCells().forEach(function (embed) {
                if (embed.get('type') === 'dataflow.InstanceLabel') {
                    label = embed;
                } else if (embed.get('type') === 'dataflow.InstanceDot') {
                    dots.push(embed);
                }
            });

            if ($scope.item.status.toLowerCase() !== 'undeployed' && angular.isObject(moduleMetrics) &&
                angular.isArray(moduleMetrics.instances) && moduleMetrics.instances.length > 0) {

                var instanceCount = Number(moduleMetrics.instances[0].properties[INSTANCE_COUNT_PROP]);
                if (!instanceCount) {
                    instanceCount = moduleMetrics.instances.length;
                }

                // Label or Dots should be displayed
                var size = cell.get('size');
                var position = cell.get('position');

                var x = position.x + size.width / 2;
                var y = position.y + size.height + 7;

                var diameter = 6;
                var padding = 3;
                var maxLanes = 2;
                // Calculate max number of dots that we can fit on one lane under the shape
                var maxDotsPerLine = Math.ceil((size.width - padding) / (padding + diameter));
                // Calculate the number of lanes required to display dots
                var lanesNeeded = Math.ceil(instanceCount / maxDotsPerLine);
                // If number of lanes is too large display label
                if (lanesNeeded > maxLanes) {
                    // Label should be displayed - remove dots
                    dots.forEach(function (e) {
                        e.remove();
                    });
                    if (!label) {
                        // Create label if it's not on the graph yet
                        label = new InstanceLabel({
                            position: {x: x, y: y}
                        });
                        $scope.flo.getGraph().addCell(label);
                        cell.embed(label);
                    }
                    var deployedNumber = moduleMetrics.instances.length;
                    label.attr('.label/text', deployedNumber + '/' + instanceCount);
                } else {
                    // Dots should be displayed - remove the label
                    if (label) {
                        label.remove();
                    }
                    if (dots.length !== instanceCount) {
                        // Number of dots has changed. Remove old dots and create new ones
                        dots.forEach(function (e) {
                            e.remove();
                            if (e.scope) {
                                e.scope.$destroy();
                            }
                        });
                        dots = [];
                        // Initialize data structure to store tooltip for each dot
                        var dotY = y;

                        // Function handling update of the module instance data
                        var moduleInstanceDataUpdateFunction = function (newValue, oldValue, scope) {
                            var view = $scope.flo.getPaper().findViewByModel(scope.jointDot);
                            if (view) {
                                if (newValue) {
                                    joint.V(view.el).addClass('deployed');
                                } else {
                                    joint.V(view.el).removeClass('deployed');
                                }
                            }
                        };

                        for (var lane = 0; lane < lanesNeeded; lane++) {
                            var numberOfDots = (lane === lanesNeeded - 1) ? instanceCount - lane * maxDotsPerLine : maxDotsPerLine;
                            var even = numberOfDots % 2 === 0;
                            var dotX = x - (Math.floor(numberOfDots / 2) * (diameter + padding) + (even ? -padding / 2 : diameter / 2));
                            for (var i = 0; i < numberOfDots; i++) {
                                var data = findInstance(moduleMetrics.instances, lane * maxDotsPerLine + i/* + 1*/);
                                var dot = new joint.shapes.dataflow.InstanceDot({
                                    position: {x: dotX, y: dotY},
                                    size: {width: diameter, height: diameter}
                                });
                                $scope.flo.getGraph().addCell(dot);
                                cell.embed(dot);

                                // Compile the dot SVG DOM element with angular to compile tooltip directive and initiate angular data-bindings
                                var dotView = $scope.flo.getPaper().findViewByModel(dot);
                                if (dotView) {
                                    var dotScope = $scope.$new();
                                    dotScope.moduleInstanceData = data;
                                    dotScope.jointDot = dot;
                                    dotScope.$watch('moduleInstanceData', moduleInstanceDataUpdateFunction);
                                    dot.scope = dotScope;

                                    floBootstrapTooltip.attachBootstrapTemplateTooltip(dotView.el, dotScope,
                                        'moduleInstanceData ? \'scripts/stream/views/app-deployed-tooltip.html\' : \'scripts/stream/views/app-undeployed-tooltip.html\'',
                                        'bottom');

                                    $compile(dotView.el)(dotScope);
                                }

                                dotX += diameter + padding;
                                dots.push(dot);
                            }
                            dotY += diameter + padding;
                        }
                    } else {
                        dots.forEach(function(dot, i) {
                            if (i < moduleMetrics.instances.length) {
                                dot.scope.moduleInstanceData = moduleMetrics.instances[i];
                            } else {
                                dot.scope.moduleInstanceData = undefined;
                            }
                        });
                        // moduleMetrics.instances.forEach(function(instance) {
                        //     var i = Number(instance.properties[INSTANCE_INDEX_PROP]);
                        //     if (angular.isNumber(i) && i < dots.length) {
                        //         dots[i].scope.moduleInstanceData = instance;
                        //     }
                        // });
                    }
                }
            } else {
                // Label or Dots should NOT be displayed for undeployed modules - remove them
                if (label) {
                   label.remove();
                }
                dots.forEach(function (e) {
                    e.remove();
                    if (e.scope) {
                        e.scope.$destroy();
                    }
                });
            }
        }

        function updateDots(streamMetrics) {
            $scope.flo.getGraph().getCells().forEach(function(cell) {
                var group = cell.attr('metadata/group');
                if (group === 'source' || group === 'processor' || group === 'sink') {
                    var label = cell.attr('node-name');
                    if (!label) {
                        label = cell.attr('metadata/name');
                    }
                    updateInstanceDecorations(cell, findModuleMetrics(streamMetrics, label));
                }
            });
        }

        // Assign the right color filter to graph cells based on module status
        // Graph is populated once meta-model promise is resolved, hence at this moment there might be no graph
        // contents. Therefore, just add a listener to track when cells are added to the graph and adjust the color
        // filter for the newly added cell.
        $scope.flo.getGraph().on('add', function (cell) {
            colorApp(cell);
        });

        $scope.$watch(function () {
            return $scope.item.status;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.flo.getGraph().getElements().forEach(function (cell) {
                    colorApp(cell);
                });
                animateGraph();
            }
        });

        $scope.$watch(function() {
            return findStreamMetrics($scope.metrics);
        }, function(streamMetrics) {
            updateMessageRates(streamMetrics);
            updateDots(streamMetrics);
        });

        $scope.flo.getGraph().getElements().forEach(function (cell) {
            colorApp(cell);
        });

        animateGraph();

        var streamMetrics = findStreamMetrics($scope.metrics);
        updateMessageRates(streamMetrics);
        updateDots(streamMetrics);

    }];
});
