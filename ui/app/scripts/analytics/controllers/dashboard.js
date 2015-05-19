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
 * Definition of the Metrics Dashboard controller
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define([], function () {
    'use strict';

    var ITEMS_COOKIE_KEY = 'analytics.dashboard.items';

    return ['XDUtils', '$scope', '$injector', '$timeout', '$rootScope', '$cookieStore', '$q',
        function (utils, $scope, $injector, $timeout, $rootScope, $cookieStore, $q) {

            function loadAllStreams() {
                if ($scope.streamsTimeOutPromise) {
                    $timeout.cancel($scope.streamsTimeOutPromise);
                }
                var promises = [];
                $scope.allMetricTypes.forEach(function(type) {
                    if (type && type.service) {
                        promises.push(type.service.getAll().success(function(data) {
                            var streams = [];
                            data.content.forEach(function(entry) {
                                streams.push(entry.name);
                            });
                            type.streams = streams;
                        }, function(error) {
                            utils.$log.error('Cannot load all ' + $scope.type + ' ' + JSON.stringify(error));
                            type.streams = [];
                        }));
                    }
                });
                $scope.streamsTimeOutPromise = $timeout(loadAllStreams, $rootScope.pageRefreshTime);
                return $q.all(promises);
            }

            function initItems() {
                var item;
                var items = [];
                var fromCookie = $cookieStore.get(ITEMS_COOKIE_KEY);
                if (fromCookie && Array.isArray(fromCookie) && fromCookie.length > 0) {
                    fromCookie.forEach(function(state) {
                        item = $scope.newEntry();
                        Object.keys(state).forEach(function(key) {
                            if (key === 'type') {
                                item.type = $scope.labelToType[state.type];
                            } else {
                                item[key] = state[key];
                            }
                        });
                        items.push(item);
                    });
                } else {
                    items.push($scope.newEntry());
                }
                $scope.items = items;
            }

            function storeItems() {
                var toSave = [], state;
                $scope.items.forEach(function(item) {
                    state = {};
                    Object.keys(item).forEach(function(key) {
                        if (key !== 'metricsData') {
                            if (key === 'type' && item.type) {
                                state.type = item.type.label;
                            } else {
                                state[key] = item[key];
                            }
                        }
                    });
                    toSave.push(state);
                });
                if (toSave.length === 0) {
                    $cookieStore.remove(ITEMS_COOKIE_KEY);
                } else {
                    $cookieStore.put(ITEMS_COOKIE_KEY, toSave);
                }
            }

            $scope.allMetricTypes = [
                {
                    label: 'Counters',
                    service: $injector.get('CounterService'),
                    streams: [],
                    visualizations: ['Bar-Chart', 'Graph-Chart'],
                },
                {
                    label: 'Aggregate-Counters',
                    service: $injector.get('AggregateCounterService'),
                    streams: [],
                    visualizations: ['Bar-Chart'],
                    requestOptions: {resolution: 'minute'}
                },
                {
                    label: 'Field-Value-Counters',
                    service: $injector.get('FieldValueCounterService'),
                    streams: [],
                    visualizations: ['Bubble-Chart', 'Pie-Chart']
                },
                {
                    label: 'Gauges',
                    service: $injector.get('GaugeService'),
                    streams: [],
                    visualizations: ['Graph-Chart']
                },
                {
                    label: 'Rich-Gauges',
                    service: $injector.get('RichGaugeService'),
                    streams: [],
                    visualizations: ['Gauge-Chart']
                }
            ];

            $scope.labelToType = {};
            $scope.allMetricTypes.forEach(function(type) {
                $scope.labelToType[type.label] = type;
            });

            $scope.newEntry = function() {
                return {
                    _refreshRate: 2,
                    refreshRate: function(rate) {
                        if (rate && !isNaN(rate)) {
                            if (rate < 0.01) {
                                rate = 0;
                            }
                            this._refreshRate = rate;
                        }
                        return this._refreshRate;
                    }
                };
            };

            $scope.$on('$destroy', function() {
                if ($scope.streamsTimeOutPromise) {
                    $timeout.cancel($scope.streamsTimeOutPromise);
                }
                storeItems();
            });

            loadAllStreams().then(function() {
                // Stream only loaded now, now safe to show metric items
                initItems();
            });

        }
    ];
});
