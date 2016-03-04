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
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('xdTasksAdmin.controllers', [])
      .controller('TaskDefinitionsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/definitions'], function (taskDefinitionsController) {
              $injector.invoke(taskDefinitionsController, this, {'$scope': $scope});
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
      .controller('ModuleController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/modules'], function (modulesController) {
              $injector.invoke(modulesController, this, {'$scope': $scope});
            });
          }])
      .controller('ModuleDetailsController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/module-details'], function (moduleDetailsController) {
              $injector.invoke(moduleDetailsController, this, {'$scope': $scope});
            });
          }])
      .controller('ModuleCreateDefinitionController',
          ['$scope', '$injector', function ($scope, $injector) {
            require(['task/controllers/module-create-definition'], function (moduleCreateDefinitionController) {
              $injector.invoke(moduleCreateDefinitionController, this, {'$scope': $scope});
            });
          }]);
});
