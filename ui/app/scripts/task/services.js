/*
 * Copyright 2013-2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Definition of SCDF Task related services.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('dataflowTasks.services', [])
      .factory('TaskDefinitions', function ($resource, $rootScope, $log, $http) {
        return {
          getSingleTaskDefinition: function (taskname) {
            $log.info('Getting single task definition for task named ' + taskname);
            return $http({
              method: 'GET',
              url: $rootScope.dataflowServerUrl + '/tasks/definitions/' + taskname
            });
          },
          getAllTaskDefinitions: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all task definitions.');
              return $resource($rootScope.dataflowServerUrl + '/tasks/definitions', {}).get();
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              return $resource($rootScope.dataflowServerUrl + '/tasks/definitions',
                {
                  'page': pageable.pageNumber,
                  'size': pageable.pageSize
                },
                {
                  query: {
                    method: 'GET',
                    isArray: true
                  }
                }).get();
            }
            $log.info('Getting all task definitions.');
            return $resource($rootScope.dataflowServerUrl + '/tasks/definitions', {}, {
              query: {
                method: 'GET',
                isArray: true
              }
            }).get();
          }
        };
      })
      .factory('TaskApps', function ($resource, $rootScope) {
        return $resource($rootScope.dataflowServerUrl + '/apps?type=task', {}, {
          query: {
            method: 'GET',
            isArray: true
          }
        }).query();
      })
      .factory('AppMetaData', function ($resource, $log, $rootScope) {
        return {
          getAppMetadataForTask: function (taskName) {
              $log.info('Getting AppMetaData for task ' + taskName);
              return $resource($rootScope.dataflowServerUrl + '/runtime/apps',
              {'taskname' : taskName}, {
                getAppMetadataForTask: {
                  method: 'GET',
                  isArray: true
                }
              }).getAppMetadataForTask();
            }
        };
      })
      .factory('TaskAppService', function ($resource, $http, $log, $rootScope) {
        return {
          getAllApps: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all tasks apps.');
              return $resource($rootScope.dataflowServerUrl + '/apps', { 'type': 'task' }).get();
            }
            else {
              $log.info('Getting task apps for pageable:', pageable);
              return $resource($rootScope.dataflowServerUrl + '/apps',
                {
                  'type': 'task',
                  'page': pageable.pageNumber,
                  'size': pageable.pageSize
                }).get();
            }
          },
          getSingleApp: function (appName) {
            $log.info('Getting details for app222 ' + appName);
            return $resource($rootScope.dataflowServerUrl + '/apps/task/' + appName + '?unprefixedPropertiesOnly=true').get();
          },
          createDefinition: function (name, definition) {
            return $resource($rootScope.dataflowServerUrl + '/tasks/definitions', {}, {
              createDefinition: {
                method: 'POST',
                params: {
                  name: name,
                  definition: definition
                }
              }
            }).createDefinition();
          }
        };
      })
      .factory('TaskDefinitionService', function ($resource, $log, $rootScope) {
        return {
          destroy: function (taskDefinition) {
            $log.info('Undeploy Task ' + taskDefinition.name);
            return $resource($rootScope.dataflowServerUrl + '/tasks/definitions/' + taskDefinition.name, null, {
              destroy: { method: 'DELETE' }
            }).destroy();
          }
        };
      })
      .factory('TaskExecutions', function ($resource, $rootScope, $log) {
        return {
          getAllTaskExecutions: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all task executions.');
              return $resource($rootScope.dataflowServerUrl + '/tasks/executions', {}).get();
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              return $resource($rootScope.dataflowServerUrl + '/tasks/executions',
                {
                  'page': pageable.pageNumber,
                  'size': pageable.pageSize
                },
                {
                  query: {
                    method: 'GET',
                    isArray: true
                  }
                }).get();
            }
          }
        };
      })
      .factory('TaskLaunchService', function ($resource, growl, $rootScope) {
        return {
          convertToJsonAndSend: function (taskLaunchRequest) {
            var taskProperties = [];
            var taskArguments = [];

            taskLaunchRequest.taskProperties.forEach(function (taskProperty) {

              var key = taskProperty.key;
              var value = taskProperty.value;

              taskProperties.push(key + '=' + value);
            });
            taskLaunchRequest.taskArguments.forEach(function (taskArgument) {

              var key = taskArgument.key;
              var value = taskArgument.value;

              taskArguments.push(key + '=' + value);
            });

            var propertiesAsString = taskProperties.join();
            var argumentsAsString = taskArguments.join();

            console.log('propertiesAsString: ' + propertiesAsString + '; argumentsAsString: ' + argumentsAsString);

            this.launch(taskLaunchRequest.taskName, propertiesAsString, argumentsAsString);
          },
          launch: function (taskName, propertiesAsString, argumentsAsString) {
            console.log('Launching task...' + taskName);
            $resource($rootScope.dataflowServerUrl + '/tasks/deployments/:taskname', {
              'taskname': taskName, 'properties': propertiesAsString, 'arguments': argumentsAsString }, {
              launch: { method: 'POST' }
            }).launch().$promise.then(
                function () {
                  growl.success('Task ' + taskName + ' launched.');
                },
                function (data) {
                  console.error(data);
                  growl.error('Error while launching task ' + taskName);
                  growl.error(data.data[0].message);
                }
            );
          }
        };
      });
});
