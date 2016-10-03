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
 * Definition of SCDF Task controllers.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('dataflowTasks.controllers', [])
      .controller('TaskDefinitionsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/definitions'], function (taskDefinitionsController) {
              $injector.invoke(taskDefinitionsController, this, {'$scope': $scope});
            });
          }])
      .controller('BulkDefineTasksController',
          ['$scope', '$injector', function ($scope, $injector) {
              require(['task/controllers/bulk-define-tasks'], function (bulkDefineTasksController) {
                  $injector.invoke(bulkDefineTasksController, this, {'$scope': $scope});
              });
          }])
      .controller('TaskExecutionsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/executions'], function (taskExecutionsController) {
              $injector.invoke(taskExecutionsController, this, {'$scope': $scope});
            });
          }])
      .controller('TaskLaunchController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/launch'], function (taskLaunchController) {
              $injector.invoke(taskLaunchController, this, {'$scope': $scope});
            });
          }])
      .controller('TaskAppsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/apps'], function (taskAppsController) {
              $injector.invoke(taskAppsController, this, {'$scope': $scope});
            });
          }])
      .controller('AppDetailsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/app-details'], function (appDetailsController) {
              $injector.invoke(appDetailsController, this, {'$scope': $scope});
            });
          }])
      .controller('AppCreateDefinitionController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/app-create-definition'], function (appCreateDefinitionController) {
              $injector.invoke(appCreateDefinitionController, this, {'$scope': $scope});
            });
          }]);
});
