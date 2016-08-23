/*
 * Copyright 2014-2016 the original author or authors.
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
 * Handles the listing of task apps.
 *
 * @author Gunnar Hillert
 */
define(['model/pageable'], function (Pageable) {
  'use strict';

  return ['$scope', 'TaskAppService', 'DataflowUtils', '$state',
    function ($scope, taskAppService, utils, $state) {
      function getTaskApps(pageable) {
        utils.$log.info('pageable', pageable);
        var taskAppsPromise = taskAppService.getAllApps(pageable).$promise;
        utils.addBusyPromise(taskAppsPromise);
        taskAppsPromise.then(
            function (result) {
              utils.$log.info(result);
              if (!!result._embedded) {
                $scope.pageable.items = result._embedded.appRegistrationResourceList;
              }
              $scope.pageable.total = result.page.totalElements;
            }, function (result) {
              utils.growl.error(result.data[0].message);
            }
        );
      }
      $scope.pageable = new Pageable();
      $scope.pagination = {
        current: 1
      };
      $scope.pageChanged = function(newPage) {
        $scope.pageable.pageNumber = newPage-1;
        getTaskApps($scope.pageable);
      };

      $scope.viewAppDetails = function (item) {
        utils.$log.info('Showing App details for app: ' + item.name);
        $state.go('home.tasks.appdetails', {appName: item.name});
      };
      $scope.createDefinition = function (item) {
        $state.go('home.tasks.appcreatedefinition', {appName: item.name});
      };

      getTaskApps($scope.pageable);
    }
  ];
});
