import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for jobs page.
 *
 * @author Glenn Renfro
 */
export class JobsPage {

  /**
   * Navigates to the jobs/executions page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/jobs/executions');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }
}
