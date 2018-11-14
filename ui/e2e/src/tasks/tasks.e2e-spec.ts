import { TasksPage } from './tasks.po';
import { browser } from 'protractor';
import * as request from 'request';
import { Pagination } from '../utils/pagination.po';
import { AppsBulkImportUriPage } from '../apps/apps-bulk-import-uri.po';
import { AppsPage } from '../apps/apps.po';

/**
 * E2E spec for Tasks page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for Tasks page', () => {

  let tasksPage: TasksPage;

  let pageApps: AppsPage;

  let pageBulkImportUriApps: AppsBulkImportUriPage;

  let pagination: Pagination;

  const TICK_DELAY = 3500;

  browser.waitForAngularEnabled(false);

  const createTasks = (tasks: Array<any>, done: Function) => {
    let counter = 0;
    tasks.forEach((task) => {
      const req = request({
        uri: 'http://localhost:9393/tasks/definitions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        qs: {
          name: task.name,
          definition: task.definition
        }
      }, (e, r, b) => {
        if (e) {
          throw 'Error request creation stream';
        }
        counter++;
        if (counter === tasks.length) {
          done();
        }
      });
      req.end();
    });
  };

  beforeEach(() => {
    tasksPage = new TasksPage();
    pagination = new Pagination();
    pageBulkImportUriApps = new AppsBulkImportUriPage();
    pageApps = new AppsPage();
  });


  /**
   * Initial State: no application, no stream
   * - Import applications (stream apps)
   * - Create 5 streams (request API SCDF)
   */
  describe('Initial State', () => {

    it('should display streams title', () => {
      tasksPage.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getHeaderText()).toEqual('Tasks');
    });

    it('should display an empty message', () => {
      expect(tasksPage.getEmpty().isPresent()).toBeTruthy();
      expect(tasksPage.getEmpty().getText()).toContain('There is no registered task, yet.');
      expect(tasksPage.getEmpty().getText()).toContain('You can Create Task(s) or Refresh the page');
    });

    it('should not display the table, the filter form and the pagination', () => {
      expect(tasksPage.getTable().isPresent()).toBeFalsy();
      expect(tasksPage.getFilters().isPresent()).toBeFalsy();
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    it('should import applications using bulk import uri', () => {
      //pageApps.navigateTo();
      //browser.sleep(TICK_DELAY);
      pageBulkImportUriApps.navigateTo();
      browser.sleep(TICK_DELAY);
      pageBulkImportUriApps.setUri('http://bit.ly/Clark-GA-task-applications-maven');
      pageBulkImportUriApps.getSubmit().click();
      browser.sleep(TICK_DELAY);
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('Create 5 tasks', (done) => {
      createTasks([
        { name: 'foo', definition: 'timestamp' },
        { name: 'bar', definition: 'timestamp' },
        { name: 'lorem', definition: 'timestamp' },
        { name: 'ipsum', definition: 'timestamp' },
        { name: 'sit', definition: 'timestamp' }
      ], () => {
        done();
      });
    });

  });

  /**
   * Tasks list (one page, 5 tasks)
   * - filter with foo
   * - Launch a tasks
   * - Delete the 5 streams
   */
  describe('Tasks basic usages', () => {

    it('should display streams title', () => {
      tasksPage.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getHeaderText()).toEqual('Tasks');
    });

    it('should display the table, the filter form, not display the pagination', () => {
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getTable().isPresent()).toBeTruthy();
      expect(tasksPage.getFilters().isPresent()).toBeTruthy();
      expect(tasksPage.getTableRows().count()).toBe(5);
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    it('should filter the result', () => {
      expect(tasksPage.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      tasksPage.setFilters('foo');
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      tasksPage.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      expect(tasksPage.getTableRows().count()).toBe(1);
      browser.sleep(TICK_DELAY);
      tasksPage.setFilters('');
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      tasksPage.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getTableRows().count()).toBe(5);
      expect(tasksPage.getFilterSubmit().getAttribute('disabled')).toEqual('true');
    }, 5000000);

    it('should destroy all the streams', () => {
      tasksPage.setDestroys();
      browser.sleep(TICK_DELAY);
      expect(tasksPage.getTableRows().count()).toBe(0);
      expect(tasksPage.getEmpty().isPresent()).toBeTruthy();
      expect(tasksPage.getEmpty().getText()).toContain('There is no registered task, yet.');
      expect(tasksPage.getEmpty().getText()).toContain('You can Create Task(s) or Refresh the page');
    });

  });

});
