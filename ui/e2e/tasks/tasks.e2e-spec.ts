import { TasksPage } from './tasks.po';

/**
 * E2E spec for Tasks page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for Tasks page', () => {
  let page: TasksPage;

  beforeEach(() => {
    page = new TasksPage();
  });

  it('should display tasks title', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Tasks');
  });

});
