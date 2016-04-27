/*
 * Copyright 2014-2016 the original author or authors.
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

'use strict';

/**
 * @author Gunnar Hillert
 */
describe('Tests for creating a new Task Definition from a Module', function() {

  describe('When I navigate to the Module Create Definition URL for the "timestamp" module - "#/tasks/modules/timestamp/create-definition"', function() {

    it('The page title should be "Module Details"', function() {
      browser.get('#/tasks/modules/timestamp/create-definition');
      expect(browser.getCurrentUrl()).toContain('#/tasks/modules/timestamp')
      expect(browser.getTitle()).toBe('Module Create Definition');
    });
    it('The "Definition Name" input field should be in error state as no name is specified yet', function() {
      var formGroup = $('#definition-name-form-group');
      expect(formGroup.getAttribute('class')).toMatch('has-feedback');
      expect(formGroup.getAttribute('class')).toMatch('has-warning');
    });
    it('When entering a "Definition Name" input field should not be in error state', function() {
      element(by.model('taskDefinition.name')).sendKeys('hello');

      var formGroup = $('#definition-name-form-group');
      expect(formGroup.getAttribute('class')).not.toMatch('has-feedback');
      expect(formGroup.getAttribute('class')).not.toMatch('has-warning');
    });
    it('When entering a "Definition Name" that is the same name as the module name,' +
       'then the input field should be in error state', function() {

      var inputField = $('#definitionName');

      inputField.clear();
      inputField.sendKeys('timestamp');

      var formGroup = $('#definition-name-form-group');

      expect(formGroup.getAttribute('class')).toMatch('has-feedback');
      expect(formGroup.getAttribute('class')).toMatch('has-warning');
    });
    //it('The "Password" field should be of type "password"', function() {
    //  var passwordField = $('#password');
    //  expect(passwordField.getAttribute('type')).toMatch('password');
    //});
    it('if the user clicks the "back" button, the module list page should be loaded', function() {
      var backButton = element(by.css('#back-button'));
      expect(backButton.isPresent()).toBe(true);
      expect(backButton.getText()).toEqual('Back');
      backButton.click();
      expect(browser.getCurrentUrl()).toContain('/tasks/modules');
    });
  });
});
