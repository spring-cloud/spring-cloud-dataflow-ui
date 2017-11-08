import {AppRegisterPage} from './app-register.po';

/**
 * E2E spec for app registration page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for app registration page', () => {
  let page: AppRegisterPage;

  beforeEach(() => {
    page = new AppRegisterPage();
  });

  it('should display app registration title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Register Applications');
  });
});
