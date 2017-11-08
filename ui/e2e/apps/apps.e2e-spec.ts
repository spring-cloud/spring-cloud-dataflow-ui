import { AppsPage } from './apps.po';

/**
 * E2E spec for apps page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for apps page', () => {
  let page: AppsPage;

  beforeEach(() => {
    page = new AppsPage();
  });

  it('should display apps title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Apps');
  });
});
