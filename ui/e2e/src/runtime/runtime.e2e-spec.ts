import { RuntimePage } from './runtime.po';

/**
 * E2E spec for runtime page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for runtime page', () => {
  let page: RuntimePage;

  beforeEach(() => {
    page = new RuntimePage();
  });

  it('should display runtime applications title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Runtime applications');
  });

});
