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
 * About Controller logic.
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';

  return ['$scope', 'dataflowVersionInfo', '$state', 'DataflowUtils',
    function ($scope, dataflowVersionInfo, $state, utils) {
      $scope.$apply(function () {
        console.log(dataflowVersionInfo);
        $scope.dataflowVersionInfo = dataflowVersionInfo;
      });
      $scope.goBack = function() {
          $state.go('home.about');
      };

      $scope.isEmpty = function(obj) {
        for(var prop in obj) {
          if(obj.hasOwnProperty(prop)) {
            return false;
          }
        }
        return true;
      };

      $scope.onCopyToClipboardSuccess = function(e) {
          utils.growl.success('Copied About Details to Clipboard (As JSON).');
          e.clearSelection();
      };
    }
  ];
});
