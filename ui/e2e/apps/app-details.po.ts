import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for app details page.
 *
 * @author Damien Vitrac
 */
export class AppDetailsPage {

  /**
   * Navigates to the app details page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo(type, name) {
    return browser.get(`#/apps/${type}/${name}`);
  }

  /**
   * Retrieves text of the title.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('.heading h1')).getText();
  }

  /**
   * Retrieves text of the app details info.
   * @returns {any}
   */
  getInfo() {
    return element(by.css('.app-details-info')).getText();
  }

  /**
   * Retrieves properties of the app details info.
   * @returns {any}
   */
  getProperties() {
    return element.all(by.css('#table-properties tbody tr'));
  }

  /**
   * Click on cancel button.
   * @returns {any}
   */
  getCancel() {
    return element(by.css('#back-button'));

  }

}
