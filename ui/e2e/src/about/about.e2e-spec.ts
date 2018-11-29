import { AboutPage } from './about.po';
import { browser } from 'protractor';

/**
 * E2E spec for about page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for about page', () => {
  let page: AboutPage;

  beforeEach(() => {
    page = new AboutPage();
  });

  it('loop', () => {
    page.navigateTo();
  });

  it('loop', () => {
    page.navigateTo();
    browser.sleep(1500);
  });

  it('loop', () => {
    browser.sleep(1500);
  });

  it('should display about title', () => {
    //page.navigateTo();
    browser.sleep(1500);
    expect(page.getHeaderText()).toEqual('About & Docs');
  });
});
