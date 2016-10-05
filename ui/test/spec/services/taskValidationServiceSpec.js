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
 * @author Alex Boyko
 * @author Andy Clement
 */
define(['angular', 'angularMocks', 'app'], function (angular) {
    'use strict';

    // Output from: curl localhost:9393/apps/task/timestamp - then just removed the escaped quotes.
    var TASK_APPS = {
        'test':'{"name":"test","options":[{"name":"testone"},{"name":"testtwo"}]}',
        'timestamp': '{"name":"timestamp","type":"task","uri":"maven://org.springframework.cloud.task.app:timestamp-task:1.0.0.BUILD-SNAPSHOT","shortDescription":null,"options":[{"id":"timestamp.format","name":"format","type":"java.lang.String","description":"The timestamp format, yyyy-MM-dd HH:mm:ss.SSS by default.","shortDescription":"The timestamp format, yyyy-MM-dd HH:mm:ss.SSS by default.","defaultValue":"yyyy-MM-dd HH:mm:ss.SSS","valueHints":[],"valueProviders":[],"deprecation":null,"sourceType":"org.springframework.cloud.task.app.timestamp.TimestampTaskProperties","sourceMethod":null,"deprecated":false}]}'
    };

    describe('Unit: Testing JS validation of task definitions', function () {

        // beforeEach(function () {
        //     angular.mock.module('dataflowMain');
        // });

        beforeEach(module('dataflowMain'));

        beforeEach(inject(function(AppService, $q){
            spyOn(AppService, 'getAppInfo').and.callFake(function(type, name) {
                var deferred = $q.defer();
                if (angular.isDefined(TASK_APPS[name])) {
                    deferred.resolve({
                        data: JSON.parse(TASK_APPS[name])
                    });
                } else {
                    deferred.reject();
                }
                return deferred.promise;
            });
        }));

        it('should have a TaskDslValidatorService', inject(function (TaskDslValidatorService) {
            expect(TaskDslValidatorService).toBeDefined();
        }));

        it('Valid task definition syntax', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=bar', {semantics: false});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Invalid task definition syntax', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo bar', {semantics: false});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(1);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(0);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Valid task definition syntax with properties', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=bar --key=value', {semantics: false});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Invalid task definition syntax with properties', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=bar key=value', {semantics: false});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(1);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(0);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Basic valid of task definition', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=timestamp', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Basic invalid task definition', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=bar', {semantics: true});
                validator.validate().then(function(results) {
                    expect(results.errors.length).toEqual(1);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(0);
                    var error = results.errors[0];
                    expect(error.message).toEqual('\'bar\' is not a known task application');
                    expect(error.severity).toEqual('error');
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Valid app options', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo = timestamp  --format=hms', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);
                    var def = results.definitions[0];
                    expect(def.name).toEqual('foo');
                    expect(def.definition).toEqual('timestamp --format=hms');
                    expect(def.line).toEqual(0);
                    // expect(def.text).toEqual('foo = timestamp  --format=hms');
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Invalid app options', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=timestamp --wibble=wobble', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(1);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(0);

                    var error = results.errors[0];
                    expect(error.from.ch).toEqual(14);
                    expect(error.from.line).toEqual(0);
                    expect(error.to.ch).toEqual(29);
                    expect(error.to.line).toEqual(0);
                    expect(error.message).toEqual('Application \'timestamp\' does not support the option \'wibble\'');
                    expect(error.severity).toEqual('error');
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Multiple options - all valid', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=test --testone=abc --testtwo=def', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);

                    var def = results.definitions[0];
                    expect(def.name).toEqual('foo');
                    expect(def.definition).toEqual('test --testone=abc --testtwo=def');
                    expect(def.line).toEqual(0);
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Multiple options - one invalid', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=test --testone=abc --testtwo=def --phoney=baloney', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(1);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(0);

                    var error = results.errors[0];
                    expect(error.from.ch).toEqual(37);
                    expect(error.from.line).toEqual(0);
                    expect(error.to.ch).toEqual(53);
                    expect(error.to.line).toEqual(0);
                    expect(error.message).toEqual('Application \'test\' does not support the option \'phoney\'');
                    expect(error.severity).toEqual('error');

                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Multi line - 2 invalid, 1 valid', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('aaa=bbb\nfoo=timestamp --format=hh\nccc=ddd', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(2);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(1);
                   
                    var def = results.definitions[0];
                    expect(def.name).toEqual('foo');
                    expect(def.definition).toEqual('timestamp --format=hh');
                    expect(def.line).toEqual(1);
                    // expect(def.text).toEqual('foo=timestamp --format=hh');

                    var error = results.errors[0];
                    expect(error.from.ch).toEqual(4);
                    expect(error.from.line).toEqual(0);
                    expect(error.to.ch).toEqual(7);
                    expect(error.to.line).toEqual(0);
                    expect(error.message).toEqual('\'bbb\' is not a known task application');
                    expect(error.severity).toEqual('error');
                                      
                    error = results.errors[1];
                    expect(error.from.ch).toEqual(4);
                    expect(error.from.line).toEqual(2);
                    expect(error.to.ch).toEqual(7);
                    expect(error.to.line).toEqual(2);
                    expect(error.message).toEqual('\'ddd\' is not a known task application');
                    expect(error.severity).toEqual('error');
                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });


        it('Multi line - 2 valid', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('aaa=test\nfoo=timestamp --format=hh', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(0);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(2);
                   
                    var def = results.definitions[0];
                    expect(def.name).toEqual('aaa');
                    expect(def.definition).toEqual('test');
                    expect(def.line).toEqual(0);
                    // expect(def.text).toEqual('foo=timestamp --format=hh');

                    def = results.definitions[1];
                    expect(def.name).toEqual('foo');
                    expect(def.definition).toEqual('timestamp --format=hh');
                    expect(def.line).toEqual(1);
                    // expect(def.text).toEqual('foo=timestamp --format=hh');

                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

        it('Multi line - 2 valid but clashing names, 1 invalid', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('aaa=bar\nb=test\nb=timestamp --format=hh', {semantics: true});
                validator.validate().then(function (results) {
                    expect(results.errors.length).toEqual(2);
                    expect(results.warnings.length).toEqual(0);
                    expect(results.definitions.length).toEqual(2);
                   
                    var def = results.definitions[0];
                    expect(def.name).toEqual('b');
                    expect(def.definition).toEqual('test');
                    expect(def.line).toEqual(1);
                    // expect(def.text).toEqual('foo=timestamp --format=hh');
                       
                    var error = results.errors[0];
                    expect(error.from.ch).toEqual(4);
                    expect(error.from.line).toEqual(0);
                    expect(error.to.ch).toEqual(7);
                    expect(error.to.line).toEqual(0);
                    expect(error.message).toEqual('\'bar\' is not a known task application');
                    expect(error.severity).toEqual('error');

                    error = results.errors[1];
                    expect(error.from.ch).toEqual(0);
                    expect(error.from.line).toEqual(2);
                    expect(error.to.ch).toEqual(1);
                    expect(error.to.line).toEqual(2);
                    expect(error.message).toEqual('Duplicate task definition name \'b\'');
                    expect(error.severity).toEqual('error');

                    done();
                }, function() {
                    fail('Validation unexpectedly cancelled'); // jshint ignore:line
                });

                // Mocked promises require digest cycle kick off for `then` to be called
                $rootScope.$apply();
            });
        });

    });
});

