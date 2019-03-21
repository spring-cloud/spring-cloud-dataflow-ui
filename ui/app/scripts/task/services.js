/*
 * Copyright 2013-2017 the original author or authors.
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
 * @author Alex Boyko
 */
define(function(require) {
  'use strict';

  var angular = require('angular');

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
            var params = {};
            if (pageable === undefined) {
              $log.info('Getting all task definitions.');
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              params = {
                'page': pageable.pageNumber,
                'size': pageable.pageSize
              };
              params.sort = pageable.calculateSortParameter();

              if (pageable.filterQuery && pageable.filterQuery.trim().length > 0) {
                params.search = pageable.filterQuery;
              }
            }
            return $resource($rootScope.dataflowServerUrl + '/tasks/definitions', params, {
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
            if (pageable === undefined) {
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
            $log.info('Getting details for app ' + appName);
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
          },
          createDefinition: function (name, dsl) {
            $log.info('Creating Task Definition' + name);
            return $resource($rootScope.dataflowServerUrl + '/tasks/definitions/', {}, {
              createDefinition: {
                method: 'POST',
                params: {
                  name: name,
                  definition: dsl
                }
              }
            }).createDefinition();
          }
        };
      })
      .factory('TaskExecutions', function ($resource, $rootScope, $log) {
        return {
          getSingleTaskExecution: function (taskExecutionId) {
            $log.info('Getting details for Task Execution with Id ' + taskExecutionId);
            return $resource($rootScope.dataflowServerUrl + '/tasks/executions/' + taskExecutionId).get();
          },
          getAllTaskExecutions: function (pageable) {
            var params = {};
            if (pageable === undefined) {
              $log.info('Getting all task executions.');
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              params = {
                'page': pageable.pageNumber,
                'size': pageable.pageSize
              };

              params.sort = pageable.calculateSortParameter();
              console.log('>>' + params.sort);
            }
            return $resource($rootScope.dataflowServerUrl + '/tasks/executions', params, {
              query: {
                method: 'GET',
                isArray: true
              }
            }).get();
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
            $resource($rootScope.dataflowServerUrl + '/tasks/executions', {
              'name': taskName, 'properties': propertiesAsString, 'arguments': argumentsAsString }, {
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
      })
      .factory('PropertiesDialogService', function($modal, $log) {
          return {
              show: function(element) {
                  $modal.open({
                      animation: true,
                      templateUrl: 'scripts/task/dialogs/task-element-properties-dialog.html',
                      controller: 'TaskElementPropertiesDialogController',
                      size: 'lg',
                      resolve: {
                          cell: function () {
                              return element;
                          }
                      }
                  }).result.then(function (results) {

                      $log.debug(JSON.stringify(results));

                      var properties = results.properties;
                      var property;

                      element.trigger('batch:start', { batchName: 'update properties' });

                      if (results.labelProperty) {
                          if (results.labelProperty.attr) {
                              if (angular.isDefined(results.labelProperty.value)) {
                                  element.attr(results.labelProperty.attr, results.labelProperty.value);
                              } else {
                                  element.attr(results.labelProperty.attr, '');
                              }
                          }
                      }

                      Object.keys(properties).forEach(function (key) {
                          property = properties[key];
                          if ((typeof property.value === 'boolean' && !property.defaultValue && !property.value) ||
                              (property.value === property.defaultValue || property.value === '' || property.value === undefined || property.value === null)) {
                              if (angular.isDefined(element.attr('props/' + property.nameInUse))) {
                                  // Remove attr doesn't fire appropriate event. Set default value first as a workaround to schedule DSL resync
                                  element.attr('props/' + property.nameInUse, property.defaultValue === undefined ? null : property.defaultValue);
                                  element.removeAttr('props/' + property.nameInUse);
                              }
                          } else {
                              element.attr('props/' + property.nameInUse, property.value);
                          }
                      });

                      element.trigger('batch:stop', { batchName: 'update properties' });
                  });

              }
          };
      })
      .factory('TaskDslValidatorService', require('task/services/task-dsl-validator'))
      .factory('TaskContentAssistService', require('task/services/content-assist-service'))
      .factory('ComposedTasksMetamodelService', require('task/services/metamodel'))
      .factory('ComposedTasksEditorService', require('task/services/editor-service'))
      .factory('ComposedTasksRenderService', require('task/services/render-service'));

});
