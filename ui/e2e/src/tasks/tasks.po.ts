import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for tasks page.
 *
 * @author Glenn Renfro
 */
export class TasksPage {

  /**
   * Navigates to the tasks/definitions page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/tasks/definitions');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }

}
