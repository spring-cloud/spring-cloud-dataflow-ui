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
 * @author Andy Clement
 */
define(['angular', 'angularMocks', 'app'], function (angular) {
    'use strict';

    var TASK_APPS = {
        'timestamp': {
            name: 'timestamp'
        },
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
                        data: TASK_APPS[name]
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

        it('Basic valid of task definition', function(done) {
            inject(function(TaskDslValidatorService, $rootScope) {
                var validator = TaskDslValidatorService.createValidator('foo=timestamp');
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
                var validator = TaskDslValidatorService.createValidator('foo=bar');
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

        // it('parser service', inject(function(ParserService) {
        //     var output = ParserService.parse('foo=timestamp', 'task');
        //     expect(output.lines).toBeDefined();
        //     expect(output.lines.length).toEqual(1);
        //     var line = output.lines[0];
        //     expect(line.errors).toBeNull();
        //     expect(line.success).toBeDefined();
        //     expect(line.success.length).toEqual(1);
        //
        //     var nameNode = line.success[0].group;
        //     var nameRange = line.success[0].grouprange;
        //     expect(nameNode).toEqual('foo');
        //     expect(nameRange.start.ch).toEqual(0);
        //     expect(nameRange.end.ch).toEqual(3);
        //
        //     var barNode = line.success[0];
        //     expect(barNode.name).toEqual('bar');
        //     expect(barNode.range.start.ch).toEqual(4);
        //     expect(barNode.range.end.ch).toEqual(7);
        // }));
    });
});

