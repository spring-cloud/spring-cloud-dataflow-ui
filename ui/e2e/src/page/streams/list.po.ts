import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class StreamsListPage {

  navigateTo() {
    return browser.get(`#/streams/list`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
