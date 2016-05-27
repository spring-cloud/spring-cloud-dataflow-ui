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
 * Create a Task Definition from an Application.
 *
 * @author Gunnar Hillert
 */
define([], function () {
  'use strict';
  return ['$scope', 'TaskAppService', 'XDUtils', '$state', '$stateParams',
    function ($scope, taskAppService, utils, $state, $stateParams) {
      $scope.$apply(function () {

        $scope.appName = $stateParams.appName;

        var singleAppPromise = taskAppService.getSingleApp($stateParams.appName).$promise;
        utils.addBusyPromise(singleAppPromise);
          function escapeStringIfNecessary(name, value) {
              if (value && /\s/g.test(value)) {
                  return '"' + value + '"';
              }
              else if (name === 'password' || name === 'passwd') {
                  return '"' + value + '"';
              }
              else {
                  return value;
              }
          }
          function calculateDefinition(taskDefinition) {
              var arrayLength = taskDefinition.parameters.length;
              $scope.calculatedDefinition = $scope.appDetails.name;
              for (var i = 0; i < arrayLength; i++) {
                  var parameter = taskDefinition.parameters[i];

                  if (parameter.value && parameter.valueInclude === 'true') {
                      var parameterValueToUse = escapeStringIfNecessary(parameter.id, parameter.value);
                      $scope.calculatedDefinition = $scope.calculatedDefinition + ' --' + parameter.id + '=' + parameterValueToUse;
                  }
              }
          }

          singleAppPromise.then(
            function (result) {
                $scope.taskDefinition = {
                  name: '',
                  parameters: []
                };
                var arrayLength = result.options.length;
                for (var i = 0; i < arrayLength; i++) {
                  var option = result.options[i];
                  var optionValue = option.defaultValue ? option.defaultValue : '';

                  $scope.taskDefinition.parameters.push({
                    name: option.name,
                    id: option.id,
                    value: optionValue,
                    type: option.type,
                    description: option.description
                  });
                }
                $scope.appDetails = result;
              }, function () {
                utils.growl.error('Error fetching data. Is the XD server running?');
              });
        $scope.closeCreateDefinition = function () {
            utils.$log.info('Closing Task Definition Creation Window');
            $state.go('home.tasks.tabs.appsList');
          };
        $scope.submitTaskDefinition = function () {
            utils.$log.info('Submitting Definition');
            calculateDefinition($scope.taskDefinition);
            var createDefinitionPromise = taskAppService.createDefinition(
                    $scope.taskDefinition.name, $scope.calculatedDefinition).$promise;
            utils.addBusyPromise(createDefinitionPromise);
            createDefinitionPromise.then(
                    function () {
                      utils.growl.success('The Definition was created.');
                      $state.go('home.tasks.tabs.appsList');
                    }, function (error) {
                      utils.growl.error(error.data[0].message);
                    });
          };
        $scope.$watch('taskDefinition', function() {
          if ($scope.taskDefinition) {
            calculateDefinition($scope.taskDefinition);
          }
        }, true);

      });
    }];
});
