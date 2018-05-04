import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for streams page.
 *
 * @author Glenn Renfro
 */
export class StreamsPage {

  /**
   * Navigates to the streams/definitions page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    browser.waitForAngularEnabled(false);
    return browser.get('#/streams/definitions');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('≈')).getText();
  }

}
