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
describe('Tests for creating a new Task Definition from an App', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
  });
  afterEach(function() {
    browser.ignoreSynchronization = false;
  });
  describe('When I navigate to the App Create Definition URL for the "timestamp" application - "#/tasks/apps/timestamp/create-definition"', function() {
    it('We need to install the timestamp task', function() {
      browser.get('#/apps/apps').then(function() {
        browser.driver.sleep(8000);

        var registerAppsButton = element(by.css('#registerAppsButton'));

        browser.wait(protractor.ExpectedConditions.elementToBeClickable(registerAppsButton), 10000)
            .then ( function () {
              browser.driver.sleep(2000);
              registerAppsButton.click().then(function() {
                browser.driver.sleep(1000);
                var nameInputField = element(by.css('#name_0'));
                var typeSelectBox = element(by.css('#type_0'));
                var uriInputField = element(by.css('#uri_0'));

                nameInputField.clear();
                nameInputField.sendKeys('timestamp');

                typeSelectBox.element(by.cssContainingText('option', 'Task')).click();

                uriInputField.clear();
                uriInputField.sendKeys('maven://org.springframework.cloud.task.app:timestamp-task:1.0.0.BUILD-SNAPSHOT');

                browser.driver.sleep(4000);
                element(by.css('#submit-button')).click()
                browser.driver.sleep(2000);
              });
            });
      });
    });
    it('The page title should be "App Details"', function() {
      browser.get('#/tasks/apps/timestamp/create-definition');
      expect(browser.getCurrentUrl()).toContain('#/tasks/apps/timestamp')
      expect(browser.getTitle()).toBe('App Create Definition');
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
    it('When entering a "Definition Name" that is the same name as the app name,' +
       'then the input field should be in error state', function() {

      var inputField = $('#definitionName');

      inputField.clear();
      inputField.sendKeys('timestamp');

      var formGroup = $('#definition-name-form-group');

      expect(formGroup.getAttribute('class')).toMatch('has-feedback');
      expect(formGroup.getAttribute('class')).toMatch('has-warning');
    });

    it('if the user clicks the "back" button, the application list page should be loaded', function() {
      browser.driver.sleep(4000);
      var backButton = element(by.css('#back-button'));
      expect(backButton.isPresent()).toBe(true);
      expect(backButton.getText()).toEqual('Back');

      //backButton.click().then(function() {
      //    expect(browser.getCurrentUrl()).toContain('/tasks/apps');
      //  });
    });
  });
});
