import { AnalyticsPage } from './analytics.po';

/**
 * E2E spec for analytics page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for analytics page', () => {
  let page: AnalyticsPage;

  beforeEach(() => {
    page = new AnalyticsPage();
  });

  it('should display analytics title', () => {
    page.navigateTo();

    expect(page.getHeaderText()).toEqual('Analytics');
  });
});
