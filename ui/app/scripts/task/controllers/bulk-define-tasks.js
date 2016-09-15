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
define(function (require) {
    'use strict';

    var PROGRESS_BAR_WAIT_TIME = 500;

    var angular = require('angular');

    return ['$scope', 'DataflowUtils', '$modal', '$state', 'TaskAppService',
        function ($scope, utils, $modal, $state, taskAppService) {

            var editor;

            var updateRulerErrors;

            var updateRulerWarnings;

            function extractDefinitionFromLine(line, number) {
                var parsedLine = line.trim();
                if (parsedLine.length) {
                    var idx = parsedLine.indexOf('=');
                    if (idx > 0 && idx < parsedLine.length - 1) {
                        return {
                            name: parsedLine.substr(0, idx).trim(),
                            definition: parsedLine.substr(idx + 1).trim(),
                            line: number,
                            text: line
                        };
                    }
                }
            }

            function calculateValidationMarkers(text) {
                var errors = [];
                var warnings = [];
                var defs = [];
                text.split('\n').forEach(function(line, number) {
                    var idx = line.indexOf('koko');
                    if (idx >= 0) {
                        errors.push({
                            message: 'Invalid identifier',
                            severity: 'error',
                            from: {line: number, ch: idx},
                            to: {line: number, ch: idx + 'koko'.length}
                        });
                    }
                    idx = line.indexOf('ab');
                    if (idx >= 0) {
                        warnings.push({
                            message: 'Questionable identifier',
                            severity: 'warning',
                            from: {line: number, ch: idx},
                            to: {line: number, ch: idx + 'ab'.length}
                        });
                    }
                    var def = extractDefinitionFromLine(line, number);
                    if (def) {
                        defs.push(def);
                    }
                });

                return {
                    errors: errors,
                    warnings: warnings,
                    defs: defs
                };
            }

            function findNextMarker(markers, cursor) {
                if (angular.isArray(markers)) {
                    for (var i = 0; i < markers.length; i++) {
                        if (markers[i].from.line === cursor.line && markers[i].from.ch > cursor.ch) {
                            return markers[i];
                        } else if (markers[i].from.line > cursor.line) {
                            return markers[i];
                        }
                    }
                    return markers[0];
                }
            }

            function navigateToNextMarker(editor, markers) {
                var nextMarker = findNextMarker(markers, editor.getCursor());
                if (nextMarker) {
                    // Select the chunk of DSL that caused an error
                    editor.setSelection(nextMarker.from, nextMarker.to, {scroll: false});
                    // Scroll to marker and allow scroller viewport height / 2 space around vertically
                    editor.scrollIntoView(nextMarker, $(editor.getScrollerElement()).height() / 2);
                }
            }

            /**
             * Bulk Define Tasks.
             */
            $scope.bulkDefineTasks = function() {
                if ($scope.definitions) {
                    utils.$log.error('No tasks defined by the DSL');
                    return;
                }
                var failedDefs = [];
                var requests = [];
                $scope.definitions.forEach(function(def) {
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
                    if (failedDefs.length !== $scope.definitions.length) {
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

                    if (!editor) {
                        editor = doc;
                        editor.on('change', function() {
                            $scope.$apply(function() {
                                $scope.definitions = undefined;
                            });
                        });
                        updateRulerWarnings = editor.annotateScrollbar('vertical-ruler-warning');
                        updateRulerErrors =  editor.annotateScrollbar('vertical-ruler-error');
                    }

                    $scope.definitions = undefined;

                    utils.$log.info('Task DSL Lint invoked');

                    utils.$timeout(function() {


                        var markers = calculateValidationMarkers(doc.getValue());
                        callback(doc, markers.errors.concat(markers.warnings));

                        updateRulerWarnings.update(markers.warnings);
                        updateRulerErrors.update(markers.errors);

                        utils.$timeout(function() {
                            $scope.errors = markers.errors;
                            $scope.warnings = markers.warnings;
                            $scope.definitions = markers.defs;
                        });


                    }, 3000);
                }
            };

            $scope.nextError = function() {
                navigateToNextMarker(editor, $scope.errors);
            };

            $scope.nextWarning = function() {
                navigateToNextMarker(editor, $scope.warnings);
            };

            $scope.$watch('errors', function(errors) {
                $scope.bulkDefineTasksForm.$setValidity('validDsl', !errors || errors.length === 0);
            });

            $scope.$watch('definitions', function(definitions) {
                $scope.bulkDefineTasksForm.$setValidity('taskDefsPresent', angular.isArray(definitions) && definitions.length > 0);
                $scope.bulkDefineTasksForm.$setValidity('processedDsl', angular.isArray(definitions));
            });

            $scope.numberOfTasks = 0;
            $scope.errors = [];
            $scope.warnings = [];
            $scope.definitions = [];

            $scope.$apply();

        }];
});
