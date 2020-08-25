import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class StreamsRuntimePage {

  navigateTo() {
    return browser.get(`#/streams/runtime`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
