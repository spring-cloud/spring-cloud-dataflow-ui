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

'use strict';

/**
 * @author Gunnar Hillert
 */
describe('Tests', function() {
  beforeEach(function() {
    browser.get('/');
    browser.ignoreSynchronization = true;
  });
  afterEach(function() {
    browser.ignoreSynchronization = false;
  });

  describe('When I navigate to the root URL "/"', function() {
    it('the app should redirect to "#/apps/apps"', function() {
      browser.get('/');
      browser.driver.sleep(2000);
      expect(browser.getCurrentUrl()).toContain('/#/apps/apps')
      expect(browser.getTitle()).toBe('Apps');
    });
  });

  describe('When I navigate to some non-existing URL, e.g. "/#/foobar"', function() {
    it('the app should redirect to "#/apps/apps"', function() {
      browser.get('/#/foobar');
      expect(browser.getCurrentUrl()).toContain('/apps/apps');
    });
  });

  //Apps tab

  describe('When I navigate to "/tasks/apps" (default installation)', function() {

    it('First delete all Apps', function() {
      browser.get('#/apps/apps').then(function() {
        browser.driver.sleep(2000);
        var selectAllAppsCheckbox = element(by.css('#selectAllAppsCheckbox'));

        selectAllAppsCheckbox.click().then(
          function(value) {
            //console.log(value, value);
            //browser.driver.sleep(4000);
            var unregisterSelectedAppsButton = element(by.css('#unregisterSelectedAppsButton'));

            unregisterSelectedAppsButton.getAttribute('disabled').then(function(disabled) {
              if (!disabled) {
                unregisterSelectedAppsButton.click().then(function(value) {
                  browser.driver.sleep(2000);
                  var unregisterAllAppsConfirmationButton = element(by.css('#unregisterAllAppsConfirmationButton'));
                  unregisterAllAppsConfirmationButton.click();
                });
              }
            });
          });
      });
    });

    it('there should be 3 tabs of which one is active', function() {
      browser.get('#/tasks/apps').then(function() {
        expect(element.all(by.css('#dataflow-tasks ul.nav-tabs li')).count()).toEqual(3);
        expect(element.all(by.css('#dataflow-tasks ul.nav-tabs li.active')).count()).toEqual(1);
      });
    });
    it('the active tab should be labelled "Apps"', function() {
      browser.get('#/tasks/apps').then(function() {
        expect(element(by.css('#dataflow-tasks ul li.active a')).getText()).toEqual('Apps');
      });
    });
    it('there should be 0 task modules being listed', function() {
      browser.get('#/tasks/apps').then(function() {
        browser.driver.sleep(2000);
        expect(element.all(by.css('#dataflow-tasks table tbody tr')).count()).toBe(0);
      });
    });
    it('We need to install the timestamp task', function() {
      browser.get('#/apps/apps').then(function() {
        browser.driver.sleep(3000);
        var registerAppsButton = element(by.css('#registerAppsButton'));
        registerAppsButton.click().then(function(value) {
          browser.driver.sleep(1000);
          var nameInputField = element(by.css('#name_0'));
          var typeSelectBox = element(by.css('#type_0'));
          var uriInputField = element(by.css('#uri_0'));

          nameInputField.clear();
          nameInputField.sendKeys('timestamp');

          typeSelectBox.element(by.cssContainingText('option', 'Task')).click();

          uriInputField.clear();
          uriInputField.sendKeys('maven://org.springframework.cloud.task.app:timestamp-task:1.0.0.BUILD-SNAPSHOT');

          browser.driver.sleep(2000);
          element(by.css('#submit-button')).click()
          browser.driver.sleep(2000);
        });
      });
    });
    it('there should a task app named timestamp', function() {
      browser.get('#/tasks/apps');
      browser.driver.sleep(2000);
        // Check timestamp on the list
	expect(element.all(by.css('#dataflow-tasks table tbody tr')).filter(function(e) {
           return e.all(by.css('td:nth-child(1)')).getText().then(function (text) {
             return (''+text === 'timestamp');
           });
         }).count()).toEqual(1);
    });
    it('When I click on the Create Definition button for module timestamp, ' +
       'the page should redirect to /tasks/apps/timestamp/create-definition', function() {
      browser.get('#/tasks/apps').then(function() {
        browser.sleep(3000);
        expect(element(by.css('#dataflow-tasks table tbody tr td:nth-child(3) button')).getAttribute('title')).toMatch('Create Definition');

        // Click create definition button in the timestamp row
	element.all(by.css('#dataflow-tasks table tbody tr')).filter(function(e) {
           return e.all(by.css('td:nth-child(1)')).getText().then(function (text) {
             return (''+text === 'timestamp');
           });
         }).first().all(by.css('td:nth-child(3) button')).click();

        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain('/tasks/apps/timestamp/create-definition');
      });
    });
    it('When I click on the Details button for app timestamp, ' +
       'the page should redirect to /tasks/apps/timestamp', function() {
       browser.get('#/tasks/apps').then(function() {

         browser.sleep(2000);

         expect(element(by.css('#dataflow-tasks table tbody tr:nth-child(1) td:nth-child(4) button')).getAttribute('title')).toMatch('Details');
        // element(by.css('#dataflow-tasks table tbody tr:nth-child(6) td:nth-child(4) button')).click();
        // Click details button in the timestamp row
	element.all(by.css('#dataflow-tasks table tbody tr')).filter(function(e) {
           return e.all(by.css('td:nth-child(1)')).getText().then(function (text) {
             return (''+text === 'timestamp');
           });
         }).first().all(by.css('td:nth-child(4) button')).click();

         browser.sleep(2000);
         expect(browser.getCurrentUrl()).toContain('/tasks/apps/timestamp');
       });
     });
  });

  //Definitions tab

  describe('When I navigate to "/tasks/definitions"', function() {
    it('there should be 3 tabs of which one is active', function() {
      browser.get('#/tasks/definitions');
      expect(element.all(by.css('#dataflow-tasks ul li')).count()).toEqual(3);
      expect(element.all(by.css('#dataflow-tasks ul li.active')).count()).toEqual(1);
    });
    it('the active tab should be labelled "Definitions"', function() {
      browser.get('#/tasks/definitions');
      expect(element(by.css('#dataflow-tasks ul li.active a')).getText()).toEqual('Definitions');
    });
  });

  //Executions tab

  describe('When I navigate to "/jobs/executions"', function() {
    it('there should be 1 tab which is active', function() {
      browser.get('#/jobs/executions');
      expect(element.all(by.css('#dataflow-jobs ul li')).count()).toEqual(1);
      expect(element.all(by.css('#dataflow-jobs ul li.active')).count()).toEqual(1);
    });
    it('the active tab should be labelled "Executions"', function() {
      browser.get('#/jobs/executions');
      expect(element(by.css('#dataflow-jobs ul li.active a')).getText()).toEqual('Executions');
    });
  });

  //About page

  describe('When I navigate to "/#/about"', function() {
    it('the main header should be labelled "About"', function() {
      browser.get('#/about');
      expect(element(by.css('#dataflow-content h1')).getText()).toEqual('About');
    });
  });
});
