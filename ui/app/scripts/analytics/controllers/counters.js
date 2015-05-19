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
 * Counters controller
 *
 * @author Alex Boyko
 */
define(function (require) {
    'use strict';

    var Pageable = require('model/pageable');

    return ['$scope', 'CounterService', 'XDUtils', '$timeout',
        function ($scope, counterService, utils, $timeout) {

            var _refreshRate = 2;

            function loadCounters(showGrowl) {
                if ($scope.getCountersTimer) {
                    $timeout.cancel($scope.getCountersTimer);
                }
                //utils.$log.info('pageable', pageable);
                var countersPromise = counterService.getAll({detailed:true});
                if (showGrowl) {
                    utils.addBusyPromise(countersPromise);
                }
                utils.$log.info(countersPromise);
                countersPromise.success(
                    function (result) {
                        if (!$scope.pageable.items) {
                            $scope.pageable.items = [];
                        }
                        var index = {};
                        if ($scope.pageable.items) {
                            $scope.pageable.items.forEach(function(item) {
                                index[item.name] = item;
                            });
                        }
                        result.content.forEach(function(entry) {
                            if (index[entry.name]) {
                                var cached = index[entry.name];
                                entry.rates = cached.rates;
                                entry.rates.push((entry.value - cached.value) / ($scope.refreshRate()));
                                entry.rates.splice(0, entry.rates.length - $scope.totalCacheSize());
                            } else {
                                entry.rates = [];
                                entry.initialValue = entry.value;
                            }
                        });
                        $scope.pageable.items = result.content;
                        $scope.pageable.total = result.page.totalElements;
                        if ($scope.refreshRate()) {
                            $scope.getCountersTimer = $timeout(function () {
                                loadCounters();
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
                        //$scope.pageable.items.forEach(function(entry) {
                        //    entry.rates = [];
                        //});
                        $scope.pageable.items = [];
                        loadCounters();
                    }
                }
                return _refreshRate;
            };

            $scope.totalCacheSize = function() {
                return Math.max(Math.ceil(60 / $scope.refreshRate()), 20);
            };

            $scope.pageable = new Pageable();
            $scope.pageable.pageSize = 50;
            $scope.pagination = {
                current: 1
            };

            $scope.pageChanged = function (newPage) {
                $scope.pageable.pageNumber = newPage - 1;
                loadCounters();
            };

            $scope.latestRate = function(item) {
                return item.rates.length ? item.rates[item.rates.length - 1] : '--N/A--';
            };

            $scope.$on('$destroy', function () {
                if ($scope.getCountersTimer) {
                    $timeout.cancel($scope.getCountersTimer);
                }
            });

            loadCounters(true);
        }];
});
