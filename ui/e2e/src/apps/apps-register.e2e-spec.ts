/**
 * E2E spec for app registration page.
 *
 * @author Glenn Renfro
 */

import { AppsRegisterPage } from './apps-register.po';

xdescribe('E2E spec for app registration page', () => {
  let page: AppsRegisterPage;

  beforeEach(() => {
    page = new AppsRegisterPage();
  });

  it('should display app registration title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Register one or more applications');
  });
});
