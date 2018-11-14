import { AboutPage } from './about.po';
import { browser } from 'protractor';

/**
 * E2E spec for about page.
 *
 * @author Glenn Renfro
 */
xdescribe('E2E spec for about page', () => {

  let page: AboutPage;

  const TICK_DELAY = 1500;

  browser.waitForAngularEnabled(false);

  beforeEach(() => {
    page = new AboutPage();
  });

  it('should display about title', () => {
    page.navigateTo();
    browser.sleep(TICK_DELAY);
    expect(page.getHeaderText()).toEqual('About & Docs');
  });
});
