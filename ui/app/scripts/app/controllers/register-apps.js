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
    return ['$scope', 'AppService', 'XDUtils', '$modal', '$state',
        function ($scope, appService, utils, $modal, $state) {

            /**
             * Creates a controller entry for a new app
             * @returns {{name: string, type: (*|string), force: boolean, uri: string}}
             */
            function newApp() {
                return {
                    name: '',
                    type: $scope.types[0],
                    force: false,
                    uri: '',
                };
            }

            // App name validation RegEx pattern
            $scope.namePattern = '[\\w_]+[\\w_-]*';

            // Basic URI validation RegEx pattern
            $scope.uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

            // App types
            $scope.types = ['source', 'processor', 'sink', 'task'];

            /**
             * Register apps.
             */
            $scope.register = function() {
                var promises = [], promise, index;
                // Array of apps will have registered apps removed as promises are resolved,
                // hence create 'success' message now based on the initial data
                var successMsg = 'Successfully registered ' + ($scope.apps.length === 1 ? 'application "' + $scope.apps[0].name + '" of type "' + $scope.apps[0].type + '"' : $scope.apps.length + ' applications.');
                // Fire off a registration request for each app
                $scope.apps.forEach(function(app) {
                    promise = appService.registerApp(app.type, app.name, app.uri, app.force).$promise;
                    promise.then(function() {
                        // Need to find app index because index might have been changed by the time promise is resolved due to other removals
                        index = $scope.apps.indexOf(app);
                        if (index >= 0) {
                            $scope.apps.splice(index, 1);
                        } else {
                            utils.$log('Cannot find app in the lis of apps!');
                        }
                    });
                    promise.catch(function(error) {
                        utils.growl.error(error.data[0].message);
                    });
                    promises.push(promise);
                });
                // Error messages are shown per failed app registration promise
                utils.$q.all(promises).then(function() {
                    utils.growl.success(successMsg);
                    $scope.close();
                });
            };

            /**
             * Takes one to All Applications page
             */
            $scope.close = function() {
                $state.go('home.apps.tabs.appsList');
            };

            /**
             * Removes app comntroller entry
             * @param index Index of the entry
             */
            $scope.removeApp = function(index) {
                $scope.apps.splice(index, 1);
            };

            /**
             * Adds app controller entry at the specified index
             * @param index Insertion index
             */
            $scope.addApp = function(index) {
                $scope.apps.splice(index + 1, 0, newApp());
            };

            /**
             * Angular ng-model compliant 'getter/setter' model for 'force all'
             * @param force Force flag for app registration. Overwrites exisitng app if necessary
             * @returns {boolean}
             */
            $scope.toggleAllForce = function(force) {
                if (arguments.length) {
                    // Setter mode
                    $scope.apps.forEach(function(app) {
                       app.force = force;
                    });
                } else {
                    // Getter mode
                    for (var i = 0; i < $scope.apps.length; i++) {
                        if (!$scope.apps[i].force) {
                            return false;
                        }
                    }
                    return true;
                }
            };

            /**
             * Returns true if some apps have force flag but not all of them.
             * @returns {boolean}
             */
            $scope.someForceButNotAll = function() {
                var numForce = 0;
                for (var i = 0; i < $scope.apps.length; i++) {
                    if ($scope.apps[i].force) {
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

            $scope.apps = [ newApp() ];

            $scope.$apply();

        }];
});
