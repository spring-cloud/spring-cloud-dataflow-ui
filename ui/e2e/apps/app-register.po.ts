import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Glenn Renfro
 */
export class AppRegisterPage {

  /**
   * Navigates to the apps/register-apps page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/apps/register-apps');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-root h1')).getText();
  }
}
