import { AnalyticsPage } from './analytics.po';
import { browser } from 'protractor';

/**
 * E2E spec for analytics page.
 *
 * @author Glenn Renfro
 */
xdescribe('E2E spec for analytics page', () => {
  let page: AnalyticsPage;

  beforeEach(() => {
    page = new AnalyticsPage();
  });

  it('should display analytics title', () => {
    browser.waitForAngularEnabled(true);
    page.navigateTo();
    browser.sleep(1500);
    expect(page.getHeaderText()).toEqual('Analytics');
  });
});
