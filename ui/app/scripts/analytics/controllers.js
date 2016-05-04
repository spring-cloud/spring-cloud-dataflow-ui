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
 * Definition of Dataflow Dashbaord controllers for the analytics module.
 *
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('xdAnalyticsAdmin.controllers', ['xdAnalyticsAdmin.services'])
        .controller('DashboardController',
        ['$scope', '$injector', function ($scope, $injector) {
            require(['analytics/controllers/dashboard'], function (dashboardController) {
                $injector.invoke(dashboardController, this, {'$scope': $scope});
            });
        }])
        .controller('MetricController',
        ['$scope', '$injector', function ($scope, $injector) {
            require(['analytics/controllers/metric'], function (metricController) {
                $injector.invoke(metricController, this, {'$scope': $scope});
            });
        }])
        .controller('CountersController',
        ['$scope', '$injector', function ($scope, $injector) {
            require(['analytics/controllers/counters'], function (countersController) {
                $injector.invoke(countersController, this, {'$scope': $scope});
            });
        }])
        .controller('GaugesController',
        ['$scope', '$injector', function ($scope, $injector) {
            require(['analytics/controllers/gauges'], function (gaugesController) {
                $injector.invoke(gaugesController, this, {'$scope': $scope});
            });
        }])
        .controller('RichGaugesController',
        ['$scope', '$injector', function ($scope, $injector) {
            require(['analytics/controllers/rich-gauges'], function (richGaugesController) {
                $injector.invoke(richGaugesController, this, {'$scope': $scope});
            });
        }]);
});
