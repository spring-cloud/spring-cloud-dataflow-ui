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
 * Definition of Dashboard job services.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['angular'], function (angular) {
  'use strict';

  return angular.module('xdJobsAdmin.services', [])
      .factory('JobExecutions', function ($resource, $rootScope, $log) {
        return {
          getAllJobExecutions: function (pageable) {
            if (pageable === 'undefined') {
              $log.info('Getting all task executions.');
              return $resource($rootScope.xdAdminServerUrl + '/jobs/executions', {}).get();
            }
            else {
              $log.info('Getting task definitions for pageable:', pageable);
              return $resource($rootScope.xdAdminServerUrl + '/jobs/executions',
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
          },
          getSingleJobExecution: function (jobExecutionId) {
            $log.info('Getting details for Job Execution with Id ' + jobExecutionId);
            return $resource($rootScope.xdAdminServerUrl + '/jobs/executions/' + jobExecutionId).get();
          },
          restart: function (jobExecution) {
            $log.info('Restart Job Execution' + jobExecution.executionId);
            return $resource($rootScope.xdAdminServerUrl + '/jobs/executions/' + jobExecution.executionId, { 'restart': true }, {
              restart: { method: 'PUT' }
            }).restart();
          },
          stop: function (jobExecution) {
              $log.info('Stop Job Execution' + jobExecution.executionId);
              return $resource($rootScope.xdAdminServerUrl + '/jobs/executions/' + jobExecution.executionId, { 'stop': true }, {
                stop: { method: 'PUT' }
              }).stop();
            }
        };
      })
      .factory('StepExecutions', function ($resource, $rootScope, $log) {
        return {
          getSingleStepExecution: function (jobExecutionId, stepExecutionId) {
            $log.info('Getting details for Step Execution with Id ' + stepExecutionId + '(Job Execution Id ' + jobExecutionId + ')');
            return $resource($rootScope.xdAdminServerUrl + '/jobs/executions/' + jobExecutionId +  '/steps/' + stepExecutionId).get();
          },
          getStepExecutionProgress: function (jobExecutionId, stepExecutionId) {
            $log.info('Getting progress details for Step Execution with Id ' + stepExecutionId + '(Job Execution Id ' + jobExecutionId + ')');
            return $resource($rootScope.xdAdminServerUrl + '/jobs/executions/' + jobExecutionId +  '/steps/' + stepExecutionId + '/progress').get();
          }
        };
      });
});
