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
 * XD Container services.
 *
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('xdAnalyticsAdmin.services', [])
        .factory('CounterService', function ($rootScope, $http) {
            return {
                getAll: function (params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/counters',
                        params: params
                    });
                },
                getData: function (name) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/counters/' + name
                    });
                }
            };
        })
        .factory('FieldValueCounterService', function ($rootScope, $http) {
            return {
                getAll: function (params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/field-value-counters',
                        params: params
                    });
                },
                getData: function (name) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/field-value-counters/' + name
                    });
                }
            };
        })
        .factory('AggregateCounterService', function ($rootScope, $http) {
            return {
                getAll: function (params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/aggregate-counters',
                        params: params
                    });
                },
                getData: function (name, params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/aggregate-counters/' + name,
                        params: params
                    });
                }
            };
        })
        .factory('GaugeService', function ($rootScope, $http) {
            return {
                getAll: function (params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/gauges',
                        params: params
                    });
                },
                getData: function (name) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/gauges/' + name
                    });
                }
            };
        })
        .factory('RichGaugeService', function ($rootScope, $http) {
            return {
                getAll: function (params) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/rich-gauges',
                        params: params
                    });
                },
                getData: function (name) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/metrics/rich-gauges/' + name
                    });
                }
            };
        });

});
