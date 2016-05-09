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

    return ['XDUtils', '$scope', 'StreamService', '$modalInstance', 'definitionData', 'StreamMetamodelServiceXD', 'ParserService',
        function (utils, $scope, streamService, $modalInstance, definitionData, metaModelService, ParserService) {

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
                    if (angular.isFunction($scope.focusInvalidField)) {
                        // Need to be timed to let angular compile the DOM node for these changes.
                        // HACK, but couldn't find anything better for this to work
                        utils.$timeout($scope.focusInvalidField);
                    }

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
                return $scope.streamForm.$valid && !$scope.streamForm.$error.required && $scope.streamdefs && $scope.streamdefs.length && !($scope.errors && $scope.errors.length);
            };

            $scope.submitStreams = function() {
                if ($scope.canSubmit()) {
                    $scope.createStreams();
                }
            };

            /**
             * Function creating streams based on the info in scopes flo.streamdefs contents.
             *
             * After calling the REST API to create a stream, it doesn't mean it is fully defined yet. So this createStreams()
             * function can be passed a stream name that it should wait on before continuing. This ensures that if a later
             * stream depends on an earlier stream, everything works.
             */
            $scope.createStreams = function(streamDefNameToWaitFor, attemptCount) {
                // Are we waiting for a stream to be available?
                if (streamDefNameToWaitFor) {
                    if (attemptCount === 10) {
                        utils.$log.info('Aborting after 10 attempts, cannot find the stream: '+streamDefNameToWaitFor);
                        return;
                    }
                    streamService.getSingleStreamDefinition(streamDefNameToWaitFor).success(function() {
                        utils.$log.info('Stream '+streamDefNameToWaitFor+' is ok!');
                        utils.$timeout(function(){$scope.createStreams();},0);
                    }).error(function() {
                        utils.$log.info('Stream '+streamDefNameToWaitFor+' is not there yet (attempt=#'+attemptCount+')');
                        utils.$timeout(function(){$scope.createStreams(streamDefNameToWaitFor,attemptCount+1);},400);
                    });
                } else {
                    // Find index of the first not yet created stream
                    var index = $scope.streamdefs.findIndex(function(def) {
                        return !def.created;
                    });
                    if (index < 0 || index >= $scope.streamdefs.length) {
                        // Invalid index means all streams have been created, close the dialog.
                        $modalInstance.close(true);
                    } else {
                        // Send the request to create a stream
                        var def = $scope.streamdefs[index];
                        streamService.create(def.name, def.def, $scope.deploy).success(function() {
                            utils.$log.info('Stream '+def.name+' created OK');
                            // Stream created successfully, mark it as created
                            def.created = true;
                            if ($scope.streamdefs.length - 1 === index) {
                                // Last stream created, close the dialog
                                $modalInstance.close(true);
                            } else {
                                // There are more streams to create, so create the next one
                                $scope.createStreams(def.name,0);
                            }
                        }).error(function(error) {
                            for (var e=0; e<error.length; e++) {
                                utils.growl.error('Problem creating stream: ' + def.name + ':' + error[e].message);
                            }
                            utils.$log.error('Failed to create stream ' + JSON.stringify(def));
                        });
                    }
                }
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

        }];
});
