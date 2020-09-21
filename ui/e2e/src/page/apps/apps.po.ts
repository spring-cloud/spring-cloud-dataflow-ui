import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class AppsPage {

  navigateTo() {
    return browser.get(`#/apps`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
