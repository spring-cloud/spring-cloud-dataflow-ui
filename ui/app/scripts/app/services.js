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
 * SCDF Module services.
 *
 * @author Andy Clement
 * @author Alex Boyko
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('xdAppsAdmin.services', [])
        .factory('ModuleService', function ($resource, $rootScope, $log, $http) {
            return {
                getDefinitions: function (pageable) {
                    var params = {};
                    if (!pageable) {
                        $log.info('Getting all module definitions.');
                    }
                    else {
                        // $log.info('Getting paged module definitions', pageable);
                        params = {
                            'page': pageable.pageNumber,
                            'size': pageable.pageSize
                        };
                    }
                    return $resource($rootScope.xdAdminServerUrl + '/modules', params, {
                        query: {
                            method: 'GET'
                        }
                    }).get();
                },
                createCompositeModule: function(moduleName,definition) {
                    $log.info('Creating composite module name=' + moduleName + ' def=' + definition);
                    return $http({
                        method: 'POST',
                        url: $rootScope.xdAdminServerUrl + '/modules',
                        params: {
                            name: moduleName,
                            definition: definition
                        }
                    });
                },
                getModuleInfo: function(moduleType,moduleName) {
                    return $http({
                        method: 'GET',
                        url: $rootScope.xdAdminServerUrl + '/modules/'+moduleType+'/'+moduleName
                    });
                },
                registerModule: function(type, name, uri, force) {
                    return $resource($rootScope.xdAdminServerUrl + '/modules/' + type + '/' + name, {}, {
                        registerModule: {
                            method: 'POST',
                            params: {
                                uri: uri,
                                force: force ? true : false
                            }
                        }
                    }).registerModule();
                },
                unregisterModule: function(type, name) {
                    return $resource($rootScope.xdAdminServerUrl + '/modules/' + type + '/' + name, {}, {
                        unregisterModule: {
                            method: 'DELETE'
                        }
                    }).unregisterModule();
                }
            };
        });
});
