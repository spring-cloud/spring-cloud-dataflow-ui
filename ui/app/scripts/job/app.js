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
 * Definition of Dashboard jobs app module.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
define([
  'angular',
  'uiRouter',
  'ngResource',
  'cgBusy',
  'ngGrowl',
  'ngAnimate',
  'pagination',
  'angularHighlightjs',
  './controllers',
  './services',
  '../directives',
  '../filters',
  '../shared/services',
  'model/pageable',
  '../shared/interceptors'
], function (angular) {
  'use strict';
  return angular.module('dataflowJobs', [
    'dataflowJobs.services',
    'dataflowJobs.controllers',
    'dataflowShared.services',
    'dataflowShared.interceptors',
    'dataflowMain.directives',
    'dataflowMain.filters',
    'ui.router',
    'ngResource',
    'ngAnimate',
    'angularUtils.directives.dirPagination',
    'cgBusy',
    'hljs',
    'angular-growl'
  ]);
});
