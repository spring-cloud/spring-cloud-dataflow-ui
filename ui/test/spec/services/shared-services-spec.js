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
define([
  'angular',
  'angularMocks',
  'app'
], function(angular) {
  'use strict';

  describe('Unit: Testing Data Flow Shared Services', function() {
    beforeEach(function() {
      angular.mock.module('dataflowMain');
    });

    it('The app name should be retrieved from a definition with parameters.', inject(function(DataflowUtils) {
      expect(DataflowUtils.getAppNameFromJobDefinition).toBeDefined();
      expect(DataflowUtils.getAppNameFromJobDefinition('myMod --param=1234')).toEqual('myMod');
    }));

    it('The app name should be retrieved from a definition without parameters.', inject(function(DataflowUtils) {
      expect(DataflowUtils.getAppNameFromJobDefinition).toBeDefined();
      expect(DataflowUtils.getAppNameFromJobDefinition('myMod2')).toEqual('myMod2');
    }));
    it('Getting a app name from an undefined definition should cause an error.', inject(function(DataflowUtils) {
      expect(DataflowUtils.getAppNameFromJobDefinition).toBeDefined();
      expect(function() {
        DataflowUtils.getAppNameFromJobDefinition();
      }).toThrow(new Error('jobDefinition must be defined.'));
    }));
    it('Getting a app name from an undefined definition should cause an error 2.', inject(function(DataflowUtils) {
      expect(DataflowUtils.getAppNameFromJobDefinition).toBeDefined();
      expect(function() {
        DataflowUtils.getAppNameFromJobDefinition(undefined);
      }).toThrow(new Error('jobDefinition must be defined.'));
    }));
    it('Getting a app name from a null definition should cause an error.', inject(function(DataflowUtils) {
      expect(DataflowUtils.getAppNameFromJobDefinition).toBeDefined();
      expect(function() {
        DataflowUtils.getAppNameFromJobDefinition(null);
      }).toThrow(new Error('jobDefinition must be defined.'));
    }));
  });
});

