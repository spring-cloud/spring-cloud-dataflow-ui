import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class ManageRecordsPage {

  navigateTo() {
    return browser.get(`#/manage/records`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
