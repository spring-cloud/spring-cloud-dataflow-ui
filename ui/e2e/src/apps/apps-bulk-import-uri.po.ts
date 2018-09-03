import { browser, by, element, protractor } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Damien Vitrac
 */
export class AppsBulkImportUriPage {

  /**
   * Navigates to the apps/register-apps page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/apps/add/import-from-uri');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('.page-step-2-head h1')).getText();
  }

  /**
   * Set URI
   * @param {string} uri
   */
  setUri(uri: string) {
    element(by.css('#uriInput')).sendKeys(uri);
    browser.sleep(400);
  }

  /**
   * Get the submit button
   * @returns {ElementFinder}
   */
  getSubmit() {
    return element(by.name(`submit`));
  }

  /**
   * Get the cancel button
   */
  getCancel() {
    return element(by.name(`cancel`));
  }

}
