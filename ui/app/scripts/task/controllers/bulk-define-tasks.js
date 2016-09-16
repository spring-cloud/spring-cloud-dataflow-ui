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

    return ['$scope', 'DataflowUtils', '$modal', '$state', 'TaskAppService', 'ParserService', 'AppService',
        function ($scope, utils, $modal, $state, taskAppService, parserService, appService) {

            var editor;

            var updateRulerErrors;

            var updateRulerWarnings;

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

            var activeValidator;

            function Validator(dslText, callback, options, doc) {
                this.cancelled = false;
                this.dslText = dslText;
                this.callback = callback;
                this.options = options;
                this.doc = doc;
                this.appInfos = {}; // Cached results for one run of the validator
            }

            Validator.prototype.cancel = function() { 
                this.cancelled = true;
            };

            /**
             * Retrieve application description (what options does it support, etc). This 
             * function uses a cache with a lifetime of this validation run to avoid
             * asking for the definition of the same app over and over.
             */
            Validator.prototype.getAppInfo = function(name) {
                var deferred = utils.$q.defer();
                if (this.appInfos.hasOwnProperty(name)) {
                    deferred.resolve(this.appInfos[name]);
                } else {
                    // On a successful call, result.data will be a JSON Object
                    // with name/type/uri/shortDescription/options
                    appService.getAppInfo('task',name).then(function (result) {
                        // sleep(2000).then(()=>{
                        this.appInfos[name]=result.data;
                        deferred.resolve(result.data);
                        // });
                    }.bind(this), function(error) {
                        console.error(error);
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            };

            /**
             * Check if the parsed definition supports the specified options. If not then
             * append error messages to the messageAccumulator. Returns a promise that will be resolved
             * when the checking is complete.
             */
            Validator.prototype.verifyApp = function(parsedInfo, messageAccumulator, definitionsAccumulator) {
                // console.log('Verifying '+JSON.stringify(parsedInfo));
                var appName = parsedInfo.name;
                var deferred = utils.$q.defer();
                this.getAppInfo(appName).then(function(result) {
                    // console.log('getAppInfo responded: '+JSON.stringify(result));
                    if (!result || result === '') {
                        // unknown app
                        messageAccumulator.push({
                            message: '\''+appName+'\' is not a known task application',
                            severity: 'error',
                            from: parsedInfo.range.start,
                            to: parsedInfo.range.end,
                        });
                    } else {
                        var hasErrors = false;
                        var validOptions = result.options;
                        Object.keys(parsedInfo.options).forEach(function (k) {
                            var valid = false;
                            for (var o = 0; o < validOptions.length; o++) {
                                if (k === validOptions[o].name || k === validOptions[o].id) {
                                    valid = true;
                                    break;
                                }
                            }
                            if (!valid) {
                                hasErrors = true;
                                messageAccumulator.push({
                                    from: parsedInfo.optionsranges[k].start,
                                    to: parsedInfo.optionsranges[k].end,
                                    message: 'Application \''+name+'\' does not support the option \''+k+'\'',
                                    severity: 'error'
                                });
                            }
                        });
                        // TODO create errors for options you *must* specify but haven't
                        if (!hasErrors && parsedInfo.group) {
                            // Build a nicely structured command definition
                            var def = appName;
                            if (parsedInfo.options) {
                                Object.keys(parsedInfo.options).forEach(function(name) {
                                    def+=' --'+name+'='+parsedInfo.options[name];
                                });
                            }
                            definitionsAccumulator.push({
                                name: parsedInfo.group,
                                definition: def,
                                line: parsedInfo.range.start.line,
                                text: ''
                            });
                        }
                    }
                    deferred.resolve(parsedInfo);
                }, function(error) {
                    console.error(error);
                    deferred.reject();
                });
                return deferred.promise;
            };

            /**
             * Validate the data in the text box. First attempt to parse it and if successful
             * then verify each line refers to a valid application and provides valid options.
             */
            Validator.prototype.validate = function() {
                    var results = parserService.parse(this.dslText,'task');
                    // console.log('validation: parser result = ' +JSON.stringify(results));
                    var messages = [];
                    var definitions = [];
                    var knownTaskDefinitionNames = [];
                    var verificationPromiseChain = utils.$q.when();
                    var callVerifyApp = function(lineToValidate) {
                        return this.verifyApp(lineToValidate, messages, definitions);
                    };
                    if (results.lines) {
                        for (var i = 0; i<results.lines.length; i++) {
                            if (this.cancelled) {
                                return;
                            }
                            var line = results.lines[i];
                            if (line.errors) {
                                for (var e = 0; e < line.errors.length; e++) {
                                    var error = line.errors[e];
                                    messages.push({message: error.message, severity: 'error', from: error.range.start, to: error.range.end});
                                }
                            }
                            if (line.success && line.success.length !== 0 ) {
                                // Check if already seen an app called this
                                var taskDefinitionName = line.success[0].group;
                                var alreadyExists = false;
                                for (var d = 0; d < knownTaskDefinitionNames.length; d++) {
                                    if (knownTaskDefinitionNames[d] === taskDefinitionName) {
                                        alreadyExists = true;
                                        messages.push({message: 'Duplicate task definition name \''+taskDefinitionName+'\'', severity: 'error', from: line.success[0].grouprange.start, to: line.success[0].grouprange.end});                                        
                                    }
                                }
                                if (!alreadyExists) {
                                    knownTaskDefinitionNames.push(taskDefinitionName);
                                }
                                verificationPromiseChain = verificationPromiseChain.then(callVerifyApp.bind(this,line.success[0]));
                            }
                        }
                    }

                    verificationPromiseChain.then(function() {
                        if (!this.cancelled) {
                            this.callback(this.doc, messages);
                            utils.$timeout(function() {
                                messages.sort(function(a,b) {
                                    return a.from.line - b.from.line;
                                });
                                // console.log('messages: '+JSON.stringify(messages));
                                $scope.errors = messages;
                                $scope.warnings = [];
                                $scope.definitions = definitions;

                                // updateRulerWarnings.update(markers.warnings);
                                updateRulerErrors.update(messages);
                            }.bind(this));
                        }
                    }.bind(this));
            };
            

            $scope.lint = {
                async: true,
                getAnnotations: function (dslText, callback, options, doc) { // jshint ignore:line
                    // TODO: perform linting, return results as shown below
                    // markers.push({from: range.start, to: range.end, message: 'Some error message!', severity: 'error'});
                    // callback(doc, markers);

                    if (!editor) {
                        editor = doc;
                        editor.on('change', function() {
                            $scope.$apply(function() {
                                $scope.definitions = undefined;
                            });
                        });
                        updateRulerWarnings = editor.annotateScrollbar('CodeMirror-vertical-ruler-warning');
                        updateRulerErrors =  editor.annotateScrollbar('CodeMirror-vertical-ruler-error');
                    }

                    $scope.definitions = undefined;

                    utils.$log.info('Task validation invoked');

                    if (activeValidator) {
                        activeValidator.cancel();
                    }
                    activeValidator = new Validator(dslText, callback, options, doc);
                    activeValidator.validate();

                    // TODO not currently doing this
                    // updateRulerWarnings.update(markers.warnings);
                    // updateRulerErrors.update(markers.errors);
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
