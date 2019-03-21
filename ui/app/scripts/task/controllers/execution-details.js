/*
 * Copyright 2017 the original author or authors.
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
 * Definition of the Task Execution Details controller
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';
  return ['$scope', 'TaskExecutions', 'DataflowUtils', '$state', '$stateParams',
    function ($scope, taskExecutions, utils, $state, $stateParams) {
      function loadTaskExecutionDetails(executionId) {
        var singleTaskExecutionPromise = taskExecutions.getSingleTaskExecution(executionId).$promise;
        utils.addBusyPromise(singleTaskExecutionPromise);

        singleTaskExecutionPromise.then(
            function (result) {
              utils.$log.info(result);
              $scope.taskExecutionDetails = result;
              // if (utils.taskExecutionIdHierarchy.length === 0 || utils.taskExecutionIdHierarchy[utils.taskExecutionIdHierarchy.length-1] !== executionId) {
              //   utils.taskExecutionIdHierarchy.push(executionId);
              // }
            }, function (error) {
              if (error.status === 404) {
                $scope.taskExecutionDetailsNotFound = true;
                $scope.executionId = $stateParams.executionId;
              }
              else {
                utils.growl.error(error);
              }
            }
        );
      }
      $scope.$apply(function () {
        $scope.appName = $stateParams.appName;
        $scope.optionsPredicate = 'name';
        loadTaskExecutionDetails($stateParams.executionId);
      });
      $scope.taskJobExecutionDetails = function () {
        utils.$log.info('Closing Task Execution Details Window');

        if (utils.taskExecutionIdHierarchy.length > 1) {
          utils.taskExecutionIdHierarchy.pop();
          $state.go('home.tasks.executiondetails', {executionId: utils.taskExecutionIdHierarchy.pop()});
        }
        else {
          $state.go('home.tasks.tabs.executions');
        }
      };
      $scope.viewJobExecutionDetails = function (jobExecutionId) {
        utils.$log.info('Showing Job Execution details for Job Execution with Id: ' + jobExecutionId);
        $state.go('home.jobs.executiondetails', {executionId: jobExecutionId});
      };
      $scope.closeTaskExecutionDetails = function () {
        utils.$log.info('Closing Job Execution Details Window');
        
        if (utils.taskExecutionIdHierarchy.length > 1) {
          utils.taskExecutionIdHierarchy.pop();
          $state.go('home.tasks.executiondetails', {executionId: utils.taskExecutionIdHierarchy.pop()});
        }
        else {
          $state.go('home.tasks.tabs.executions');
        }
      };
    }];
});
