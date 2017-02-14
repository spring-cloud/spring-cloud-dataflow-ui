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
 * SCDF App services.
 *
 * @author Andy Clement
 * @author Alex Boyko
 * @author Gunnar Hillert
 */
define(['angular', 'lodash'], function (angular, _) {
    'use strict';

    return angular.module('dataflowApps.services', [])
        .factory('AppService', function ($resource, $rootScope, $log, $http) {

            var listeners = [];

            // Debounce notifying listeners in case of multiple register/unregister single app calls
            var notifyListeners = _.debounce(function() {
                listeners.forEach(function (listener) {
                    if (angular.isFunction(listener.changed)) {
                        listener.changed();
                    }
                });
            }, 100);

            return {
                getDefinitions: function (pageable) {
                    var params = {};
                    if (!pageable) {
                        $log.info('Getting all app definitions.');
                    }
                    else {
                        // $log.info('Getting paged app definitions', pageable);
                        params = {
                            'page': pageable.pageNumber,
                            'size': pageable.pageSize
                        };
                    }
                    return $resource($rootScope.dataflowServerUrl + '/apps', params, {
                        query: {
                            method: 'GET'
                        }
                    }).get();
                },
                getAppStarters: function () {
                    return $resource($rootScope.dataflowServerUrl + '/app-starters', {}, {
                        query: {
                            method: 'GET'
                        }
                    }).get();
                },
                createCompositeApp: function(appName,definition) {
                    $log.info('Creating composite app name=' + appName + ' def=' + definition);
                    var request = $http({
                        method: 'POST',
                        url: $rootScope.dataflowServerUrl + '/apps',
                        params: {
                            name: appName,
                            definition: definition
                        }
                    });
                    request.then(function() {
                        notifyListeners();
                    });
                    return request;
                },
                getAppInfo: function(appType,appName) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.dataflowServerUrl + '/apps/'+appType+'/'+appName
                    });
                },
                registerApp: function(type, name, uri, force) {
                    var request = $resource($rootScope.dataflowServerUrl + '/apps/' + type + '/' + name, {}, {
                        registerApp: {
                            method: 'POST',
                            params: {
                                uri: uri,
                                force: force ? true : false
                            }
                        }
                    }).registerApp();
                    request.$promise.then(function() {
                        notifyListeners();
                    });
                    return request;
                },
                unregisterApp: function(type, name) {
                    var request = $resource($rootScope.dataflowServerUrl + '/apps/' + type + '/' + name, {}, {
                        unregisterApp: {
                            method: 'DELETE'
                        }
                    }).unregisterApp();
                    request.$promise.then(function() {
                        notifyListeners();
                    });
                    return request;
                },
                bulkImportApps: function(uri, appsProperties, force) {
                    var request = $resource($rootScope.dataflowServerUrl + '/apps', {}, {
                        bulkImportApps: {
                            method: 'POST',
                            params: {
                                uri: uri,
                                apps: appsProperties ? appsProperties.join('\n') : null,
                                force: force ? true : false
                            }
                        }
                    }).bulkImportApps();
                    request.$promise.then(function() {
                        notifyListeners();
                    });
                    return request;
                },
                addListener: function(listener) {
                    listeners.push(listener);
                },
                removeListener: function(listener) {
                    var index = listeners.indexOf(listener);
                    if (index >= 0) {
                        listeners.splice(index);
                    }
                }
            };
        });
});
