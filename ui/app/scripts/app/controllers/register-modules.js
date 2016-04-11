/*
 * Copyright 2016 the original author or authors.
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
 * Definition apps registration page controller.
 *
 * @author Alex Boyko
 */
define(function () {
    'use strict';
    return ['$scope', 'ModuleService', 'XDUtils', '$modal', '$state',
        function ($scope, moduleService, utils, $modal, $state) {

            /**
             * Creates a controller entry for a new module
             * @returns {{name: string, type: (*|string), force: boolean, uri: string}}
             */
            function newModule() {
                return {
                    name: '',
                    type: $scope.types[0],
                    force: false,
                    uri: '',
                };
            }

            // Module name validation RegEx pattern
            $scope.namePattern = '[\\w_]+[\\w_-]*';

            // Basic URI validation RegEx pattern
            $scope.uriPattern = '^((https?:\/\/)|(maven:\/\/)|(docker:\/\/)|(file:\/\/))([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

            // Module types
            $scope.types = ['source', 'processor', 'sink', 'task', 'library'];

            /**
             * Register modules.
             */
            $scope.register = function() {
                var promises = [], promise, index;
                // Array of modules will have registered modules removed as promises are resolved,
                // hence create 'success' message now based on the initial data
                var successMsg = 'Successfully registered ' + ($scope.modules.length === 1 ? 'application "' + $scope.modules[0].name + '" of type "' + $scope.modules[0].type + '"' : $scope.modules.length + ' applications.');
                // Fire off a registration request for each module
                $scope.modules.forEach(function(module) {
                    promise = moduleService.registerModule(module.type, module.name, module.uri, module.force).$promise;
                    promise.then(function() {
                        // Need to find module index because index might have been changed by the time promise is resolved due to other removals
                        index = $scope.modules.indexOf(module);
                        if (index >= 0) {
                            $scope.modules.splice(index, 1);
                        } else {
                            utils.$log('Cannot find module in the lis of modules!');
                        }
                    });
                    promise.catch(function(error) {
                        utils.growl.error(error.data[0].message);
                    });
                    promises.push(promise);
                });
                // Error messages are shown per failed module registration promise
                utils.$q.all(promises).then(function() {
                    utils.growl.success(successMsg);
                    $scope.close();
                });
            };

            /**
             * Takes one to All Applications page
             */
            $scope.close = function() {
                $state.go('home.apps.tabs.modules');
            };

            /**
             * Removes module comntroller entry
             * @param index Index of the entry
             */
            $scope.removeModule = function(index) {
                $scope.modules.splice(index, 1);
            };

            /**
             * Adds module controller entry at the specified index
             * @param index Insertion index
             */
            $scope.addModule = function(index) {
                $scope.modules.splice(index + 1, 0, newModule());
            };

            /**
             * Angular ng-model compliant 'getter/setter' model for 'force all'
             * @param force Force flag for module registration. Overwrites exisitng module if necessary
             * @returns {boolean}
             */
            $scope.toggleAllForce = function(force) {
                if (arguments.length) {
                    // Setter mode
                    $scope.modules.forEach(function(module) {
                       module.force = force;
                    });
                } else {
                    // Getter mode
                    for (var i = 0; i < $scope.modules.length; i++) {
                        if (!$scope.modules[i].force) {
                            return false;
                        }
                    }
                    return true;
                }
            };

            /**
             * Returns true if some modules have force flag but not all of them.
             * @returns {boolean}
             */
            $scope.someForceButNotAll = function() {
                var numForce = 0;
                for (var i = 0; i < $scope.modules.length; i++) {
                    if ($scope.modules[i].force) {
                        if (numForce !== i) {
                            return true;
                        } else {
                            numForce++;
                        }
                    } else {
                        if (numForce > 0) {
                            return true;
                        }
                    }
                }
                return false;
            };

            $scope.modules = [ newModule() ];

            $scope.$apply();

        }];
});
