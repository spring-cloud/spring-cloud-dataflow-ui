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
 * @author Andy Clement
 */
define(function (require) {
    'use strict';

    var PROGRESS_BAR_WAIT_TIME = 500;

    var VERIFY_APPS_OFF_COOKIE_KEY = 'taskDefs.bulkDefine.verifyAppsOff';

    var angular = require('angular');

    return ['$scope', 'DataflowUtils', '$modal', '$state', 'TaskAppService', 'TaskDslValidatorService', '$cookieStore', 'TaskContentAssistService',
        function ($scope, utils, $modal, $state, taskAppService, validatorService, $cookieStore, contentAssistService) {

            var editor;

            var updateRulerErrors;

            var updateRulerWarnings;

            var activeValidator;

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

            function createLinterOption() {
                return {
                    async: true,
                    getAnnotations: function (dslText, callback, options, doc) { // jshint ignore:line
                        // markers.push({from: range.start, to: range.end, message: 'Some error message!', severity: 'error'});
                        // callback(doc, markers);

                        // Init editor
                        if (!editor) {
                            editor = doc;
                            editor.on('change', function() {
                                $scope.definitions = undefined;
                                $scope.bulkDefineTasksForm.$setValidity('notEmpty', dslText && dslText.length);
                            });
                            updateRulerWarnings = editor.annotateScrollbar('CodeMirror-vertical-ruler-warning');
                            updateRulerErrors =  editor.annotateScrollbar('CodeMirror-vertical-ruler-error');
                        }

                        // Switch validator
                        if (activeValidator) {
                            activeValidator.cancel();
                        }
                        activeValidator = validatorService.createValidator(dslText, {semantics: $scope.verifyApps});

                        // Perform validation
                        activeValidator.validate().then(function (validationResults) {
                            // Update CodeMirror gutter error/warning markers
                            callback(doc, validationResults.errors.concat(validationResults.warnings));

                            validationResults.errors.sort(function (a, b) {
                                return a.from.line - b.from.line;
                            });
                            validationResults.warnings.sort(function (a, b) {
                                return a.from.line - b.from.line;
                            });
                            $scope.errors = validationResults.errors;
                            $scope.warnings = validationResults.warnings;
                            $scope.definitions = validationResults.definitions;
                        });
                    }
                };
            }

            /**
             * Bulk Define Tasks.
             */
            $scope.bulkDefineTasks = function() {
                if (!$scope.definitions || !$scope.definitions.length) {
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
                    utils.growl.error('Failed creating some Task Definitions');
                });

                // Pop up progress dialog
                $modal.open({
                    animation: true,
                    templateUrl: 'scripts/task/dialogs/bulk-define-progress.html',
                    controller: ['$scope', 'DataflowUtils', '$modalInstance', 'requests',
                        function ($scope, utils, $modalInstance, requests) {

                            var total = requests.length;
                            var completed = 0;
                            var errors = 0;

                            $scope.close = function() {
                                $modalInstance.close();
                            };

                            $scope.cancel = function() {
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.getProgressPercent = function() {
                                return Math.round(100 * completed / total);
                            };

                            var deferred = utils.$q.defer();

                            function tryResolve() {
                                if (completed + errors === requests.length) {
                                    if (errors) {
                                        deferred.reject();
                                    } else {
                                        deferred.resolve();
                                    }
                                }
                            }

                            requests.forEach(function(promise) {
                                promise.then(function() {
                                    completed++;
                                    tryResolve();
                                }, function() {
                                    errors++;
                                    tryResolve();
                                });
                            });

                            deferred.promise.then(function() {
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
                }, function() {
                    utils.growl.info('Failed to be created task(s) definition(s) are shown in the editor!');
                    // Show only failed defs DSL
                    if (failedDefs.length !== $scope.definitions.length) {
                        $scope.dsl = failedDefs.sort(function(d1, d2) {
                           return d1.line - d2.line;
                        }).map(function(def) {
                            return editor.getLine(def.line);
                        }).join('\n');
                    }
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

            function isDelimiter(c) {
                return c && c === ' ';
            }

            /**
             * The suggestions provided by rest api are very long and include the whole command typed
             * from the start of the line. This function determines the start of the 'interesting' part
             * at the end of the prefix, so that we can use it to chop-off the suggestion there.
             */
            function interestingPrefixStart(prefix, completions) {
                var cursor = prefix.length;
                if (completions.every(function (completion) {
                        return isDelimiter(completion[cursor]);
                    })) {
                    return cursor;
                }
                return prefix.lastIndexOf(' ');
            }

            var taskProposalComputer = function(cm, callback) { // jshint ignore:line
                    var cursor = cm.getDoc().getCursor();
                    var startOfLine = {line: cursor.line, ch: 0};
                    var prefix = cm.getDoc().getRange(startOfLine, cursor);

                    // Handle content assist for the name if not yet specified or followed by equals:
                    var equalsIndex = prefix.indexOf('=');
                    if (equalsIndex === -1) {
                        var trimmed = prefix.trim();
                        if (trimmed.length !== 0) {
                            // Suggest they follow the name with an '='
                            return callback({list:[trimmed+'='],from:{line:cursor.line,ch:0},to:cursor});
                        } else {
                            return callback({list:['task'+(cursor.line+1)+'='],from:{line:cursor.line,ch:0},to:cursor});
                        }
                    }
                    var textAfterEquals = prefix.substring(equalsIndex+1);
                    contentAssistService.getProposals(textAfterEquals).then(function(completions) {
                        // Example:
                        // [{"text":"spark-yarn","explanation":"Choose a task app"},
                        //  {"text":"spark-cluster","explanation":"Choose a task app"},
                        //  {"text":"timestamp","explanation":"Choose a task app"},
                        //  {"text":"spark-client","explanation":"Choose a task app"}]
                        var chopAt = interestingPrefixStart(textAfterEquals, completions);
                        if (chopAt === -1) {
                            chopAt = 0;
                        }
                        // If all the proposals are options adjust the chopAt
                        var areAllOptions = true;
                        for (var c=0;c<completions.length;c++) {
                            var longCompletion = completions[c];
                            var text = typeof longCompletion === 'string'?longCompletion: longCompletion.text;
                            if (!text.substring(textAfterEquals.length).startsWith(' --')) {
                                areAllOptions = false;
                                break;
                            }
                        }
                        if (areAllOptions) {
                            chopAt = textAfterEquals.length;
                        }
                        return callback({
                            list:completions.map(function(longCompletion) {
                                var text= typeof longCompletion === 'string'?longCompletion: longCompletion.text;
                                return text.substring(chopAt);
                            }),
                            from:{line:cursor.line,ch:chopAt+equalsIndex+1},
                            to:cursor
                        });
                    });
                };
            taskProposalComputer.async = true;

            $scope.hint = {
                async: 'true',
                hint: taskProposalComputer
            };

            $scope.nextError = function() {
                navigateToNextMarker(editor, $scope.errors);
            };

            $scope.nextWarning = function() {
                navigateToNextMarker(editor, $scope.warnings);
            };

            $scope.getValidationStatus = function() {
                var validStr = $scope.verifyApps ?  'valid' : 'syntactically correct';
                if ($scope.definitions && $scope.definitions.length) {
                    return $scope.definitions.length + ' ' + validStr + ' task definition' + ($scope.definitions.length > 1 ? 's' : '') + ' detected';
                } else {
                    return 'No ' + validStr + ' task definitions detected';
                }
            };

            $scope.$watch('errors', function(errors) {
                if (updateRulerErrors) {
                    // Update overview ruler error/warning markers
                    updateRulerErrors.update(errors);
                }
                $scope.bulkDefineTasksForm.$setValidity('validDsl', !errors || errors.length === 0);
            });

            $scope.$watch('warnings', function(warnings) {
                if (updateRulerWarnings) {
                    // Update overview ruler error/warning markers
                    updateRulerWarnings.update(warnings);
                }
            });

            $scope.$watch('definitions', function(definitions) {
                $scope.bulkDefineTasksForm.$setValidity('taskDefsPresent', angular.isArray(definitions) && definitions.length > 0);
                $scope.bulkDefineTasksForm.$setValidity('processedDsl', angular.isArray(definitions));
            });

            $scope.$watch('verifyApps', function() {
                if (activeValidator) {
                    activeValidator.cancel();
                }
                $scope.numberOfTasks = 0;
                $scope.errors = [];
                $scope.warnings = [];
                $scope.definitions = undefined;
                $scope.lint = createLinterOption();
            });

            $scope.$on('$destroy', function() {
                if (activeValidator) {
                    activeValidator.cancel();
                }
                if ($scope.verifyApps) {
                    $cookieStore.remove(VERIFY_APPS_OFF_COOKIE_KEY);
                } else {
                    $cookieStore.put(VERIFY_APPS_OFF_COOKIE_KEY, true);
                }
            });

            $scope.verifyApps = !$cookieStore.get(VERIFY_APPS_OFF_COOKIE_KEY);
            $scope.numberOfTasks = 0;
            $scope.errors = [];
            $scope.warnings = [];
            $scope.definitions = [];

            $scope.$apply();

        }];
});
