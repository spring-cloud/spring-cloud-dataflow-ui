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

    var statusToFilter = {
        undeployed: 'grayscale',
        deploying: 'grayscale',
        partial: 'grayscale',
        incomplete: 'orangescale',
        failed: 'redscale'
    };

    return ['$scope', function ($scope) {

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

        $scope.flo.getGraph().getElements().forEach(function (cell) {
            colorApp(cell);
        });

        animateGraph();

    }];
});
