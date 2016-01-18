/*
 * Copyright 2014 the original author or authors.
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
 * Definition of the Job Execution Details controller
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';
  return ['$scope', 'JobExecutions', 'XDUtils', '$state', '$stateParams',
    function ($scope, jobExecutions, utils, $state, $stateParams) {
      function loadJobExecutionDetails(executionId) {
        var singleJobExecutionPromise = jobExecutions.getSingleJobExecution(executionId).$promise;
        utils.addBusyPromise(singleJobExecutionPromise);

        singleJobExecutionPromise.then(
            function (result) {
              utils.$log.info(result);
              $scope.jobExecutionDetails = result;

              if (utils.jobExecutionIdHierarchy.length === 0 || utils.jobExecutionIdHierarchy[utils.jobExecutionIdHierarchy.length-1] !== executionId) {
                utils.jobExecutionIdHierarchy.push(executionId);
              }
            }, function (error) {
              if (error.status === 404) {
                $scope.jobExecutionDetailsNotFound = true;
                $scope.executionId = $stateParams.executionId;
              }
              else {
                utils.growl.error(error);
              }
            }
        );
      }
      $scope.$apply(function () {
        $scope.moduleName = $stateParams.moduleName;
        $scope.optionsPredicate = 'name';
        loadJobExecutionDetails($stateParams.executionId);
      });
      $scope.closeJobExecutionDetails = function () {
        utils.$log.info('Closing Job Execution Details Window');

        if (utils.jobExecutionIdHierarchy.length > 1) {
          utils.jobExecutionIdHierarchy.pop();
          $state.go('home.jobs.executiondetails', {executionId: utils.jobExecutionIdHierarchy.pop()});
        }
        else {
          $state.go('home.jobs.tabs.executions');
        }
      };
      $scope.viewStepExecutionDetails = function (jobExecution, stepExecution) {
        utils.$log.info('Showing Step Execution details for Job Execution with Id: ' + jobExecution.executionId);
        $state.go('home.jobs.stepexecutiondetails', {
          executionId: jobExecution.executionId,
          stepExecutionId: stepExecution.id
        });
      };
      $scope.viewJobExecutionDetails = function (jobExecution) {
        utils.$log.info('Showing Job Execution details for Job Execution with Id: ' + jobExecution.executionId);
        $state.go('home.jobs.executiondetails', {executionId: jobExecution.executionId});
      };
      $scope.restartJob = function (job) {
        utils.$log.info('Restarting Job ' + job.name);
        jobExecutions.restart(job).$promise.then(
            function (result) {
              utils.$log.info(result);
              utils.growl.success('Job was relaunched.');
              loadJobExecutionDetails($stateParams.executionId);
            }, function (error) {
              if (error.data[0].logref === 'NoSuchBatchJobException') {
                utils.growl.error('The BatchJob ' + job.name + ' is currently not deployed.');
              }
              else {
                utils.growl.error(error.data[0].message);
              }
            });
      };
      $scope.stopJob = function (job) {
        utils.$log.info('Stopping Job ' + job.name);
        jobExecutions.stop(job).$promise.then(
            function (result) {
              utils.$log.info(result);
              utils.growl.success('Stop request sent.');
              loadJobExecutionDetails($stateParams.executionId);
            }, function (error) {
              utils.growl.error(error.data[0].message);
            });
      };
    }];
});
