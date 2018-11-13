import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Damien Vitrac
 */
export class AppsAddPage {

  /**
   * Navigates to the apps/register-apps page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/apps/add');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }

  getActions() {
    return element.all(by.css('.page-step-1 li a'));
  }

  /**
   * Get the cancel button
   */
  getCancel() {
    return element(by.css(`app-page-head-back a`));
  }

}
