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
 * Definition of the App Creation dialog controller
 *
 * @author Alex Boyko
 */
define([], function () {
    'use strict';

    return ['$scope', 'StreamMetamodelService', '$modalInstance', 'cell', 'streamInfo',
        function ($scope, metaModelService, $modalInstance, cell, streamInfo) {

            $scope.cell = cell;

            $scope.keys = Object.keys;

            $scope.decodeTextFromDSL = metaModelService.decodeTextFromDSL;
            $scope.encodeTextToDSL = metaModelService.encodeTextToDSL;

            $scope.derivedProperties = {};

            $scope.properties = {};

            var property;

            if (streamInfo) {
                property = {
                    id: 'stream-name',
                    name: 'Stream Name',
                    value: cell.attr('stream-name'),
                    defaultValue: '',
                    description: 'The name of the stream started by this app',
                    attr: 'stream-name',
                    pattern: '[\\w_]+[\\w_-]*',
                    streamNames: streamInfo.streamNames
                };
                $scope.derivedProperties[property.id] = property;
            }

            var titleProperty = cell.attr('metadata/metadata/titleProperty');
            if (titleProperty) {
                property = {
                    value: cell.attr(titleProperty),
                    defaultValue: cell.attr('metadata/name'),
                    name: 'label',
                    id: 'label',
                    description: 'Label of the app',
                    attr: titleProperty,
                    pattern: '[\\w_]+[\\w_-]*'
                };
                $scope.derivedProperties[property.id] = property;
            }


            var propertiesSchemaPromise = cell.attr('metadata').get('properties');
            $scope.cgbusy = propertiesSchemaPromise;
            propertiesSchemaPromise.then(function (schemaProperties) {
                var properties = {};
                var schema;
                Object.keys(schemaProperties).forEach(function (key) {
                    schema = schemaProperties[key];

                    // Captures what the user has specified in the DSL if anything. Search
                    // for a value under the long-name and the short-name
                    var specifiedValue;
                    // If the user specifies a name in the DSL then that 'alias' should be
                    // used when converting the properties back to text. By default the
                    // short-name will be used if the user hasn't specified anything.
                    var nameInUse = schema.name;
                    var props = cell.attr('props');
                    if (props.hasOwnProperty(key)) { // long-name, eg. 'trigger.cron'
                        specifiedValue = props[key];
                        nameInUse = key;
                    } else if (props.hasOwnProperty(schema.name)) { // short-name, eg. 'cron'
                        specifiedValue = props[schema.name];
                    }
                    
                    properties[key] = {
                        id: schema.id,
                        name: schema.name,
                        nameInUse: nameInUse,
                        description: schema.description,
                        defaultValue: schema.defaultValue,
                        type: schema.type,
                        sourceType: schema.sourceType,
                        contentType: schema.contentType,
                        contentTypeProperty: schema.contentTypeProperty,
                        options: schema.options,
                        value: specifiedValue,
                        pattern: schema.pattern,
                        valueFunc: function(newValue) {
                            if (arguments.length) {
                                this.value = newValue;
                            } else {
                                if (angular.isDefined(this.value)) {
                                    return this.value;
                                } else {
                                    return this.defaultValue;
                                }
                            }
                        }
                    };
                    
                    // Number and Boolean values may be of String type, hence convert them appropriately
                    var inputType = $scope.getInputType(properties[key]);
                    if (inputType === 'number' && properties[key].value !== undefined && properties[key].value !== null && typeof properties[key].value !== 'number') {
                        properties[key].value = Number(properties[key].value);
                    } else if (inputType === 'checkbox' && typeof properties[key].value !== 'boolean' && properties[key].value !== undefined && properties[key].value !== null) {
                        properties[key].value = typeof properties[key].value === 'string' ?
                            'true' === properties[key].value.toLowerCase() : Boolean(properties[key].value);
                    }
                });
                $scope.properties = properties;
            });

            $scope.canSubmit = function() {
                return true;
            };

            $scope.submit = function () {
                $modalInstance.close({
                    properties: $scope.properties,
                    derivedProperties: $scope.derivedProperties
                });
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

            $scope.getInputType = function(property) {
                if (property.id === 'stream-name') {
                    return property.id;
                } else if (property.type === 'java.lang.Long' || property.type === 'java.lang.Integer') {
                    return 'number';
                } else if (property.type === 'java.lang.Boolean') {
                    return 'checkbox';
                } else if (property.options) {
                    return 'select';
                } else if (property.type === 'java.lang.String') {
                    if (property.name === 'password') {
                        return 'password';
                    } else if (typeof property.contentType === 'string') {
                        return 'code';
                    }
                }
                return 'text';
            };

            $scope.getLanguageProperty = function(property) {
                return property.contentTypeProperty;
            };

            $scope.getDefaultLanguage = function(property) {
                var languageProperty = $scope.getLanguageProperty(property);
                if (languageProperty) {
                    return $scope.properties[languageProperty].defaultValue;
                } else {
                    return property.contentType;
                }
            };

        }];
});
