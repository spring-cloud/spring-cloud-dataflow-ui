/*
 * Copyright 2015 the original author or authors.
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
 * Gauges controller
 *
 * @author Alex Boyko
 */
define(function () {
    'use strict';

    return ['$scope', 'GaugeService', 'XDUtils', '$timeout',
        function ($scope, gaugeService, utils, $timeout) {

            var _refreshRate = 2;

            function loadGauges(showGrowl) {
                if ($scope.getGaugesTimer) {
                    $timeout.cancel($scope.getGaugesTimer);
                }
                //utils.$log.info('pageable', pageable);
                var gaugesPromise = gaugeService.getAll({detailed: true});
                if (showGrowl) {
                    utils.addBusyPromise(gaugesPromise);
                }
                utils.$log.info(gaugesPromise);
                gaugesPromise.success(
                    function (result) {
                        if (!$scope.items) {
                            $scope.items = [];
                        }
                        var index = {};
                        if ($scope.items) {
                            $scope.items.forEach(function(item) {
                                index[item.name] = item;
                            });
                        }
                        result.content.forEach(function(entry) {
                            if (index[entry.name]) {
                                var cached = index[entry.name];
                                entry.values = cached.values;
                                entry.values.push(entry.value);
                                entry.values.splice(0, entry.values.length -  $scope.totalCacheSize());
                            } else {
                                entry.values = [];
                            }
                        });
                        $scope.items = result.content;
                        if ($scope.refreshRate()) {
                            $scope.getGaugesTimer = $timeout(function () {
                                loadGauges();
                            }, $scope.refreshRate() * 1000);
                        }
                    }, function (result) {
                        utils.growl.error(result.data[0].message);
                    }
                );
            }

            $scope.refreshRate = function(rate) {
                if (rate && !isNaN(rate)) {
                    if (rate < 0.01) {
                        rate = 0;
                    }
                    if (_refreshRate !== rate) {
                        _refreshRate = rate;
                        loadGauges();
                    }
                }
                return _refreshRate;
            };

            $scope.totalCacheSize = function() {
                return Math.max(Math.ceil(60 / $scope.refreshRate()), 20);
            };

            $scope.$on('$destroy', function () {
                if ($scope.getGaugesTimer) {
                    $timeout.cancel($scope.getGaugesTimer);
                }
            });

            loadGauges(true);
        }];
});
