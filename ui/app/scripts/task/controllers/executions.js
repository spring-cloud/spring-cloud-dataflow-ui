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
 * Definition of Task Execution controller
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['model/pageable'], function (Pageable) {
  'use strict';
  return ['$scope', 'TaskExecutions', 'DataflowUtils', function ($scope, taskExecutions, utils) {
    function loadTaskExecutions(pageable) {
      var taskExcutionsPromise = taskExecutions.getAllTaskExecutions(pageable).$promise;
      utils.addBusyPromise(taskExcutionsPromise);

      taskExcutionsPromise.then(
          function (result) {
            utils.$log.info('task excutions', result);
            if (!!result._embedded) {
              $scope.pageable.items = result._embedded.taskExecutionResourceList;
            }
            $scope.pageable.total = result.page.totalElements;
            utils.$log.info('$scope.pageable', $scope.pageable);
          }, function () {
            utils.growl.error('Error fetching data. Is the Data Flow server running?');
          });
    }
    $scope.pageable = new Pageable();
    $scope.pageable.sortOrder = 'DESC';
    $scope.pageable.sortProperty = ['TASK_EXECUTION_ID'];

    $scope.pagination = {
      current: 1
    };
    $scope.pageChanged = function(newPage) {
      $scope.pageable.pageNumber = newPage-1;
      loadTaskExecutions($scope.pageable);
    };
    $scope.sortChanged = function(sortState) {
      console.log('sortState: ', sortState);
      loadTaskExecutions(sortState);
    };

    loadTaskExecutions($scope.pageable);
  }];
});
