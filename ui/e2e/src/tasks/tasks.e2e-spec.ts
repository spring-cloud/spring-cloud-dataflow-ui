import { TasksPage } from './tasks.po';
import { browser } from 'protractor';

/**
 * E2E spec for Tasks page.
 *
 * @author Glenn Renfro
 */
xdescribe('E2E spec for Tasks page', () => {

  let page: TasksPage;

  const TICK_DELAY = 3500;

  beforeEach(() => {
    page = new TasksPage();
  });

  it('should display tasks title', () => {
    page.navigateTo();
    browser.sleep(TICK_DELAY);
    expect(page.getHeaderText()).toEqual('Tasks');
  });

});
