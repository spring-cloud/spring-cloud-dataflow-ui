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
  return ['$scope', 'TaskLaunchService', 'DataflowUtils', '$state', '$stateParams', '$location',
    function ($scope, taskLaunchService, utils, $state, $stateParams, $location) {
      $scope.$apply(function () {
        var taskLaunchRequest = $scope.taskLaunchRequest = {
          taskName: $stateParams.taskName,
          taskParameters: []
        };

        utils.$log.info($stateParams);

        $scope.addParameter = function () {
          taskLaunchRequest.taskParameters.push({key: '', value: '', type: 'string'});
        };

        $scope.removeParameter = function (taskParameter) {
          for (var i = 0, ii = taskLaunchRequest.taskParameters.length; i < ii; i++) {
            if (taskParameter === taskLaunchRequest.taskParameters[i]) {
              $scope.taskLaunchRequest.taskParameters.splice(i, 1);
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
