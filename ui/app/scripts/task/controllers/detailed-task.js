/*
 * Copyright 2017 the original author or authors.
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
 * Composed Task definition detailed graph controller
 *
 * @author Alex Boyko
 */
define(function() {
    'use strict';

    return ['DataflowUtils', '$scope', '$state', '$stateParams', 'TaskDefinitions',
        function (utils, $scope, $state, $stateParams, taskService) {

            $scope.back = function() {
                $state.go('home.tasks.tabs.definitions');
            };

            $scope.taskName = $stateParams.taskName;

            taskService.getSingleTaskDefinition($scope.taskName).success(function(task) {
                $scope.definition = {
                    text: task.dslText,
                    name: task.name
                };
                $scope.flo.updateGraphRepresentation();
            }).error(function(error) {
                utils.$log.error(error);
                utils.growl.error(error);
            });

            $scope.$apply();

        }
    ];
});
