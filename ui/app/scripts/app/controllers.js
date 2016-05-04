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
 * Definition of main Dashboard controllers.
 *
 * @author Alex Boyko
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('xdAppsAdmin.controllers', [])
        .controller('ModulesController',
            ['$scope', '$injector', function ($scope, $injector) {
                require(['app/controllers/modules'], function (modulesController) {
                    $injector.invoke(modulesController, this, {'$scope': $scope});
                });
            }])
        .controller('RegisterModulesController',
            ['$scope', '$injector', function ($scope, $injector) {
                require(['app/controllers/register-modules'], function (registerModulesController) {
                    $injector.invoke(registerModulesController, this, {'$scope': $scope});
                });
            }]);
});
