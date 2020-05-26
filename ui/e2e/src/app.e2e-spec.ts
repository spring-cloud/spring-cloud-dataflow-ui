import { browser, by, element } from 'protractor';

describe('should display the pages', () => {

  it('should display about title', () => {
    browser.get('#/manage/apps');
    expect(element(by.css('app-apps-list h1')).getText()).toEqual('Applications');
  });

});
