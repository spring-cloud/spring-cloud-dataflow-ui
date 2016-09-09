/*
 * Copyright 2015-2016 the original author or authors.
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
 * Definition of the Stream Creation dialog controller
 *
 * @author Alex Boyko
 */
define(function(require) {
    'use strict';

    var angular = require('angular');

    var PROGRESS_BAR_WAIT_TIME = 600; // to account for animation delay

    return ['DataflowUtils', '$scope', 'StreamService', '$modalInstance', 'definitionData', 'StreamMetamodelService', 'StreamParserService',
        function (utils, $scope, streamService, $modalInstance, definitionData, metaModelService, ParserService) {

            function waitForStreamDef(streamDefNameToWaitFor, attemptCount) {
                var deferred = utils.$q.defer();
                if (attemptCount === 10) {
                    utils.$log.info('Aborting after 10 attempts, cannot find the stream: '+streamDefNameToWaitFor);
                    deferred.resolve();
                }
                streamService.getSingleStreamDefinition(streamDefNameToWaitFor).success(function() {
                    utils.$log.info('Stream '+streamDefNameToWaitFor+' is ok!');
                    deferred.resolve();
                }).error(function() {
                    utils.$log.info('Stream '+streamDefNameToWaitFor+' is not there yet (attempt=#'+attemptCount+')');
                    utils.$timeout(function() {
                        $scope.waitForStreamDef(streamDefNameToWaitFor, attemptCount+1).then(function() {
                            deferred.resolve();
                        });
                    },400);
                });
                return deferred.promise;
            }

            $scope.streamdefs = [];
            $scope.errors = [];
            $scope.warnings = [];

            //$scope.deploy = $cookieStore.get(DEPLOY_FLAG_COOKIE_KEY);

            if (definitionData.text && definitionData.text.length > 0) {
    			var data = ParserService.parse(definitionData.text);
    			var graphAndErrors = metaModelService.convertParseResponseToGraph(definitionData.text, data);
                if (graphAndErrors.graph) {
//                        data = angular.fromJson(data);
                    $scope.streamdefs = graphAndErrors.graph.streamdefs;

                    $scope.streamdefs.forEach(function(def, index) {
                        if (definitionData.dependencies[index] && Array.isArray(definitionData.dependencies[index]) &&
                            definitionData.dependencies[index].length) {
                            $scope.$watch(function() {
                                return $scope.streamdefs[index].name;
                            }, function(newValue, oldValue) {
                                definitionData.dependencies[index].forEach(function(i) {
                                    var depDef = $scope.streamdefs[i].def;
                                    $scope.streamdefs[i].def = depDef.replace(':' + oldValue + '.', ':' + newValue + '.');
                                });
                            });
                        }
                    });

                    if (angular.isFunction($scope.focusInvalidField)) {
                        // Need to be timed to let angular compile the DOM node for these changes.
                        // HACK, but couldn't find anything better for this to work
                        utils.$timeout($scope.focusInvalidField, 300);
                    }
                }
                if (graphAndErrors.errors) {
                    graphAndErrors.errors.forEach(function(error) {
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

            $scope.canSubmit = function() {
                return !$scope.isStreamCreationInProgress() && $scope.streamForm.$valid && $scope.streamdefs && $scope.streamdefs.length && !($scope.errors && $scope.errors.length);
            };

            $scope.submitStreams = function() {
                if ($scope.canSubmit()) {
                    // Find index of the first not yet created stream
                    // Can't use Array#findIndex(...) because not all browsers support it
                    var index = 0;
                    for (; index < $scope.streamdefs.length && $scope.streamdefs[index].created; index++) {
                        // nothing to do - just loop to the not created stream def
                    }
                    // Setup progress bar data
                    $scope.createProgressData(($scope.streamdefs.length - index) * 2 - 1); // create, wait for each - wait for the last
                    // Start stream(s) creation
                    $scope.createStreams(index);
                }
            };

            $scope.createProgressData = function(total, count) {
                $scope.progressData = {
                    count: count ? count : 0,
                    total: total,
                    getPercent: function() {
                        return Math.round(this.count / this.total * 100);
                    }
                };
            };

            /**
             * Function creating streams based on the info in scopes flo.streamdefs contents.
             *
             * After calling the REST API to create a stream, it doesn't mean it is fully defined yet. So this createStreams()
             * function can be passed a stream name that it should wait on before continuing. This ensures that if a later
             * stream depends on an earlier stream, everything works.
             */
            $scope.createStreams = function(index) {
                if (index < 0 || index >= $scope.streamdefs.length) {
                    // Invalid index means all streams have been created, close the dialog.
                    $modalInstance.close(true);
                } else {
                    // Send the request to create a stream
                    var def = $scope.streamdefs[index];
                    streamService.create(def.name, def.def, $scope.deploy).success(function () {
                        utils.$log.info('Stream ' + def.name + ' created OK');
                        // Stream created successfully, mark it as created
                        def.created = true;
                        $scope.createProgressData($scope.progressData.total, $scope.progressData.count + 1);
                        if ($scope.streamdefs.length - 1 === index) {
                            // Last stream created, close the dialog
                            // Delay closing the dialog thus progress bar 100% would stay up for a short a bit
                            utils.$timeout(function() {
                                $modalInstance.close(true);
                                utils.growl.success('Stream(s) have been created successfully');
                            }, PROGRESS_BAR_WAIT_TIME);
                        } else {
                            // There are more streams to create, so create the next one
                            waitForStreamDef(def.name, 0).then(function () {
                                $scope.createProgressData($scope.progressData.total, $scope.progressData.count + 1);
                                $scope.createStreams(index + 1);
                            }, function() {
                                // Error handling
                                // Previous stream creation request was issues but the stream resource is still unavailable for some reason
                                // Never mind and keep creating the rest of the streams?
                                $scope.createProgressData($scope.progressData.total, $scope.progressData.count + 1);
                                $scope.createStreams(index + 1);
                            });
                        }
                    }).error(function (error) {
                        // Delay hiding the progress bar thus user can see it if operation went too fast
                        utils.$timeout(function() {
                            $scope.progressData = undefined;
                        }, PROGRESS_BAR_WAIT_TIME);
                        for (var e = 0; e < error.length; e++) {
                            utils.growl.error('Problem creating stream: ' + def.name + ':' + error[e].message);
                        }
                        utils.$log.error('Failed to create stream ' + JSON.stringify(def));
                    });
                }
            };

            $scope.getProgressPercent = function() {
                if ($scope.progressData) {
                    return $scope.progressData.getPercent();
                }
            };

            $scope.isStreamCreationInProgress = function() {
                return $scope.progressData;
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

        }];
});
