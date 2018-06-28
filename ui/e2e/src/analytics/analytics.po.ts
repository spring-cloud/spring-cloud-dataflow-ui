import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for analytics page.
 *
 * @author Glenn Renfro
 */
export class AnalyticsPage {

  /**
   * Navigates to the analytics/dashboard page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/analytics/dashboard');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
}
