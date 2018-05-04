import { by, element } from 'protractor';

/**
 * E2E Pagination Object.
 *
 * @author Damien Vitrac
 */
export class Navigation {

  public static APPS = 0;

  public static RUNTIME = 1;

  public static STREAMS = 2;

  public static TASKS = 3;

  public static JOBS = 4;

  public static ANALYTICS = 5;

  public static ABOUT = 6;

  /**
   * Get the pagination bloc
   * @returns {ElementFinder}
   */
  get() {
    return element(by.css('#navigation'));
  }

  /**
   * Navigate
   * @param {number} page
   */
  navigateTo(page: number) {
    this.get().all(by.css('.sidebar-item a')).get(page).click();
  }

}
