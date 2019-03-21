/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function (require) {
    'use strict';

    var joint = require('joint');

    var ANIMATION_DURATION = 1500;

    var statusToFilter = {
        undeployed: 'grayscale',
        deploying: 'grayscale',
        partial: 'grayscale',
        incomplete: 'orangescale',
        failed: 'redscale'
    };

    return ['$scope', function ($scope) {

        function isFlashing() {
            return $scope.item.status === 'deploying' || $scope.item.status === 'partial';
        }

        // End of transition callback
        function endTransition(cell, transition) {
            // Consider only at animations that are done on appropriate color filter
            if (transition === 'attrs/.shape/filter/args/amount') {
                // Color filter turned off -> remove colour filter
                if (cell.attr('.shape/filter/args/amount') === 0) {
                    cell.attr('.shape/filter', null);
                }
                // Remove end of transition event callback
                cell.off('transition:end', endTransition);
                if (isFlashing()) {
                    // Switch on/off colour filter if shape should be flashing
                    transitionFilter(cell, cell.attr('.shape/filter') ? undefined : statusToFilter[$scope.item.status]);
                }
            }
        }

        // Stop colour filter animation
        function stopAnimation(cell) {
            // Remove end of transition event callback
            cell.off('transition:end', endTransition);
            // Stop the colour filter animation
            cell.stopTransitions('attrs/.shape/filter/args/amount');
        }

        // Transitions between filters applying animation where appropriate
        function transitionFilter(cell, newFilter) { // jshint ignore:line
            var oldFilter = cell.attr('.shape/filter/name');
            if (newFilter !== oldFilter) {
                if (!oldFilter) {
                    stopAnimation(cell);
                    cell.attr('.shape/filter', {name: newFilter, args: {amount: 0}});
                    cell.transition('attrs/.shape/filter/args/amount', 1, {
                        delay: 0,
                        duration: ANIMATION_DURATION,
                        valueFunction: joint.util.interpolate.number,
                        timingFunction: joint.util.timing.quad
                    });
                    cell.on('transition:end', endTransition);
                } else if (!newFilter) {
                    // Ensure that filter amount is set explicitly!
                    stopAnimation(cell);
                    cell.attr('.shape/filter/args/amount', 1);
                    cell.transition('attrs/.shape/filter/args/amount', 0, {
                        delay: 0,
                        duration: ANIMATION_DURATION,
                        valueFunction: joint.util.interpolate.number,
                        timingFunction: joint.util.timing.quad
                    });
                    cell.on('transition:end', endTransition);
                } else {
                    cell.attr('.shape/filter', {name: newFilter});
                }
            }
        }

        // Initial setting of the colour feedback for an app shape
        function initAppColouring(cell) {
            // Check if it one the apps, destination or tap shapes
            if (cell.attr('metadata/group')) {
                // Stop any color filter animation if there is any in progress
                stopAnimation(cell);
                // Unset color filter
                cell.removeAttr('.shape/filter');
                var status = $scope.item.status;
                var filter = statusToFilter[status];
                // If filter needs to be applied, do so.
                if (filter) {
                    if (isFlashing()) {
                        // If shape needs to be flashed, start animation of the color filter.
                        transitionFilter(cell, filter);
                    } else {
                        // Otherwise, set the colour filter
                        cell.attr('.shape/filter', {name: filter});
                    }
                }
            }
        }

        // Assign the right color filter to graph cells based on module status
        // Graph is populated once meta-model promise is resolved, hence at this moment there might be no graph
        // contents. Therefore, just add a listener to track when cells are added to the graph and adjust the color
        // filter for the newly added cell.
        $scope.flo.getGraph().on('add', function (cell) {
            initAppColouring(cell);
        });

        $scope.$watch(function () {
            return $scope.item.status;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.flo.getGraph().getElements().forEach(function (cell) {
                    transitionFilter(cell, statusToFilter[$scope.item.status]);
                });
            }
        });

        $scope.flo.getGraph().getElements().forEach(function (cell) {
            initAppColouring(cell);
        });

    }];
});
