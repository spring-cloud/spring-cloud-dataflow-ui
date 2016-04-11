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
 */
define(['model/pageable'], function (Pageable) {
    'use strict';
    return ['$scope', 'ModuleService', 'XDUtils', '$modal', '$state',
        function ($scope, moduleService, utils, $modal, $state) {

            /**
             * Loads applications/modules
             *
             * @param pageable Paging model object. Undefined or null if paging is off
             * @param showGrowl Show loading message while data is fetched
             */
            function loadModuleDefinitions(pageable, showGrowl) {
                // Loading modules now. Switch off the timer if it's available
                if ($scope.getModuleDefinitions) {
                    utils.$timeout.cancel($scope.getModuleDefinitions);
                }
                var moduleDefinitionsPromise = moduleService.getDefinitions(pageable).$promise;
                // Show loading message in the UI if option is on
                if (showGrowl || showGrowl === undefined) {
                    utils.addBusyPromise(moduleDefinitionsPromise);
                }
                moduleDefinitionsPromise.then(
                    function (result) {
                        if (!!result._embedded) {
                            $scope.pageable.items = result._embedded.moduleRegistrationResourceList;
                        }
                        // Process received array of modules
                        if (Array.isArray($scope.pageable.items)) {
                            $scope.pageable.items.forEach(function(item) {

                                // Create id for tracking modules with ng-repeat directive
                                item.id = item.name + '.' + item.type;

                                // Define function for selecting a module in the table
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

                                // Define function for removing module controller
                                item.remove = function(index) {
                                    this.select(false);
                                    if (typeof index !== 'number' || index < 0 || index >= $scope.pageable.items.length) {
                                        index = $scope.pageable.items.indexOf(this);
                                    }
                                    if (index >= 0) {
                                        $scope.pageable.items.splice(index, 1);
                                    }
                                };

                                // Define function for obtaining properties of a module
                                item.getProperties = function() {
                                    return moduleService.getModuleInfo(this.type, this.name);
                                };

                            });
                        }
                        var p;
                        if (pageable) {
                            $scope.pageable.total = result.page.totalElements;
                            p = $scope.pageable;
                        } else {
                            // Remove the else block when paging restored.
                            $scope.pageable.total = $scope.pageable.items.length;
                            $scope.pageable.pageSize = $scope.pageable.total;
                            $scope.pageNumber = 0;
                        }
                        // Poll modules after a period of time to refresh
                        $scope.getModuleDefinitions = utils.$timeout(function() {
                            loadModuleDefinitions(p, false);
                        }, utils.$rootScope.pageRefreshTime);
                    }, function (result) {
                        utils.growl.error(result.data[0].message);
                    }
                );
            }

            // Selected modules map
            $scope.selected = {};

            // Paging model object
            $scope.pageable = new Pageable();

            // Initial page number
            $scope.pagination = {
                current: 1
            };

            /**
             * Select all modules
             */
            $scope.selectAll = function() {
                $scope.pageable.items.forEach(function(item) {
                    $scope.selected[item.id] = item;
                });
            };

            /**
             * Unselect all modules
             */
            $scope.unselectAll = function() {
                $scope.selected = {};
            };

            /**
             * Returns true if some modules are selected but not all
             * @returns {boolean}
             */
            $scope.isSomeButNotAllSelected = function() {
                var numSelected = Object.keys($scope.selected).length;
                var numTotal = $scope.pageable.items ? $scope.pageable.items.length : 0;
                return numTotal > 0 && numSelected > 0 && numSelected < numTotal;
            };

            /**
             * Returns true if no modules selected
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
                loadModuleDefinitions(/*$scope.pageable*/);
            };

            /**
             * Unregisters module
             * @param item Module object
             * @param index Module index in the array of items
             */
            $scope.unregister = function(item, index) {
                // Pop up confirmation dialog
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/app/dialogs/unregister-single-module.html',
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
                    // Fire off the request to unregister module
                    moduleService.unregisterModule(item.type, item.name).$promise.then(function() {
                        utils.growl.success('Successfully removed module "' + item.name + '" of type "' + item.type + '"');
                        // Remove from the list of modules if unregistered successfully
                        if (typeof index === 'number' && index >= 0) {
                            $scope.pageable.items[index].remove(index);
                        }
                    }, function(error) {
                        utils.growl.error(error.data[0].message);
                    });
                });

            };

            /**
             * Unregister selected modules
             */
            $scope.unregisterSelectedModules = function() {
                var modules = [];
                // Collect selected modules in a list
                Object.keys($scope.selected).forEach(function(id) {
                    modules.push($scope.selected[id]);
                });
                // Pop up confirmation dialog listing modules to be unregistered
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/app/dialogs/unregister-modules.html',
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
                            return modules;
                        }
                    }
                }).result.then(function() {
                    var promises = [];
                    var p;
                    // Fire off unregister request for each module
                    modules.forEach(function(module) {
                        p = moduleService.unregisterModule(module.type, module.name).$promise;
                        promises.push(p);
                        p.then(function() {
                            // Remove the module.
                            module.remove();
                        });
                        // Show errors per modules registration rather then one general message
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
             * Show module info
             * @param item Module
             */
            $scope.info = function(item) {
                // Pop dialog listing module name, type, description and table of properties
                $modal.open({
                    animation: true,
                    size: 'lg',
                    templateUrl: 'scripts/app/dialogs/module-info.html',
                    controller: ['$scope', 'XDUtils', '$modalInstance', 'item',
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
             * Takes one to module registration page
             */
            $scope.registerModules = function() {
                $state.go('home.apps.registerModules');
            };

            $scope.$on('$destroy', function(){
                if ($scope.getModuleDefinitions) {
                    utils.$timeout.cancel($scope.getModuleDefinitions);
                }
            });

            loadModuleDefinitions(null/*$scope.pageable*/, true);
        }];
});
