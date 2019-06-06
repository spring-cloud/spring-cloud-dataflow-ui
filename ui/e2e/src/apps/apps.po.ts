import { browser, by, element, protractor, ElementFinder } from 'protractor';
import { ElementHelper } from '../utils/element-helpers';

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
  async getHeaderText() {
    return element(await ElementHelper.getElementOrWait(by.css('app-page-head-title h1'))).getText();
  }

  async getSecondHeaderText() {
    return element.all(await ElementHelper.getElementOrWait(by.css('app-page-head-title h1'))).get(1).getText();
  }

  /**
   * Get the empty box
   * @returns {ElementFinder}
   */
  async getEmpty(): Promise<ElementFinder> {
    const e = await ElementHelper.getElementOrWait(by.css('#empty'));
    console.log('eeeee', e);
    return element(e);
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
  getTableRows(): any | ElementFinder[] {
    const e = ElementHelper.getElementOrWait(by.css('#table tbody tr'));
    return e;
    return element.all(by.css('#table tbody tr'));
  }

  async getTableRowCount(): Promise<number> {
    const e = await ElementHelper.getElementOrWait(by.css('#table tbody tr'));
    return element.all(e).count();
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
  async setUnregisters() {
    await ElementHelper.waitForSpinners();
    await ElementHelper.clickElement(by.css(`app-master-checkbox input`), false, undefined);
    await ElementHelper.clickElement(by.css(`#dropdown-actions button`), false, undefined);
    await ElementHelper.clickElement(by.css(`#unregister-apps`), false, undefined);
    await ElementHelper.clickElement(by.name(`app-unregister`), false, undefined);
    await ElementHelper.waitForSpinners();
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

  /**
   * Set filters
   * @param {string} q
   * @param {string} type
   */
  setFilters(q: string, type: number) {
    const field = element(by.css('#q'));
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
      this.getFilters().all(by.css('.filter-dropdown .dropdown-menu a')).get(type).click();
      browser.sleep(100);
    });
  }

  /**
   * Get filter button submit
   * @returns {ElementFinder}
   */
  getFilterSubmit() {
    return element(by.css(`#submit`));
  }
}
