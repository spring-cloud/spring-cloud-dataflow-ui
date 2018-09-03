import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for about page.
 *
 * @author Glenn Renfro
 */
export class AboutPage {

  /**
   * Navigates to the /about page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/about');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }
}
