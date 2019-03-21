/*
 * Copyright 2017 the original author or authors.
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
 * Definition of the Composed Task Creation dialog controller
 *
 * @author Alex Boyko
 */
define([], function () {
    'use strict';

    return ['DataflowUtils', '$scope', '$timeout', 'ComposedTasksMetamodelService', 'TaskDefinitionService', '$modalInstance', 'textDefinition',
        function (utils, $scope, $timeout, metaModelService, taskDefinitionService, $modalInstance, textDefinition) {

            function processErrors(errors) {
                if (errors && Array.isArray(errors)) {
                    errors.forEach(function(error) {
                        if (typeof error === 'string') {
                            $scope.errors.push(error);
                        } else if (typeof error.message === 'string') {
                            $scope.errors.push(error.message);
                        } else {
                            $scope.errors.push(JSON.stringify(error));
                        }
                    });
                }
            }

            $scope.errors = [];
            $scope.warnings = [];
            $scope.launch = true;

            if (textDefinition && textDefinition.length > 0) {
                $scope.textDefinition = textDefinition;
                metaModelService.parseAndRefreshGraph(textDefinition, null, function(errors) {
                    processErrors(errors);
                    if ($scope.focusInvalidField && $scope.focusInvalidField.call) {
                        // Need to be timed to let angular compile the DOM node for these changes.
                        // HACK, but couldn't find anything better for this to work
                        $timeout($scope.focusInvalidField);
                    }
                });
            } else {
                $scope.errors.push('Malformed Graph detected, failed to generate DSL definition.');
            }

            $scope.canSubmit = function() {
                return $scope.createComposedJobForm.$valid && $scope.name && $scope.textDefinition && !$scope.createComposedJobForm.$error.required && !($scope.errors && $scope.errors.length);
            };

            $scope.submitComposedJob = function() {
                if ($scope.canSubmit()) {
                    $scope.createComposedJob();
                }
            };

            $scope.createComposedTask = function() {
                taskDefinitionService.createDefinition($scope.name, $scope.textDefinition, $scope.launch).$promise.then(function() {
                    utils.$log.info('Created composed task ' + $scope.name + ' = ' + $scope.textDefinition);
                    utils.growl.success('Composed Task created: '+ $scope.name);
                    $modalInstance.close(true);
                }, function(error) {
                    if (error.data && Array.isArray(error.data)) {
                        for (var e=0;e<error.data.length;e++) {
                            utils.growl.error('Problem creating Composed Task: '+$scope.name+':'+error.data[e].message);
                        }
                    } else {
                        utils.growl.error('Problem creating Composed Task: ' + $scope.name);
                    }
                    utils.$log.error('Failed to create composed task ' + $scope.name + ' = ' + $scope.textDefinition);
                });
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

        }];
});
