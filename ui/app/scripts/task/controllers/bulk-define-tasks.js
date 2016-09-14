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
 * Definition bulk import apps controller.
 *
 * @author Alex Boyko
 */
define(function () {
    'use strict';

    var PROGRESS_BAR_WAIT_TIME = 500;

    return ['$scope', 'DataflowUtils', '$modal', '$state', 'TaskAppService',
        function ($scope, utils, $modal, $state, taskAppService) {

            // function calculateValidationMarkers(text) {
            //     var lines = [];
            //     text.split('\n').forEach(function(line) {
            //         var parsedLine = line.trim();
            //         if (parsedLine.length) {
            //             lines.push(parsedLine);
            //         }
            //     });
            //
            //     return {
            //         list: [
            //         ],
            //         numberOfErrors: 0,
            //         numberOfWarnings: 0,
            //         numberOfTasks: lines.length
            //     };
            // }

            function getDefinitionsFromDsl(dsl) {
                var defs = [];
                dsl.split('\n').forEach(function(line, number) {
                    var parsedLine = line.trim();
                    if (parsedLine.length) {
                        var idx = parsedLine.indexOf('=');
                        if (idx > 0 && idx < parsedLine.length - 1) {
                            defs.push({
                                name: parsedLine.substr(0, idx).trim(),
                                definition: parsedLine.substr(idx + 1).trim(),
                                line: number,
                                text: line
                            });
                        }
                    }
                });
                return defs;
            }
            
            $scope.numberOfErrors = 0;
            $scope.numberOfWarnings = 0;
            $scope.numberOfTasks = 0;

            /**
             * Bulk Define Tasks.
             */
            $scope.bulkDefineTasks = function() {
                utils.$log.info('Bulk define clicked!');
                var defs = getDefinitionsFromDsl($scope.dsl);
                var failedDefs = [];
                var requests = [];
                defs.forEach(function(def) {
                    var request = taskAppService.createDefinition(
                        def.name,
                        def.definition
                    ).$promise;
                    request.catch(function() {
                        failedDefs.push(def);
                    });
                    requests.push(request);
                });


                utils.$q.all(requests).then(function() {
                    utils.growl.success('Task Definitions created successfully');
                }, function() {
                    utils.growl.error('Failed to be created task(s) definition(s) are shown in the editor!');
                    // Show only failed defs DSL
                    if (failedDefs.length !== defs.length) {
                        var text = '';
                        failedDefs.forEach(function(def) {
                            text += def.text + '\n';
                        });
                        $scope.dsl = text;
                    }
                });

                // Pop up progress dialog
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/task/dialogs/bulk-define-progress.html',
                    controller: ['$scope', 'DataflowUtils', '$modalInstance', 'requests',
                        function ($scope, utils, $modalInstance, requests) {

                            var total = requests.length;
                            var completed = 0;

                            $scope.close = function() {
                                $modalInstance.close();
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getProgressPercent = function() {
                                return Math.round(100 * completed / total);
                            };

                            requests.forEach(function(promise) {
                                promise.then(function() {
                                    completed++;
                                });
                            });

                            utils.$q.all(requests).then(function() {
                                utils.$timeout($scope.close, PROGRESS_BAR_WAIT_TIME);
                            }, function() {
                                utils.$timeout($scope.cancel, PROGRESS_BAR_WAIT_TIME);
                            });

                        }],
                    resolve: {
                        requests: function () {
                            return requests;
                        }
                    }
                }).result.then(function() {
                    // Dialog closed in the case of success
                    $state.go('home.tasks.tabs.definitions');
                });

            };

            /**
             * Takes one to Tasks Definitions page
             */
            $scope.cancel = function() {
                // Pop up confirmation dialog
                if ($scope.dsl) {
                    $modal.open({
                        animation: true,
                        templateUrl: 'scripts/task/dialogs/bulk-define-cancel.html',
                        controller: ['$scope', '$modalInstance',
                            function ($scope, $modalInstance) {

                                $scope.proceed = function() {
                                    $modalInstance.close();
                                };

                                $scope.cancel = function() {
                                    $modalInstance.dismiss('cancel');
                                };

                            }]
                    }).result.then(function() {
                        // Navigate away on successfully closed dialog
                        $state.go('home.tasks.tabs.definitions');
                    });
                } else {
                    // Simply navigate away if DSL editor is empty
                    $state.go('home.tasks.tabs.definitions');
                }
            };

            $scope.displayFileContents = function(contents) {
                $scope.dsl = contents;
            };

            $scope.hint = {
                async: 'true',
                hint: function(cm, callback) { // jshint ignore:line
                    // TODO: calculate completion proposals and return results as shown below

                    // See https://codemirror.net/doc/manual.html#addons hint/show-hint.js section

                    // return callback({
                    //   list: listOfStrings
                    //   from: {line: startLine, ch:startCharIndex},
                    //   to: {line: endLine, ch:endCharIndex}
                    // });

                    utils.$log.info('Task DSL Content Assist Invoked!');
                }
            };

            $scope.lint = {
                async: true,
                getAnnotations: function (dslText, callback, options, doc) { // jshint ignore:line
                    // TODO: perform linting, return results as shown below
                    // markers.push({
                    //   from: range.start,
                    //   to: range.end,
                    //   message: 'Some error message!',
                    //   severity: 'error'
                    // callback(doc, markers);

                    utils.$log.info('Task DSL Lint invoked');

                    // var markers = calculateValidationMarkers(doc.getValue());
                    // callback(doc, markers.list);
                    //
                    // utils.$timeout(function() {
                    //     $scope.numberOfErrors = markers.numberOfErrors;
                    //     $scope.numberOfWarnings = markers.numberOfWarnings;
                    //     $scope.numberOfTasks = markers.numberOfTasks;
                    //     $scope.bulkDefineTasksForm.$setValidity('invalidDsl', $scope.numberOfErrors === 0);
                    //     $scope.bulkDefineTasksForm.$setValidity('noTasksDefined', $scope.numberOfTasks > 0);
                    // });
                }
            };

            $scope.$apply();

        }];
});
