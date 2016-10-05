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
 * Service providing validation for task definitions.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define(function() {
    'use strict';

    return ['DataflowUtils', 'ParserService', 'AppService', function (utils, parserService, appService) {

        var DEBUG = false;

        function createValidator(dslText, options) {
            var cancelled = false;
            var appInfos = {}; // Cached results for one run of the validator

            function cancel() {
                cancelled = true;
            }

            /**
             * Retrieve application description (what options does it support, etc). This
             * function uses a cache with a lifetime of this validation run to avoid
             * asking for the definition of the same app over and over.
             */
            function getAppInfo(name) {
                if (DEBUG) { utils.$log.info('>getAppInfo '+name); }
                var deferred = utils.$q.defer();
                if (appInfos.hasOwnProperty(name)) {
                    deferred.resolve(appInfos[name]);
                } else {
                    // On a successful call, result.data will be a JSON Object
                    // with name/type/uri/shortDescription/options
                    appService.getAppInfo('task', name).then(function (result) {
                        // sleep(2000).then(()=>{
                        appInfos[name] = result.data;
                        deferred.resolve(result.data);
                        if (DEBUG) { utils.$log.info('>getAppInfo fetched data for app '+name+' = '+JSON.stringify(result.data)); }
                        // });
                    }, function (error) {
                        utils.$log.error(error);
                        deferred.reject(error);
                    });
                }
                return deferred.promise;
            }

            // Build a nicely structured command definition
            function constructDefinitionText(parsedInfo) {
                var def = parsedInfo.name;
                if (parsedInfo.options) {
                    Object.keys(parsedInfo.options).forEach(function (name) {
                        def += ' --' + name + '=' + parsedInfo.options[name];
                    });
                }
                return def;
            }

            function constructDefinitionObject(parsedInfo) {
                return {
                    name: parsedInfo.group,
                    definition: constructDefinitionText(parsedInfo),
                    line: parsedInfo.range.start.line
                };
            }

            /**
             * Check if the parsed definition supports the specified options. If not then
             * append error messages to the messageAccumulator. Returns a promise that will be resolved
             * when the checking is complete.
             */
            function verifyApp(parsedInfo, messagesAccumulator, definitionsAccumulator) {
                if (DEBUG) { utils.$log.info('>verifyApp '+JSON.stringify(parsedInfo)); }
                var appName = parsedInfo.name;
                var deferred = utils.$q.defer();
                getAppInfo(appName).then(function (result) {
                    if (!result || result === '') {
                        // unknown app
                        messagesAccumulator.push({
                            message: '\'' + appName + '\' is not a known task application',
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
                                messagesAccumulator.push({
                                    from: parsedInfo.optionsranges[k].start,
                                    to: parsedInfo.optionsranges[k].end,
                                    message: 'Application \'' + appName + '\' does not support the option \'' + k + '\'',
                                    severity: 'error'
                                });
                            }
                        });
                        // TODO create errors for options you *must* specify but haven't
                        if (!hasErrors && parsedInfo.group) {
                            definitionsAccumulator.push(constructDefinitionObject(parsedInfo));
                        }
                    }
                    deferred.resolve(parsedInfo);
                }, function (error) {
                    messagesAccumulator.push({
                        message: '\'' + appName + '\' is not a known task application',
                        severity: 'error',
                        from: parsedInfo.range.start,
                        to: parsedInfo.range.end,
                    });
                    utils.$log.error(error);
                    deferred.resolve(parsedInfo);
                });
                return deferred.promise;
            }

            /**
             * Validate the data in the text box. First attempt to parse it and if successful
             * then verify each line refers to a valid application and provides valid options.
             */
            function validate() {
                var deferred = utils.$q.defer();
                var results = parserService.parse(dslText,'task');
                var messages = [];
                var definitions = [];
                var knownTaskDefinitionNames = [];
                var verificationPromiseChain = utils.$q.when(function() { });
                var createVerifyAppInvoker = function (toValidate, messages, definitions) {
                    return function() {
                        return verifyApp(toValidate, messages, definitions);
                    };
                };
                if (results.lines) {
                    for (var i = 0; i<results.lines.length; i++) {
                        if (cancelled) {
                            return;
                        }
                        var line = results.lines[i];
                        if (line.errors) {
                            for (var e = 0; e < line.errors.length; e++) {
                                var error = line.errors[e];
                                messages.push({message: error.message, severity: 'error', from: error.range.start, to: error.range.end});
                            }
                        }
                        if (line.success && line.success.length !== 0) {
                            // Check if already seen an app called this
                            if (line.success[0].group) {
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
                            }
                            var parsedInfo = line.success[0];
                            if (options.semantics) {
                                verificationPromiseChain =
                                    verificationPromiseChain.then(
                                        createVerifyAppInvoker(parsedInfo, messages, definitions));
                            } else if (parsedInfo.group) {
                                definitions.push(constructDefinitionObject(parsedInfo));
                            }
                        }
                    }
                }

                verificationPromiseChain.then(function () {
                    if (!cancelled) {
                        messages.sort(function(a,b) {
                            return a.from.line - b.from.line;
                        });
                        deferred.resolve({
                            errors: messages,
                            warnings: [],
                            definitions: definitions
                        });
                    } else {
                        deferred.reject();
                    }
                });

                return deferred.promise;
            }

            return {
                cancel: cancel,
                validate: validate
            };   
        }

        return {
            'createValidator': createValidator
        };

    }];

});
