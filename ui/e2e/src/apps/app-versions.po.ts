import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for app details page.
 *
 * @author Damien Vitrac
 */
export class AppVersionsModal {

  /**
   * Retrieves text of the title.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('.modal-header h4')).getText();
  }

  /**
   * Get Modal
   * @returns {ElementFinder}
   */
  getModal() {
    return element(by.css('#app-versions'));
  }

  /**
   * Get footer cancel button
   * @returns {ElementFinder}
   */
  getFooterCancel() {
    return element(by.css('#app-versions .modal-footer button'));
  }

  /**
   * Get header cancel button
   * @returns {ElementFinder}
   */
  getHeaderCancel() {
    return element(by.css('#app-versions .modal-header .close'));
  }

  /**
   * Get table rows
   * @returns {ElementArrayFinder}
   */
  getTableRows() {
    return element.all(by.css('#app-versions #table-versions tbody tr'));
  }

  /**
   * Get the buttons to a row
   * @param {number} index
   * @returns {ElementArrayFinder}
   */
  getRowButtons(index: number) {
    return this.getTableRows().get(index).all(by.css('.actions button'));
  }

  /**
   * Set a default version to a row
   * Validate the confirm modal
   * @param {number} index
   */
  setMakeDefault(index: number) {
    this.getRowButtons(index).get(0).click();
    browser.sleep(400);
    element(by.css('#modal-confirm')).element(by.buttonText('Validate')).click();
    browser.sleep(200);
  }

  /**
   * Destroy an application
   * Validate the confirm modal
   * @param {number} index
   */
  setDestroy(index: number) {
    this.getRowButtons(index).get(1).click();
    browser.sleep(400);
    element(by.css('#modal-confirm')).element(by.buttonText('Unregister version')).click();
    browser.sleep(200);
  }

}
