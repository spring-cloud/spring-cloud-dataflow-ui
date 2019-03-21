/*
 * Copyright 2016-2017 the original author or authors.
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
 * Definition bulk import apps controller.
 *
 * @author Gunnar Hillert
 */
define(function () {
    'use strict';

    return ['$scope', 'AppService', 'DataflowUtils', '$modal', '$state',
        function ($scope, appService, utils, $modal, $state) {

            function newBulkAppImport() {
                return {
                    uri: '',
                    appsProperties: null,
                    force: false
                };
            }

            // Basic URI validation RegEx pattern
            $scope.uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

            /**
             * Bulk Import Apps.
             */
            $scope.bulkImportApps = function(item) {

                if (item.uri && item.appsProperties) {
                    utils.growl.error('Please provide only a URI or Properties not both.');
                    return;
                }

                if (item.uri) {
                    console.log('Importing apps from ' + item.uri + ' (force: ' + item.force + ')');
                }
                if (item.appsProperties) {
                    console.log('Importing apps using textarea values:\n' + item.appsProperties + ' (force: ' + item.force + ')');
                }

                var promise;

                promise = appService.bulkImportApps(item.uri, item.appsProperties, item.force).$promise;
                utils.addBusyPromise(promise);

                promise.then(function() {
                    utils.growl.success('Submitted bulk import request');
                    console.log(newBulkAppImport());
                    $scope.$watch('apps', function () {
                        $scope.apps.appsProperties = '';
                        $scope.apps.uri = '';
                        $scope.apps.force = false;
                    });
                });
                promise.catch(function(error) {
                    utils.growl.error(error.data[0].message);
                });
            };

            /**
             * Takes one to All Applications page
             */
            $scope.close = function() {
                $state.go('home.apps.tabs.appsList');
            };

            $scope.displayFileContents = function(contents) {
                console.log(contents);
                $scope.$watch('apps', function () {
                    $scope.apps.appsProperties = contents.split('\n');
                });
            };

            $scope.apps = newBulkAppImport();

            $scope.$apply();

        }];
});
