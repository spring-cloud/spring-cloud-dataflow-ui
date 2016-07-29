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
 * Definition of all apps table page controller.
 *
 * @author Alex Boyko
 * @author Gunnar Hillert
 */
define(['model/pageable'], function (Pageable) {
    'use strict';
    return ['$scope', 'AppService', 'DataflowUtils', '$modal', '$state',
        function ($scope, appService, utils, $modal, $state) {

            /**
             * Loads applications/apps
             *
             * @param pageable Paging model object. Undefined or null if paging is off
             * @param showGrowl Show loading message while data is fetched
             */
            function loadAppDefinitions(pageable, showGrowl) {
                // Loading apps now. Switch off the timer if it's available
                if ($scope.getAppDefinitions) {
                    utils.$timeout.cancel($scope.getAppDefinitions);
                }
                var appDefinitionsPromise = appService.getDefinitions(pageable).$promise;
                // Show loading message in the UI if option is on
                if (showGrowl || showGrowl === undefined) {
                    utils.addBusyPromise(appDefinitionsPromise);
                }
                appDefinitionsPromise.then(
                    function (result) {
                        if (!!result._embedded) {
                            $scope.pageable.items = result._embedded.appRegistrationResourceList;
                        }
                        // Process received array of apps
                        if (Array.isArray($scope.pageable.items)) {
                            $scope.pageable.items.forEach(function(item) {

                                // Create id for tracking apps with ng-repeat directive
                                item.id = item.name + '.' + item.type;

                                // Define function for selecting an app in the table
                                item.select = function(newValue) {
                                    if (arguments.length) {
                                        if (newValue) {
                                            $scope.selected[this.id] = this;
                                        } else {
                                            delete $scope.selected[this.id];
                                        }
                                    } else {
                                        return $scope.selected[this.id] ? true : false;
                                    }
                                };

                                // Define function for removing app controller
                                item.remove = function(index) {
                                    this.select(false);
                                    if (typeof index !== 'number' || index < 0 || index >= $scope.pageable.items.length) {
                                        index = $scope.pageable.items.indexOf(this);
                                    }
                                    if (index >= 0) {
                                        $scope.pageable.items.splice(index, 1);
                                    }
                                };

                                // Define function for obtaining properties of a app
                                item.getProperties = function() {
                                    return appService.getAppInfo(this.type, this.name);
                                };

                            });
                        }
                        var p;
                        if (pageable) {
                            $scope.pageable.total = result.page.totalElements;
                            p = $scope.pageable;
                        } else {
                            // Remove the else block when paging restored.
                            if ($scope.pageable.items) {
                                $scope.pageable.total = $scope.pageable.items.length;
                            }
                            else {
                                $scope.pageable.total = 0;
                            }
                            $scope.pageable.pageSize = $scope.pageable.total;
                            $scope.pageNumber = 0;
                        }
                        // Poll apps after a period of time to refresh
                        $scope.getAppDefinitions = utils.$timeout(function() {
                            loadAppDefinitions(p, false);
                        }, utils.$rootScope.pageRefreshTime);
                    }, function (result) {
                        utils.growl.error(result.data[0].message);
                    }
                );
            }

            // Selected apps map
            $scope.selected = {};

            // Paging model object
            $scope.pageable = new Pageable();

            // Initial page number
            $scope.pagination = {
                current: 1
            };

            /**
             * Select all apps
             */
            $scope.selectAll = function() {
                if ($scope.pageable.items && $scope.pageable.items.length > 0) {
                    $scope.pageable.items.forEach(function(item) {
                        $scope.selected[item.id] = item;
                    });
                }
            };

            /**
             * Unselect all apps
             */
            $scope.unselectAll = function() {
                $scope.selected = {};
            };

            /**
             * Returns true if some apps are selected but not all
             * @returns {boolean}
             */
            $scope.isSomeButNotAllSelected = function() {
                var numSelected = Object.keys($scope.selected).length;
                var numTotal = $scope.pageable.items ? $scope.pageable.items.length : 0;
                return numTotal > 0 && numSelected > 0 && numSelected < numTotal;
            };

            /**
             * Returns true if no apps selected
             * @returns {boolean}
             */
            $scope.isNoneSelected = function() {
                return Object.keys($scope.selected).length === 0;
            };

            /**
             * Angular ng-model compliant getter/setter for 'select all'
             * @param select True for select all, false for unselect all
             * @returns {*|boolean} Returns true for all selected or false for all not selectd if no parameters passed
             */
            $scope.toggleSelectAll = function(select) {
                if (arguments.length) {
                    if (select) {
                        $scope.selectAll();
                    } else {
                        $scope.unselectAll();
                    }
                } else {
                    return $scope.pageable.items && Object.keys($scope.selected).length === $scope.pageable.items.length;
                }
            };

            /**
             * Swicthes to specified page. (Applicable if paging is on)
             * @param newPage Page number
             */
            $scope.pageChanged = function(newPage) {
                $scope.pageable.pageNumber = newPage-1;
                loadAppDefinitions(/*$scope.pageable*/);
            };

            /**
             * Unregisters app
             * @param item App object
             * @param index App index in the array of items
             */
            $scope.unregister = function(item, index) {
                // Pop up confirmation dialog
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/app/dialogs/unregister-single-app.html',
                    controller: ['$scope', '$modalInstance', 'item',
                        function ($scope, $modalInstance, item) {

                            $scope.item = item;

                            $scope.proceed = function() {
                                $modalInstance.close();
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                        }],
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                }).result.then(function() {
                    // Fire off the request to unregister app
                    appService.unregisterApp(item.type, item.name).$promise.then(function() {
                        utils.growl.success('Successfully removed app "' + item.name + '" of type "' + item.type + '"');
                        // Remove from the list of apps if unregistered successfully
                        if (typeof index === 'number' && index >= 0) {
                            $scope.pageable.items[index].remove(index);
                        }
                    }, function(error) {
                        utils.growl.error(error.data[0].message);
                    });
                });

            };

            /**
             * Unregister selected apps
             */
            $scope.unregisterSelectedApps = function() {
                var apps = [];
                // Collect selected apps in a list
                Object.keys($scope.selected).forEach(function(id) {
                    apps.push($scope.selected[id]);
                });
                // Pop up confirmation dialog listing apps to be unregistered
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/app/dialogs/unregister-apps.html',
                    controller: ['$scope', '$modalInstance', 'items',
                        function ($scope, $modalInstance, items) {

                            $scope.items = items;

                            $scope.proceed = function() {
                                $modalInstance.close();
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                        }],
                    resolve: {
                        items: function () {
                            return apps;
                        }
                    }
                }).result.then(function() {
                    var promises = [];
                    var p;
                    // Fire off unregister request for each app
                    apps.forEach(function(app) {
                        p = appService.unregisterApp(app.type, app.name).$promise;
                        promises.push(p);
                        p.then(function() {
                            // Remove the app.
                            app.remove();
                        });
                        // Show errors per apps registration rather then one general message
                        p.catch(function(error) {
                            utils.growl.error(error.data[0].message);
                        });
                    });
                    utils.$q.all(promises).then(function() {
                        utils.growl.success('Successfully unregistered selected applications');
                    });
                });
            };

            /**
             * Show app info
             * @param item App
             */
            $scope.info = function(item) {
                // Pop dialog listing app name, type, description and table of properties
                $modal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'scripts/app/dialogs/app-info.html',
                    controller: ['$scope', 'DataflowUtils', '$modalInstance', 'item',
                        function ($scope, utils, $modalInstance, item) {

                            $scope.name = item.name;
                            $scope.type = item.type;

                            var infoPromise = item.getProperties();

                            utils.addBusyPromise(infoPromise);

                            infoPromise.then(function (result) {
                                $scope.data = result.data;
                            }, function (error) {
                                utils.growl.error(error.data[0].message);
                            });

                            $scope.close = function () {
                                $modalInstance.close();
                            };

                        }],
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
            };

            /**
             * Takes one to app registration page
             */
            $scope.registerApps = function() {
                $state.go('home.apps.registerApps');
            };

            /**
             * Takes one to bulk import app page
             */
            $scope.bulkImportApps = function() {
                $state.go('home.apps.bulkImportApps');
            };

            $scope.$on('$destroy', function(){
                if ($scope.getAppDefinitions) {
                    utils.$timeout.cancel($scope.getAppDefinitions);
                }
            });

            loadAppDefinitions(null/*$scope.pageable*/, true);
        }];
});
