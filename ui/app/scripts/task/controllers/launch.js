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
 * Definition of Task Launch controller
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define([], function () {
  'use strict';
  return ['$scope', 'TaskLaunchService', 'XDUtils', '$state', '$stateParams', '$location',
    function ($scope, taskLaunchService, utils, $state, $stateParams, $location) {
      $scope.$apply(function () {
        var taskLaunchRequest = $scope.taskLaunchRequest = {
          taskName: $stateParams.taskName,
          taskProperties: [],
          taskArguments: []
        };

        utils.$log.info($stateParams);

        $scope.addProperty = function () {
          taskLaunchRequest.taskProperties.push({key: '', value: '', type: 'string'});
        };

        $scope.addArgument = function () {
          taskLaunchRequest.taskArguments.push({key: '', value: '', type: 'string'});
        };

        $scope.removeProperty = function (taskProperty) {
          for (var i = 0, ii = taskLaunchRequest.taskProperties.length; i < ii; i++) {
            if (taskProperty === taskLaunchRequest.taskProperties[i]) {
              $scope.taskLaunchRequest.taskProperties.splice(i, 1);
            }
          }
        };
        $scope.removeArgument = function (taskArgument) {
          for (var i = 0, ii = taskLaunchRequest.taskArguments.length; i < ii; i++) {
            if (taskArgument === taskLaunchRequest.taskArguments[i]) {
              $scope.taskLaunchRequest.taskArguments.splice(i, 1);
            }
          }
        };
        $scope.cancelTaskLaunch = function () {
          utils.$log.info('Cancelling Task Launch');
          $state.go('home.tasks.tabs.definitions');
        };

        $scope.launchTask = function (taskLaunchRequest) {
          utils.$log.info('Launching Task ' + taskLaunchRequest.taskName);
          taskLaunchService.convertToJsonAndSend(taskLaunchRequest);
          $location.path('/tasks/definitions');
        };
      });
    }];
});
