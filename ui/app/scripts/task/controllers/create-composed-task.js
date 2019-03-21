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
 * Definition of the Composed Task Creation controller
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define([/*'editor-manager'*/], function () {
    'use strict';

    var GRID_ON_COOKIE_KEY = 'createComposedJob.grid.on';

    return ['DataflowUtils', '$scope', '$cookieStore', '$modal', 'ComposedTasksMetamodelService',
        function (utils, $scope, $cookieStore, $modal, metamodelService) {
            utils.$log.info('Stream Creation Controller running (create.js)');

            var collapsed = true;

            $scope.definition = {
                name: '',
                text: ''
            };

            if (!$scope.flo) {
                $scope.flo = {};
            }

            // Refresh meta-model to load new job defs that might have been created
            metamodelService.load(true);

            $scope.gridOn = function(newValue) {
                if (arguments.length) {
                    if (newValue) {
                        $scope.flo.gridSize(25);
                    } else {
                        $scope.flo.gridSize(1);
                    }
                } else {
                    return $scope.flo.gridSize() > 1;
                }
            };

            $scope.toggleCollapsed = function() {
                $scope.isCollapsed(!$scope.isCollapsed());
            };

            $scope.isCollapsed = function(newValue) {
                if (arguments.length) {
                    if (newValue) {
                        $scope.flo.enableSyncing(false);
                    } else {
                        $scope.flo.updateTextRepresentation();
                        $scope.flo.enableSyncing(true);
                    }
                    collapsed = newValue;
                } else {
                    return collapsed;
                }
            };

            $scope.createComposedJob = function() {
                utils.$log.debug('Create Composed Task');
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/task/dialogs/create-composed-task-dialog.html',
                    controller: 'CreateComposedTaskDialogController',
                    resolve: {
                        textDefinition: function () {
                            return $scope.isCollapsed ? $scope.flo.updateTextRepresentation() : $scope.definition.text;
                        }
                    }
                }).result.then(function(created) {
                    if (created) {
                        metamodelService.refresh();
                        $scope.flo.clearGraph();
                    }
                });
            };

            $scope.$on('$destroy', function() {
                if ($scope.gridOn()) {
                    $cookieStore.put(GRID_ON_COOKIE_KEY, true);
                } else {
                    $cookieStore.remove(GRID_ON_COOKIE_KEY);
                }
            });

            try {
                $scope.gridOn($cookieStore.get(GRID_ON_COOKIE_KEY));
            } catch (error) {
                $scope.gridOn(false);
            }

            $scope.isCollapsed(true);

        }];
});
