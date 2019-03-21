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
 * Definition of main Dashboard controllers.
 *
 * @author Alex Boyko
 * @author Gunnar Hillert
 */
define(['angular'], function (angular) {
    'use strict';

    return angular.module('dataflowApps.controllers', [])
        .controller('AppsController',
            ['$scope', '$injector', function ($scope, $injector) {
                require(['app/controllers/apps'], function (appsController) {
                    $injector.invoke(appsController, this, {'$scope': $scope});
                });
            }])
        .controller('RegisterAppsController',
            ['$scope', '$injector', function ($scope, $injector) {
                require(['app/controllers/register-apps'], function (registerAppsController) {
                    $injector.invoke(registerAppsController, this, {'$scope': $scope});
                });
            }]);
});
