import { by, element } from 'protractor';

/**
 * E2E Pagination Object.
 *
 * @author Damien Vitrac
 */
export class Pagination {

  /**
   * Get the pagination bloc
   * @returns {ElementFinder}
   */
  get() {
    return element(by.css('#pagination'));
  }

  /**
   * Get the page button
   * @param {number} page
   * @returns {ElementFinder}
   */
  getButtonByPage(page: number) {
    const lis = element.all(by.css('#pagination ul li'));
    return lis.get(page).$('a');
  }

  /**
   * Get the previous button
   * @returns {ElementFinder}
   */
  getPrevious() {
    return element(by.css('#pagination .pagination-previous a'));
  }

  /**
   * Get the next button
   * @returns {ElementFinder}
   */
  getNext() {
    return element(by.css('#pagination .pagination-next a'));
  }

  /**
   * Get the text of the current page
   */
  getCurrentText() {
    return element(by.css('#pagination .current')).getText();
  }

}
