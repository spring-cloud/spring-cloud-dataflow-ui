/*
 * Copyright 2013-2016 the original author or authors.
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
 * Definition of Dashboard streams applications.
 *
 * @author Ilayaperumal Gopinathan
 * @author Alex Boyko
 */
define([
  'angular',
  'uiRouter',
  'ngResource',
  'cgBusy',
  'ngAnimate',
  'ngGrowl',
  'ngBootstrap',
  'ngCookies',
  './controllers',
  './services',
  './directives',
  '../app/services',
  '../shared/services',
  '../shared/interceptors'
], function (angular) {
  'use strict';
  return angular.module('dataflowStreams', [
    'dataflowStreams.services',
    'dataflowStreams.controllers',
    'dataflowStreams.directives',
    'dataflowShared.services',
    'dataflowShared.interceptors',
    'dataflowApps.services',
    'ui.router',
    'ngResource',
    'ngAnimate',
    'cgBusy',
    'angular-growl',
    'ui.bootstrap',
    'ngCookies'
  ]);
});
