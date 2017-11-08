import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Glenn Renfro
 */
export class AppsPage {

  /**
   * Navigates to the home page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('/');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
}
