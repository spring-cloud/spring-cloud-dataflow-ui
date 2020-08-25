import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class ManageImportExportPage {

  navigateTo() {
    return browser.get(`#/manage/import-export`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
