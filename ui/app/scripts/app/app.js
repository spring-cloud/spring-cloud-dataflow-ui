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
 * Definition of the main Dashboard Angular module.
 *
 * @author Alex Boyko
 * @author Gunnar Hillert
 */
define([
    'angular',
    'uiRouter',
    'ngResource',
    'cgBusy',
    'ngAnimate',
    'ngGrowl',
    'ngclipboard',
    'ngBootstrap',
    'ngIndeterminate',
    './controllers',
    './services',
    '../shared/services',
    '../shared/interceptors'
], function (angular) {
    'use strict';
    return angular.module('dataflowApps', [
        'dataflowApps.services',
        'dataflowApps.controllers',
        'dataflowShared.services',
        'dataflowShared.interceptors',
        'dataflowMain.filters',
        'ui.router',
        'ngResource',
        'ngAnimate',
        'cgBusy',
        'angular-growl',
        'ui.bootstrap',
        'ui.indeterminate'
    ]);
});
