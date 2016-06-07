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
 * Definition of Dashboard directives of the analytics apps.
 *
 * @author Alex Boyko
 */
define(function(require) {
    'use strict';

    var angular = require('angular');

    return angular.module('xdStreamsAdmin.directives', ['xdShared.services', 'xdStreamsAdmin.services'])
        .directive('uniqueStreamName', ['XDUtils', 'StreamService', function (utils, streamService) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    ctrl.$asyncValidators.uniqueStreamName = function(modelValue) {

                        if (ctrl.$isEmpty(modelValue)) {
                            // consider empty model valid
                            return utils.$q.when();
                        }

                        var def = utils.$q.defer();

                        streamService.getSingleStreamDefinition(modelValue).then(function() {
                            // Success! Found stream with such name
                            def.reject('Stream with such name exists');
                        }, function(error) {
                            if (error.status === 404) {
                                def.resolve();
                            } else {
                                def.reject(error.statusText);
                            }
                        });

                        return def.promise;
                    };
                }
            };
        }])
        .directive('noneOf', [function() {
            return {
                require: 'ngModel',
                scope: {
                    values: '=noneOf'
                },
                link: function(scope, elm, attrs, ctrl) {
                    ctrl.$validators.noneOf = function(modelValue) {
                        if (!ctrl.$isEmpty(modelValue)) {
                            if (angular.isArray(scope.values)) {
                                return scope.values.indexOf(modelValue) === -1;
                            } else if (angular.isObject(scope.values)) {
                                return scope.values[modelValue] ? false : true;
                            }
                        }
                        // it is invalid
                        return true;
                    };
                }
            };
        }])
        .directive('uniqueIn', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    var form = elm.inheritedData('$formController');

                    ctrl.$parsers.push(function(value) {
                        // no value - we it's valid (required takes care of it)
                        if (!value) {
                            ctrl.$setValidity('unique', true);
                            return value;
                        }

                        // no change - do nothing, keep the validity
                        if (value === ctrl.$modelValue) {
                            return value;
                        }

                        var index = 0;
                        var unique = true;
                        var formControl;
                        var oldValueDupIndexes = [];
                        while (angular.isObject(form[attrs.uniqueIn + index])) {
                            formControl = form[attrs.uniqueIn + index];
                            if (ctrl !== formControl) {
                                if (formControl.$modelValue === value) {
                                    formControl.$setValidity('unique', false);
                                    unique = false;
                                }
                                if (formControl.$modelValue && formControl.$modelValue === ctrl.$modelValue) {
                                    oldValueDupIndexes.push(index);
                                }
                            }
                            index++;
                        }

                        // Only one form field has an old value so it's not a duplicate anymore
                        if (oldValueDupIndexes.length === 1) {
                            form[attrs.uniqueIn + oldValueDupIndexes[0]].$setValidity('unique', true);
                        }

                        ctrl.$setValidity('unique', unique);
                        return value;
                    });
                }
            };
        }]);
});
