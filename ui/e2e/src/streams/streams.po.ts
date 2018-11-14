import { browser, by, element, protractor } from 'protractor';

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
    return browser.get('#/streams/definitions');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('app-page-head-title h1')).getText();
  }

  /**
   * Get the empty box
   * @returns {ElementFinder}
   */
  getEmpty() {
    return element(by.css('#empty'));
  }

  /**
   * Get the table results
   * @returns {ElementFinder}
   */
  getTable() {
    return element(by.css('#streamDefinitionsTable'));
  }

  /**
   * Get all the rows of the table
   * @returns {ElementArrayFinder}
   */
  getTableRows() {
    return element.all(by.css('#streamDefinitionsTable tbody tr'));
  }

  /**
   * Get Filters box
   * @returns {ElementFinder}
   */
  getFilters() {
    return element(by.css('#filters'));
  }

  /**
   * Set filters
   * @param {string} q
   */
  setFilters(q: string) {
    const field = element(by.css('#q'));
    field.clear().then(() => {
      browser.sleep(200);
      field.sendKeys('a');
      field.sendKeys(protractor.Key.BACK_SPACE);
      if (q) {
        field.sendKeys(q);
      }
      browser.sleep(200);
    });
  }

  /**
   * Get filter button submit
   * @returns {ElementFinder}
   */
  getFilterSubmit() {
    return element(by.css(`#search-submit`));
  }

  /**
   * Unregister all the applications of the table
   */
  setDestroys() {
    element(by.css(`app-master-checkbox input`)).click();
    browser.sleep(200);
    element(by.css(`#dropdown-actions button`)).click();
    browser.sleep(100);
    element(by.css(`#destroy-streams`)).click();
    browser.sleep(100);
    element(by.css(`#btn-destroy`)).click();
    browser.sleep(100);
  }


}
