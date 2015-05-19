/*
 * Copyright 2013-2014 the original author or authors.
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
 * Definition of xd container controllers.
 *
 * @author Ilayaperumal Gopinathan
 */
define(function(require) {
    'use strict';

    var angular = require('angular');

    return angular.module('xdAnalyticsAdmin.directives', [])
        .directive('counterHeader', [function () {
            return {
                restrict: 'E',
                replace: false,
                template: '<h2>Value: {{data.value}} | Latest Rate: {{rates && rates.length ? rates[rates.length - 1] + " counts/second" : "--N/A--"}}</h2>',
                scope: {
                    data: '=data',
                    rates: '=rates'
                }
            };
        }])
        .directive('gaugeHeader', [function () {
            return {
                restrict: 'E',
                replace: false,
                template: '<h2>Value: {{data.value}}</h2>',
                scope: {
                    data: '=data'
                }
            };
        }])
        .directive('richGaugeHeader', [function () {
            return {
                restrict: 'E',
                replace: false,
                template: '<h2>Value: {{data.value}} | Min: {{data.min}} | Max: {{data.max}} | Average: {{data.average}}</h2>',
                scope: {
                    data: '=data'
                }
            };
        }])
        .directive('barChart', require('analytics/directives/bar-chart'))
        .directive('bubbleChart', require('analytics/directives/bubble-chart'))
        .directive('graphChart', require('analytics/directives/graph-chart'))
        .directive('pieChart', require('analytics/directives/pie-chart'));
});
