import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class ManageAppsPage {

  navigateTo() {
    return browser.get(`#/manage/apps`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
