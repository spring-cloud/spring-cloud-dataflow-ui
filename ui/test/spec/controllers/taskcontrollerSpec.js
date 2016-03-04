/*
 * Copyright 2013-2014 the original author or authors.
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
define([
  'angular',
  'angularMocks',
  'app'
], function(angular) {
  'use strict';

  angular.module('xdConf', [])
    .constant('securityInfo', {});

  describe('Unit: Testing Tasks Controllers', function() {

    var $httpBackend, $rootScope, $scope;

    beforeEach(angular.mock.module('xdConf'));
    beforeEach(angular.mock.module('xdTasksAdmin'));

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
    it('should have a ModuleController', inject(function($rootScope, $controller) {
      var controller = $controller('ModuleController', { $scope: $rootScope.$new(), $rootScope: $rootScope });
      expect(controller).toBeDefined();
    }));

    it('should have a ModuleDetailsController', inject(function($rootScope, $controller) {
      var controller = $controller('ModuleDetailsController', { $scope: $rootScope.$new(), $rootScope: $rootScope });
      expect(controller).toBeDefined();
    }));
  });
});

