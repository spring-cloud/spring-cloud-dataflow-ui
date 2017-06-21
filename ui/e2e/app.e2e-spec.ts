import { ScdfAngularPage } from './app.po';

describe('scdf-angular App', () => {
  let page: ScdfAngularPage;

  beforeEach(() => {
    page = new ScdfAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
