/*
 * Copyright 2016-2017 the original author or authors.
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
 * Definition bulk import apps controller.
 *
 * @author Gunnar Hillert
 */
define(function () {
    'use strict';

    var STREAM_APP_STARTERS_VERSION_SUFFIX = 'Avogadro-SR1-';
    var TASK_APP_STARTERS_VERSION_SUFFIX = 'Addison-GA-';

    return ['$scope', 'AppService', 'DataflowUtils', '$modal', '$state',
        function ($scope, appService, utils, $modal, $state) {

            function newBulkAppImport() {
                return {
                    uri: '',
                    appsProperties: null,
                    force: false
                };
            }

            function newStreamAppStarters() {
                return [
                    {
                        name: 'Maven based Stream Applications with RabbitMQ Binder',
                        uri:  'http://bit.ly/' + STREAM_APP_STARTERS_VERSION_SUFFIX + 'stream-applications-rabbit-maven',
                        force: false
                    },
                    {
                        name: 'Maven based Stream Applications with Kafka Binder',
                        uri:  'http://bit.ly/' + STREAM_APP_STARTERS_VERSION_SUFFIX + 'stream-applications-kafka-10-maven',
                        force: false
                    },
                    {
                        name: 'Docker based Stream Applications with RabbitMQ Binder',
                        uri:  'http://bit.ly/' + STREAM_APP_STARTERS_VERSION_SUFFIX + 'stream-applications-rabbit-docker',
                        force: false
                    },
                    {
                        name: 'Docker based Stream Applications with Kafka Binder',
                        uri:  'http://bit.ly/' + STREAM_APP_STARTERS_VERSION_SUFFIX + 'stream-applications-kafka-10-docker',
                        force: false
                    }
                ];
            }

            function newTaskAppStarters() {
                return [
                    {
                        name: 'Maven based Task Applications',
                        uri:  'http://bit.ly/' + TASK_APP_STARTERS_VERSION_SUFFIX + 'task-applications-maven',
                        force: false
                    },
                    {
                        name: 'Docker based Task Applications',
                        uri:  'http://bit.ly/' + TASK_APP_STARTERS_VERSION_SUFFIX + 'task-applications-docker',
                        force: false
                    }
                ];
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
                    $scope.streamAppStarters = newStreamAppStarters();
                    $scope.taskAppStarters   = newTaskAppStarters();
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
            $scope.streamAppStarters = newStreamAppStarters();
            $scope.taskAppStarters   = newTaskAppStarters();

            $scope.$apply();

        }];
});
