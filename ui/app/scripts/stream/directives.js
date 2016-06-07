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
 * Directives for streams UI
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
        .directive('uniqueFieldValues', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    var form = elm.inheritedData('$formController');

                    ctrl.$parsers.push(function(value) {
                        // no value -> it's valid (required takes care of it)
                        if (!value) {
                            ctrl.$setValidity('uniqueFieldValues', true);
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
                        // Iterate over all fields of pattern <Pattern><numerical index starting at 0>
                        while (angular.isObject(form[attrs.uniqueFieldValues + index])) {
                            formControl = form[attrs.uniqueFieldValues + index];
                            if (ctrl !== formControl) {
                                // form field value has the same value as about to be set -> mark duplicate
                                if (formControl.$modelValue === value) {
                                    formControl.$setValidity('uniqueFieldValues', false);
                                    unique = false;
                                }
                                // form field has the old value of the field
                                if (formControl.$modelValue && formControl.$modelValue === ctrl.$modelValue) {
                                    // Record number of fields having the old value set to unset duplicate later if there is only one value recorded
                                    oldValueDupIndexes.push(index);
                                }
                            }
                            index++;
                        }

                        // Only one form field has an old value so it's not a duplicate anymore
                        if (oldValueDupIndexes.length === 1) {
                            form[attrs.uniqueFieldValues + oldValueDupIndexes[0]].$setValidity('uniqueFieldValues', true);
                        }

                        ctrl.$setValidity('uniqueFieldValues', unique);
                        return value;
                    });
                }
            };
        }]);
});
