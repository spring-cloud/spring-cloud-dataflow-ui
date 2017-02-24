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
 * Stream Definition controller
 *
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define(['model/pageable'], function (Pageable) {
  'use strict';

  var EXPANDED_STATE_COOKIE_KEY = 'stremDefs.expandedState';

  return ['$scope', 'StreamService', 'DataflowUtils', '$timeout', '$rootScope', '$state', '$cookieStore',
    function ($scope, streamService, utils, $timeout, $rootScope, $state, $cookieStore) {

      var getStreamDefinitions;

      function loadStreamDefinitions(pageable, showGrowl) {
        var streamDefinitionsPromise = streamService.getDefinitions(pageable).$promise;
        if (showGrowl || showGrowl === undefined) {
          utils.addBusyPromise(streamDefinitionsPromise);
        }
        streamDefinitionsPromise.then(
            function (result) {
              if (!!result._embedded) {
                $scope.pageable.items = result._embedded.streamDefinitionResourceList;
              }
              $scope.pageable.total = result.page.totalElements;
              getStreamDefinitions = $timeout(function() {
                loadStreamDefinitions($scope.pageable, false);
              }, $rootScope.pageRefreshTime);
              $scope.$on('$destroy', function(){
                $timeout.cancel(getStreamDefinitions);
              });
            }, function (result) {
              utils.growl.addErrorMessage(result.data[0].message);
            }
        );
      }

      var expandedState = $cookieStore.get(EXPANDED_STATE_COOKIE_KEY) || {};

      $scope.pageable = new Pageable();
      $scope.pageable.sortOrder = 'ASC';
      $scope.pageable.filterQuery = '';
      $scope.pageable.sortProperty = ['DEFINITION_NAME'];

      $scope.pagination = {
        current: 1
      };

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

      $scope.pageChanged = function(newPage) {
        $scope.pageable.pageNumber = newPage-1;
        loadStreamDefinitions($scope.pageable);
      };

      $scope.sortChanged = function(sortState) {
        console.log('sortState: ', sortState);
        loadStreamDefinitions($scope.pageable);
      };

      $scope.searchChanged = function() {
        loadStreamDefinitions($scope.pageable);
      };

      $scope.deployStream = function (streamDefinition) {
        $state.go('home.streams.deployStream', {definitionName: streamDefinition.name});
      };
      $scope.detailed = function(streamDefinition) {
        $state.go('home.streams.detailedStream', {streamName: streamDefinition.name});
      };
      $scope.undeployStream = function (streamDefinition) {
        utils.$log.info('Undeploying Stream ' + streamDefinition.name);
        utils.$log.info(streamService);
        streamService.undeploy(streamDefinition).$promise.then(
            function () {
              utils.growl.success('Undeployment Request Sent.');
            },
            function () {
              utils.growl.error('Error Undeploying Stream.');
            }
        );
      };
      $scope.clickModal = function (streamDefinition) {
        $scope.destroyItem = streamDefinition;
      };
      $scope.destroyStream = function (streamDefinition) {
        utils.$log.info('Destroying Stream ' + streamDefinition.name);
        utils.$log.info(streamService);

        streamService.destroy(streamDefinition).$promise.then(
            function () {
              utils.growl.success('Destroy Request Sent.');
              delete expandedState[streamDefinition.name];
              streamDefinition.inactive = true;
              $scope.closeModal();
            },
            function () {
              utils.growl.error('Error Destroying Stream.');
              $scope.closeModal();
            }
        );
      };

      $scope.$on('$destroy', function() {
        if (Object.keys(expandedState).length === 0) {
          $cookieStore.remove(EXPANDED_STATE_COOKIE_KEY);
        } else {
          $cookieStore.put(EXPANDED_STATE_COOKIE_KEY, expandedState);
        }
        if (getStreamDefinitions) {
          $timeout.cancel(getStreamDefinitions);
        }
      });

      loadStreamDefinitions($scope.pageable);

    }];
});
