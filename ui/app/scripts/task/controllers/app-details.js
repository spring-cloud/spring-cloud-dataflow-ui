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
 * Definition of the App Details controller
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';
  return ['$scope', 'TaskAppService', 'DataflowUtils', '$state', '$stateParams',
    function ($scope, taskAppService, utils, $state, $stateParams) {
      $scope.$apply(function () {
        $scope.appName = $stateParams.appName;
        $scope.optionsPredicate = 'name';
        var singleAppPromise = taskAppService.getSingleApp($stateParams.appName).$promise;
        utils.addBusyPromise(singleAppPromise);

        singleAppPromise.then(
            function (result) {
                $scope.appDetails = result;
              }, function (error) {
                utils.growl.error('Error fetching app details. ' + error.data[0].message);
              }
            );
        $scope.closeAppDetails = function () {
            utils.$log.info('Closing Task Details Window');
            $state.go('home.tasks.tabs.appsList');
          };
      });
    }];
});
