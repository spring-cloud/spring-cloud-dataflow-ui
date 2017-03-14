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
 * Definition of Task Definition controller
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define(['model/pageable', 'angular'], function (Pageable, angular) {
  'use strict';

  var PREFIX_COMPOSED_TASK_DEF = '--graph="';
  var SUFFIX_COMPOSED_TASK_DEF = '"';
  // var EXPANDED_STATE_COOKIE_KEY = 'taskDefs.expandedState';

  return ['$scope', 'TaskDefinitions', 'TaskDefinitionService', 'DataflowUtils', '$state', '$rootScope', /*'$cookieStore',*/
    function ($scope, taskDefinitions, taskDefinitionService, utils, $state, $rootScope/*, $cookieStore*/) {

      var getTaskDefinitions;
      var expandedState = /*$cookieStore.get(EXPANDED_STATE_COOKIE_KEY) ||*/ {};

      $scope.toggleExpanded = function(name) {
        if (expandedState[name]) {
          delete expandedState[name];
        } else {
          expandedState[name] = true;
        }
      };

      $scope.isExpanded = function(name) {
        return expandedState[name];
      };

      $scope.collapsePage = function() {
        $scope.pageable.items.forEach(function(item) {
          delete expandedState[item.name];
        });
      };

      $scope.expandPage = function() {
        $scope.pageable.items.forEach(function(item) {
          expandedState[item.name] = true;
        });
      };

      function loadTaskDefinitions(pageable, showGrowl) {
        var taskDefinitionsPromise =  taskDefinitions.getAllTaskDefinitions(pageable).$promise;
        if (showGrowl || showGrowl === undefined) {
          utils.addBusyPromise(taskDefinitionsPromise);
        }
        taskDefinitionsPromise.then(
            function (result) {
              if (!!result._embedded) {
                $scope.pageable.items = result._embedded.taskDefinitionResourceList;
              }
              $scope.pageable.total = result.page.totalElements;
              getTaskDefinitions = utils.$timeout(function() {
                loadTaskDefinitions($scope.pageable, false);
              }, $rootScope.pageRefreshTime);
              $scope.$on('$destroy', function(){
                utils.$timeout.cancel(getTaskDefinitions);
              });
            }, function (result) {
              utils.growl.addErrorMessage(result.data[0].message);
            }
        );
      }
      $scope.pageable = new Pageable();
      $scope.pageable.sortOrder = 'ASC';
      $scope.pageable.sortProperty = ['DEFINITION_NAME', 'DEFINITION'];
      $scope.pagination = {
        current: 1
      };
      $scope.pageChanged = function(newPage) {
        $scope.pageable.pageNumber = newPage-1;
        loadTaskDefinitions($scope.pageable);
      };
      $scope.sortChanged = function(sortState) {
        loadTaskDefinitions(sortState);
      };
      $scope.searchChanged = function() {
        loadTaskDefinitions($scope.pageable);
      };
      $scope.clickModal = function (streamDefinition) {
        $scope.destroyItem = streamDefinition;
      };
      $scope.destroyTask = function (taskDefinition) {
        utils.$log.info('Destroying Task ' + taskDefinition.name);
        utils.$log.info(taskDefinitionService);
        taskDefinitionService.destroy(taskDefinition).$promise.then(
            function () {
              utils.growl.success('Destroy Request Sent.');
              taskDefinition.inactive = true;
              $scope.closeModal();
            },
            function () {
              utils.growl.error('Error Destroying Task.');
              $scope.closeModal();
            }
        );
      };
      $scope.launchTask = function (item) {
        utils.$log.info('Launching Task: ' + item.name);
        $state.go('home.tasks.deploymentsLaunch', {taskName: item.name});
      };
      $scope.bulkDefineTasks = function() {
        $state.go('home.tasks.bulkDefineTasks');
      };
      $scope.detailed = function(task) {
        $state.go('home.tasks.detailedTask', {taskName: task.name});
      };
      $scope.getComposedTaskDefinition = function(item) {
        if (item && angular.isString(item.dslText)) {
          var start = item.dslText.indexOf(PREFIX_COMPOSED_TASK_DEF);
          if (start >= 0) {
            start = start + PREFIX_COMPOSED_TASK_DEF.length;
            var end = item.dslText.indexOf(SUFFIX_COMPOSED_TASK_DEF, start);
            if (end > start) {
              return item.dslText.substring(start, end);
            }
          }
        }
      };
      $scope.$on('$destroy', function() {
        // if (Object.keys(expandedState).length === 0) {
        //   $cookieStore.remove(EXPANDED_STATE_COOKIE_KEY);
        // } else {
        //   $cookieStore.put(EXPANDED_STATE_COOKIE_KEY, expandedState);
        // }

        if (getTaskDefinitions) {
          utils.$timeout.cancel(getTaskDefinitions);
        }
      });


      loadTaskDefinitions($scope.pageable);
    }];
});
