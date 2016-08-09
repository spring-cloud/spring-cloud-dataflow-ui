/*
 * Copyright 2016 the original author or authors.
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

define(function (require) {
    'use strict';

    var joint = require('joint');

    var ANIMATION_DURATION = 1500;

    var statusToFilter = {
        undeployed: 'grayscale',
        deploying: 'grayscale',
        incomplete: 'orangescale',
        failed: 'redscale'
    };

    return ['$scope', function ($scope) {

        function isFlashing() {
            return $scope.item.status === 'deploying';
        }

        function endTransition(cell, transition) {
            if (transition === 'attrs/.shape/filter/args/amount') {
                if (cell.attr('.shape/filter/args/amount') === 0) {
                    cell.attr('.shape/filter', null);
                }
                cell.off('transition:end', endTransition);
                if (isFlashing()) {
                    transitionFilter(cell, cell.attr('.shape/filter') ? undefined : statusToFilter[$scope.item.status]);
                }
            }
        }

        // Transitions between filters applying animation where appropriate
        function transitionFilter(cell, newFilter) { // jshint ignore:line
            var oldFilter = cell.attr('.shape/filter/name');
            if (newFilter !== oldFilter) {
                if (!oldFilter) {
                    cell.attr('.shape/filter', {name: newFilter, args: {amount: 0}});
                    cell.transition('attrs/.shape/filter/args/amount', 1, {
                        delay: 0,
                        duration: ANIMATION_DURATION,
                        valueFunction: joint.util.interpolate.number,
                        timingFunction: joint.util.timing.quad
                    });
                    cell.on('transition:end', endTransition);
                } else if (!newFilter) {
                    // cell.stopTransitions('attrs/.shape/filter/args/amount');
                    // Ensure that filter amount is set explicitly!
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

        function initAppColouring(cell) {
            if (cell.attr('metadata')) {
                cell.removeAttr('.shape/filter');
                cell.off('transition:end', endTransition);
                cell.stopTransitions('attrs/.shape/filter/args/amount');
                var status = $scope.item.status;
                var filter = statusToFilter[status];
                if (filter) {
                    if (isFlashing()) {
                        transitionFilter(cell, filter);
                    } else {
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

        $scope.$watch(function () {
            return $scope.item.dslText;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.definition.text = newValue;
                $scope.flo.updateGraphRepresentation().then(function () {
                    $scope.flo.getGraph().getElements().forEach(function (cell) {
                        initAppColouring(cell);
                    });
                });
            }
        });

        $scope.$watch(function () {
            return $scope.item.name;
        }, function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.flo.updateGraphRepresentation().then(function () {
                    $scope.flo.getGraph().getElements().forEach(function (cell) {
                        initAppColouring(cell);
                    });
                });
            }
        });

        $scope.flo.getGraph().getElements().forEach(function (cell) {
            initAppColouring(cell);
        });

    }];
});
