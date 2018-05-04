import { browser, by, element } from 'protractor';

/**
 * E2E Page Object for apps page.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
export class AppsRegisterPage {

  /**
   * Navigates to the apps/register-apps page.
   * @returns {wdpromise.Promise<any>}
   */
  navigateTo() {
    return browser.get('#/apps/add/register');
  }

  /**
   * Retrieves text of the title for the page.
   * @returns {any}
   */
  getHeaderText() {
    return element(by.css('.step2 h1')).getText();
  }

  /**
   * Set form
   * @param {number} index
   * @param {string} name
   * @param {string} type
   * @param {string} uri
   * @param {string} metaUri
   */
  setForm(index: number, name: string, type: string, uri: string, metaUri: string) {
    element(by.name(`name${index}`)).sendKeys(name);
    element(by.name(`type${index}`)).sendKeys(type);
    element(by.name(`uri${index}`)).sendKeys(uri);
    element(by.name(`metaDataUri${index}`)).sendKeys(metaUri);
    browser.sleep(100);
  }

  /**
   * Get the submit button
   * @returns {ElementFinder}
   */
  getSubmit() {
    return element(by.name(`register`));
  }

  /**
   * Get the add button
   * @returns {ElementFinder}
   */
  getAdd() {
    return element(by.name(`add-form`));
  }

  /**
   * Get the cancel button
   * @returns {ElementFinder}
   */
  getCancel() {
    return element(by.name(`cancel`));
  }

}
