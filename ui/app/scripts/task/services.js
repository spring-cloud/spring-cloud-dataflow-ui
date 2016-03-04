/*
 * Copyright 2013-2016 the original author or authors.
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
 * Definition of SCDF Task related services.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('xdTasksAdmin.services', [])
      .factory('TaskDefinitions', function ($resource, $rootScope, $log, $http) {
        return {
          getSingleTaskDefinition: function (taskname) {
            $log.info('Getting single task definition for task named ' + taskname);
            return $http({
              method: 'GET',
              url: $rootScope.xdAdminServerUrl + '/tasks/definitions/' + taskname
            });
          },
          getAllTaskDefinitions: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all task definitions.');
              return $resource($rootScope.xdAdminServerUrl + '/tasks/definitions', {}).get();
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              return $resource($rootScope.xdAdminServerUrl + '/tasks/definitions',
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
            return $resource($rootScope.xdAdminServerUrl + '/tasks/definitions', {}, {
              query: {
                method: 'GET',
                isArray: true
              }
            }).get();
          }
        };
      })
      .factory('TaskModules', function ($resource, $rootScope) {
        return $resource($rootScope.xdAdminServerUrl + '/modules?type=task', {}, {
          query: {
            method: 'GET',
            isArray: true
          }
        }).query();
      })
      .factory('ModuleMetaData', function ($resource, $log, $rootScope) {
        return {
          getModuleMetaDataForTask: function (taskName) {
              $log.info('Getting ModuleMetaData for task ' + taskName);
              return $resource($rootScope.xdAdminServerUrl + '/runtime/modules',
              {'taskname' : taskName}, {
                getModuleMetaDataForTask: {
                  method: 'GET',
                  isArray: true
                }
              }).getModuleMetaDataForTask();
            }
        };
      })
      .factory('TaskModuleService', function ($resource, $http, $log, $rootScope) {
        return {
          getAllModules: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all tasks modules.');
              return $resource($rootScope.xdAdminServerUrl + '/modules', { 'type': 'task' }).get();
            }
            else {
              $log.info('Getting task modules for pageable:', pageable);
              return $resource($rootScope.xdAdminServerUrl + '/modules',
                {
                  'type': 'task',
                  'page': pageable.pageNumber,
                  'size': pageable.pageSize
                }).get();
            }
          },
          getSingleModule: function (moduleName) {
            $log.info('Getting details for module222 ' + moduleName);
            return $resource($rootScope.xdAdminServerUrl + '/modules/task/' + moduleName + '?unprefixedPropertiesOnly=true').get();
          },
          createDefinition: function (name, definition) {
            return $resource($rootScope.xdAdminServerUrl + '/tasks/definitions', {}, {
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
            return $resource($rootScope.xdAdminServerUrl + '/tasks/definitions/' + taskDefinition.name, null, {
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
              return $resource($rootScope.xdAdminServerUrl + '/tasks/executions', {}).get();
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              return $resource($rootScope.xdAdminServerUrl + '/tasks/executions',
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
            var parameters = [];
            taskLaunchRequest.taskParameters.forEach(function (taskParameter) {

              var key = taskParameter.key;
              var value = taskParameter.value;

              parameters.push(key + '=' + value);
            });

            var parametersAsString = parameters.join();

            console.log(parametersAsString);

            this.launch(taskLaunchRequest.taskName, parametersAsString);
          },
          launch: function (taskName, jsonDataAsString) {
            console.log('Launching task...' + taskName);
            $resource($rootScope.xdAdminServerUrl + '/tasks/deployments/:taskname', { 'taskname': taskName, 'properties': jsonDataAsString }, {
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
