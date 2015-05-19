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
 * Definition of the Metric controller
 *
 * @author Alex Boyko
 */
define([], function () {
    'use strict';

    return ['XDUtils', '$scope', '$timeout',
        function (utils, $scope, $timeout) {

            function loadMetricsData() {
                if ($scope.dataTimeOutPromise) {
                    $timeout.cancel($scope.dataTimeOutPromise);
                }
                if ($scope.item.type && $scope.item.stream) {
                    /* jshint ignore:start */
                    $scope.item.type.service.getData($scope.item.stream, $scope.item.type.requestOptions).success(function (data) {
                        dataHandlers[$scope.item.type.label](data);
                    }, function (error) {
                        utils.$log.error('Cannot load all ' + $scope.item.type + ' ' + JSON.stringify(error));
                    });
                    /* jshint ignore:end */
                    if ($scope.item.refreshRate()) {
                        $scope.dataTimeOutPromise = $timeout(loadMetricsData, $scope.item.refreshRate() * 1000);
                    }
                }
            }

            function processCountsData(data) {
                $scope.metricsData.values = data.counts;
            }

            function processValueData(data) {
                if ($scope.metricsData.values) {
                    var rates =  Array.prototype.slice.call($scope.metricsData.values);
                    rates.push((data.value - $scope.metricsData.value.value) / $scope.metricsData.unitsPerTickX);
                    rates.splice(0, rates.length - $scope.metricsData.valuesCount);
                    $scope.metricsData.values = rates;
                } else {
                    $scope.metricsData.values = [];
                    $scope.metricsData.valueLabel = 'counts';
                    $scope.metricsData.unitsPerTickX = $scope.item.refreshRate();
                    $scope.metricsData.valuesCount = Math.round(60 / $scope.metricsData.unitsPerTickX);
                }
                $scope.metricsData.value = data;
            }

            function processGaugeData(data) {
                $scope.metricsData.value = data;
                if ($scope.metricsData.values) {
                    var rates =  Array.prototype.slice.call($scope.metricsData.values);
                    rates.push(data.value);
                    rates.splice(0, rates.length - $scope.metricsData.valuesCount);
                    $scope.metricsData.values = rates;
                } else {
                    $scope.metricsData.values = [];
                    $scope.metricsData.unitsPerTickX = $scope.item.refreshRate();
                    $scope.metricsData.valuesCount = Math.round(60 / $scope.metricsData.unitsPerTickX);
                    $scope.metricsData.valueLabel = 'value';
                }
            }

            function processRichGaugeData(data) {
                $scope.metricsData.value = data;
                if (!$scope.metricsData.gaugeData) {
                    $scope.metricsData.gaugeData = {
                        type: 'Gauge',
                        options: {
                            minorTicks: 10,
                            height: $scope.item.height
                        }
                    };
                }
                $scope.metricsData.gaugeData.options.min = data.min;
                $scope.metricsData.gaugeData.options.max = data.max;
                $scope.metricsData.gaugeData.options.majorTicks = [data.min, '', '', '', '', '', '', '', '', '', data.max];
                $scope.metricsData.gaugeData.data = [
                    ['Label', 'Value'],
                    [data.name, data.value]
                ];
            }

            var dataHandlers = {
                'Counters': processValueData,
                'Aggregate-Counters': processCountsData,
                'Field-Value-Counters': processCountsData,
                'Gauges': processGaugeData,
                'Rich-Gauges': processRichGaugeData
            };

            $scope.metricRefreshRate = 5000;

            $scope.metricsData = $scope.$new();

            loadMetricsData();

            $scope.$watch(function(scope) {
                return scope.item.stream;
            }, function() {
                $scope.metricsData.$destroy();
                $scope.metricsData = $scope.$new();
                loadMetricsData();
            });

            $scope.$watch(function(scope) {
                return scope.item.refreshRate();
            }, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.metricsData.$destroy();
                    $scope.metricsData = $scope.$new();
                    loadMetricsData();
                }
            });

            $scope.$watch(function(scope) {
                return scope.item.height;
            }, function() {
                if ($scope.metricsData && $scope.metricsData.gaugeData) {
                    $scope.metricsData.gaugeData.options.height = $scope.item.height;
                }
            });

            $scope.$on('$destroy', function() {
                if ($scope.dataTimeOutPromise) {
                    $timeout.cancel($scope.dataTimeOutPromise);
                }
                if ($scope.metricsData) {
                    $scope.metricsData.$destroy();
                }
            });

        }
    ];
});
