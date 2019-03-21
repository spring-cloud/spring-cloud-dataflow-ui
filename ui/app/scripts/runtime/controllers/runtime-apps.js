/*
 * Copyright 2013-2014 the original author or authors.
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
 * Dashboard runtime apps controllers
 *
 * @author Ilayaperumal Gopinathan
 * @author Gunnar Hillert
 */
define(['model/pageable'], function (Pageable) {
  'use strict';
  return ['$scope', 'RuntimeService', 'DataflowUtils', '$timeout', '$rootScope',
    function ($scope, runtimeService, utils, $timeout, $rootScope) {
      function loadRuntimeAppsWithTimeout() {
        $scope.runtimeTimeOutPromise = $timeout(function() {
          loadRuntimeApps($scope.pageable);
        }, $rootScope.pageRefreshTime);
      }
      function loadRuntimeApps(pageable) { // jshint ignore:line
        utils.$log.info('pageable', pageable);
        runtimeService.getRuntimeApps(pageable).$promise.then(
            function (result) {
              var apps = result._embedded ? result._embedded.appStatusResourceList : [];
              utils.$log.info('Retrieved runtimeApps...', apps);
              $scope.pageable.items = apps;
              $scope.pageable.total = result.page.totalElements;
              loadRuntimeAppsWithTimeout();
            }
        );
      }
      $scope.pageable = new Pageable();
      $scope.pagination = {
        current: 1
      };
      $scope.pageChanged = function(newPage) {
        $scope.pageable.pageNumber = newPage-1;
        loadRuntimeApps($scope.pageable);
      };

      loadRuntimeApps($scope.pageable);
    }];
});
