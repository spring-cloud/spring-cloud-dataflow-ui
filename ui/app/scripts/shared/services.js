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
 * Dashboard shared (global) services.
 *
 * @author Ilayaperumal Gopinathan
 */
define(function (require) {
  'use strict';

  var angular = require('angular');
  require('xregexp');
  return angular.module('dataflowShared.services', [])
      .factory('DataflowUtils', function ($log, growl, $timeout, $q, $rootScope) {

        var appNameRegex = new XRegExp('[\\p{N}|\\p{L}|\\p{Po}]*(?=[\\s]*--)', 'i');

        $rootScope.jobExecutionIdHierarchy = [];
        $rootScope.taskExecutionIdHierarchy = [];

        return {
          $log: $log,
          growl: growl,
          $timeout: $timeout,
          $q: $q,
          $rootScope: $rootScope,
          addBusyPromise: function (promise) {
            $rootScope.cgbusy = promise;
          },
          jobExecutionIdHierarchy: $rootScope.jobExecutionIdHierarchy,
          taskExecutionIdHierarchy: $rootScope.taskExecutionIdHierarchy,
          getAppNameFromJobDefinition: function(jobDefinition) {
            if (!jobDefinition) {
              throw new Error('jobDefinition must be defined.');
            }
            $log.info('Processing job definition: ' + jobDefinition);
            var app = XRegExp.exec(jobDefinition, appNameRegex);
            var appName;
            if (app) {
              appName = app[0];
            }
            else {
              appName = jobDefinition;
            }
            $log.info('Found App Name: ' + appName);
            return appName;
          }
        };
      })
      .factory('MetricService', function ($resource, $rootScope, $log) {
        return {
          getMetrics: function (metricRequestMap) {
            $log.info('Getting all runtime metrics.');
            return $resource($rootScope.dataflowServerUrl + '/metrics/runtime', {}).save(null, metricRequestMap);
          }
        };
      })
      .factory('ParserService',require('shared/services/parser'))
      .factory('dataflowVersionInfo', function ($resource, $rootScope, DataflowUtils) {
        console.log('dataflowVersionInfo');
        var dataflowVersionInfoPromise =  $resource($rootScope.dataflowServerUrl + '/about', {}, {
          query: {
            method: 'GET'
          }
        }).query();
        DataflowUtils.addBusyPromise(dataflowVersionInfoPromise);
        return dataflowVersionInfoPromise;
      });
});
