import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for runtime page.
 *
 * @author Glenn Renfro
 */
export class RuntimePage {

  /**
   * Navigates to the runtime/apps page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/runtime/apps');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }
}
