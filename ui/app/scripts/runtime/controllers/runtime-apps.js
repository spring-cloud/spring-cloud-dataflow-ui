/*
 * Copyright 2013-2016 the original author or authors.
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

      var runtimeAppsTimeoutPromise;

      function loadRuntimeApps(pageable, showGrowl) {
        var runtimeAppsPromise = runtimeService.getRuntimeApps(pageable).$promise;
        if (showGrowl || showGrowl === undefined) {
          utils.addBusyPromise(runtimeAppsPromise);
        }
        runtimeAppsPromise.then(
          function (result) {
            var apps = result._embedded ? result._embedded.appStatusResourceList : [];
            utils.$log.info('Retrieved runtimeApps...', apps);
            $scope.pageable.items = apps;
            $scope.pageable.total = result.page.totalElements;
            runtimeAppsTimeoutPromise = $timeout(function() {
              loadRuntimeApps($scope.pageable, false);
            }, $rootScope.pageRefreshTime);
            $scope.$on('$destroy', function(){
              $timeout.cancel(runtimeAppsTimeoutPromise);
            });
          }, function (result) {
            utils.growl.addErrorMessage(result.data[0].message);
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
