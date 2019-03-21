/*
 * Copyright 2013-2016 the original author or authors.
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
define([
  'angular',
  'angularMocks',
  'app'
], function(angular) {
  'use strict';

  angular.module('dataflowConf', [])
    .constant('securityInfo', {});

  describe('Unit: Testing Tasks Controllers', function() {

    var $httpBackend, $rootScope, $scope;

    beforeEach(angular.mock.module('dataflowConf'));
    beforeEach(angular.mock.module('dataflowTasks'));

    beforeEach(inject(function(_$httpBackend_, _$rootScope_) {
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      $scope = $rootScope.$new();

      $httpBackend.expectGET(/.*/).respond('');
      $httpBackend.expectGET(/.*/).respond('');
    }));
    it('should have a TaskLaunchController', inject(function($rootScope, $controller) {
      var controller = $controller('TaskLaunchController', { $scope: $rootScope.$new(), $rootScope: $rootScope });
      expect(controller).toBeDefined();
    }));
    it('should have a TaskAppsController', inject(function($rootScope, $controller) {
      var controller = $controller('TaskAppsController', { $scope: $rootScope.$new(), $rootScope: $rootScope });
      expect(controller).toBeDefined();
    }));

    it('should have a AppDetailsController', inject(function($rootScope, $controller) {
      var controller = $controller('AppDetailsController', { $scope: $rootScope.$new(), $rootScope: $rootScope });
      expect(controller).toBeDefined();
    }));
  });
});

