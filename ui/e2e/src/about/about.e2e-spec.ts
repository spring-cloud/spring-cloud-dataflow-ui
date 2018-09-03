import { AboutPage } from './about.po';

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

  it('should display about title', () => {
    page.navigateTo();

    expect(page.getHeaderText()).toEqual('About & Docs');
  });
});
