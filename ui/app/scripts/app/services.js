/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
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
define(['angular'], function (angular) {
    'use strict';

    return angular.module('dataflowApps.services', [])
        .factory('AppService', function ($resource, $rootScope, $log, $http) {
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
                createCompositeApp: function(appName,definition) {
                    $log.info('Creating composite app name=' + appName + ' def=' + definition);
                    return $http({
                        method: 'POST',
                        url: $rootScope.dataflowServerUrl + '/apps',
                        params: {
                            name: appName,
                            definition: definition
                        }
                    });
                },
                getAppInfo: function(appType,appName) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.dataflowServerUrl + '/apps/'+appType+'/'+appName
                    });
                },
                registerApp: function(type, name, uri, force) {
                    return $resource($rootScope.dataflowServerUrl + '/apps/' + type + '/' + name, {}, {
                        registerApp: {
                            method: 'POST',
                            params: {
                                uri: uri,
                                force: force ? true : false
                            }
                        }
                    }).registerApp();
                },
                unregisterApp: function(type, name) {
                    return $resource($rootScope.dataflowServerUrl + '/apps/' + type + '/' + name, {}, {
                        unregisterApp: {
                            method: 'DELETE'
                        }
                    }).unregisterApp();
                },
                bulkImportApps: function(uri, appsProperties, force) {
                    return $resource($rootScope.dataflowServerUrl + '/apps', {}, {
                        bulkImportApps: {
                            method: 'POST',
                            params: {
                                uri: uri,
                                apps: appsProperties ? appsProperties.join('\n') : null,
                                force: force ? true : false
                            }
                        }
                    }).bulkImportApps();
                }
            };
        });
});
