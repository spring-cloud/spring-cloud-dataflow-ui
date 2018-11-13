import { browser, by, element, protractor } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
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
    return element(by.css('#table'));
  }

  /**
   * Get all the rows of the table
   * @returns {ElementArrayFinder}
   */
  getTableRows() {
    return element.all(by.css('#table tbody tr'));
  }

  /**
   * Unregister one application
   * @param {number} index
   */
  setUnregister(index: number) {
    element(by.name(`app-remove${index}`)).click();
    browser.sleep(100);
    element(by.name(`app-unregister`)).click();
    browser.sleep(100);
  }

  /**
   * Unregister all the applications of the table
   */
  setUnregisters() {
    element(by.css(`app-master-checkbox input`)).click();
    browser.sleep(200);
    element(by.css(`#dropdown-actions button`)).click();
    browser.sleep(100);
    element(by.css(`#unregister-apps`)).click();
    browser.sleep(100);
    element(by.name(`app-unregister`)).click();
    browser.sleep(100);
  }

  /**
   * Get the sort header
   * @param sort
   * @param order
   * @returns {ElementFinder}
   */
  getSort(sort: string, order: string) {
    return element(by.css(`#sort-${sort} a .${order}`));
  }

  /**
   * Set the sort
   * @param column
   */
  setSort(column: string) {
    element(by.css(`#sort-${column} a`)).click();
    browser.sleep(100);
  }

  /**
   * Get Filters box
   * @returns {ElementFinder}
   */
  getFilters() {
    return element(by.css('#filters'));
  }

  /**
   * Navigate to the register app (dropdown action)
   */
  navigateToRegisterApp() {
    element(by.css('.heading .dropdown button')).click();
    browser.sleep(100);
    element.all(by.css('.heading .dropdown ul li a')).first().click();
    browser.sleep(100);
  }

  getAdd() {
    return element(by.css('app-page-head-actions button'));
  }

  /**
   * Set filters
   * @param {string} q
   * @param {string} type
   */
  setFilters(q: string, type: number) {
    const field = element(by.css('#filter-q'));
    field.clear().then(() => {
      browser.sleep(200);
      field.sendKeys('a');
      field.sendKeys(protractor.Key.BACK_SPACE);
      if (q) {
        field.sendKeys(q);
      }
      browser.sleep(100);
      this.getFilters().element(by.css('.filter-dropdown-toggle')).click();
      browser.sleep(100);
      this.getFilters().all(by.css('.list-bar-dropdown .dropdown-menu a')).get(type).click();
      browser.sleep(100);
    });
  }

  /**
   * Get filter button submit
   * @returns {ElementFinder}
   */
  getFilterSubmit() {
    return element(by.css(`#search-submit`));
  }
}
