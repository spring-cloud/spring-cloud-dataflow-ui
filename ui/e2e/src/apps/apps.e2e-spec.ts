import { AppsPage } from './apps.po';
import { browser, by, element, Browser, ElementFinder, ElementArrayFinder } from 'protractor';
import { AppDetailsPage } from './app-details.po';
import { Pagination } from '../utils/pagination.po';
import { AppsRegisterPage } from './apps-register.po';
import { AppsBulkImportUriPage } from './apps-bulk-import-uri.po';
import { AppVersionsModal } from './app-versions.po';
import { Navigation } from '../utils/navigation.po';
import { ElementHelper } from '../utils/element-helpers';
import { protractor } from 'protractor/built/ptor';
import { By } from 'selenium-webdriver';
import 'jasmine-expect';

/**
 * E2E spec for apps page.
 *
 * Tests:
 * - Initial State (no application)
 * - Apps list (single page)
 * - Apps list (2 pages)
 * - App details
 * - Skipper integration: versions of an application
 * - Bulk import applications
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
fdescribe('E2E spec for apps page', () => {

  let pageApps: AppsPage;

  let pageRegisterApps: AppsRegisterPage;

  let pageAppDetails: AppDetailsPage;

  let pageBulkImportUriApps: AppsBulkImportUriPage;

  let modalAppVersions: AppVersionsModal;

  let pagination: Pagination;

  let navigation: Navigation;

  const TICK_DELAY = 1500;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    pageApps = new AppsPage();
    pageRegisterApps = new AppsRegisterPage();
    pageAppDetails = new AppDetailsPage();
    pageBulkImportUriApps = new AppsBulkImportUriPage();
    modalAppVersions = new AppVersionsModal();
    pagination = new Pagination();
    navigation = new Navigation();
  });

  /**
   * Initial State (no application)
   * This test should:
   * - navigate to the bulk import and the register applications pages
   * - inform the user there is no application
   */
  fdescribe('Initial state (no application register)', () => {

    fit('should display apps title', async () => {
      await pageApps.navigateTo();
      expect(await pageApps.getHeaderText()).toEqual('Applications');
    });

    fit('should display 30 registered apps in the table', async () => {
      const count = await pageApps.getTableRowCount();
      expect(count).toBe(30);
    });

    fit('should destroy all the apps', async () => {
      await pageApps.setUnregisters();
      await pageApps.setUnregisters();
      await pageApps.setUnregisters();
      await expect((await pageApps.getEmpty()).isPresent()).toBeTruthy();
    });

    fit('should display a message related to the empty register app', async () => {
      const empty: ElementFinder = await pageApps.getEmpty();
      expect(empty.isPresent()).toBeTruthy();
      expect(await empty.getText()).toContain('There is no application registered, yet.');
      expect(await empty.getText()).toContain('You can: Add Application(s) or Refresh the page.');
    });

    fit('should not display the table, the filter form and the pagination', async () => {
      expect(pageApps.getTable().isPresent()).toBeFalsy();
      expect(pageApps.getFilters().isPresent()).toBeFalsy();
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    fit('should navigate to the register page', async () => {
      const emptyBox: ElementFinder = await pageApps.getEmpty();
      await ElementHelper.clickElement(by.css('a'), true, emptyBox);
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEndWith('#/apps/add');

      await element.all(by.css('.page-step-1 a')).first().click();
      const registerAppUrl = await browser.getCurrentUrl();
      expect(registerAppUrl).toEndWith('#/apps/add/register');
    });

    fit('should navigate to the list app page', async () => {
      await pageRegisterApps.getCancel().click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEndWith('#/apps');
    });

    fit('should navigate to the bulk import page', async () => {
      const emptyBox = await pageApps.getEmpty();
      await (emptyBox).all(by.css('a')).first().click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEndWith('#/apps/add');

      await element.all(by.css('.page-step-1 a')).get(1).click();
      const registerAppUrl = await browser.getCurrentUrl();
      expect(registerAppUrl).toEndWith('#/apps/add/import-from-uri');
    });

    fit('should navigate to the list app page', async () => {
      await pageBulkImportUriApps.getCancel().click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEndWith('#/apps');
    });

  });

  /**
   * Apps list (single page)
   * This test should:
   * - create the Foo1 application
   * - create the Foo2, Foo3, Foo4 applications
   * - inform the user there is no application
   * - destroy the Foo1 application
   * - destroy the Foo2, Foo3, Foo4 applications
   */
  describe('Apps list (single page)', () => {

    it('should display register apps title', async () => {
      const emptyBox = await pageApps.getEmpty();
      await (emptyBox).all(by.css('a')).first().click();
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEndWith('#/apps/add');
      expect(await pageApps.getHeaderText()).toEqual('Add Application(s)');

      await element.all(by.css('.page-step-1 a')).first().click();
      const registerAppUrl = await browser.getCurrentUrl();
      expect(registerAppUrl).toEndWith('#/apps/add/register');
      expect(await pageApps.getSecondHeaderText()).toEqual('Register one or more applications');
    });

    it('should register one app', () => {
      expect(pageRegisterApps.getSubmit().getAttribute('disabled')).toEqual('true');
      pageRegisterApps.setForm(0, 'foo1', 'source', 'maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT', '');
      expect(pageRegisterApps.getSubmit().getAttribute('disabled')).toBeFalsy();
      pageRegisterApps.getSubmit().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should register 3 apps', () => {
      pageApps.navigateToRegisterApp();
      browser.sleep(TICK_DELAY);
      pageRegisterApps.getAdd().click();
      browser.sleep(100);
      pageRegisterApps.getAdd().click();
      browser.sleep(100);
      pageRegisterApps.setForm(0, 'foo2', 'processor', 'maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT', '');
      pageRegisterApps.setForm(1, 'foo3', 'task', 'maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT', '');
      pageRegisterApps.setForm(2, 'foo4', 'sink', 'maven://io.spring.cloud:scdf-sample-app:jar:1.0.0.BUILD-SNAPSHOT', '');
      pageRegisterApps.getSubmit().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should navigate to the register page', () => {
      element(by.css('.heading .actions .dropdown button')).click();
      browser.sleep(100);
      element.all(by.css('.heading .actions .dropdown-menu li')).first().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps/register-apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should navigate to the list app page', () => {
      pageRegisterApps.getCancel().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should navigate to the bulk import page', () => {
      element(by.css('.heading .actions .dropdown button')).click();
      browser.sleep(100);
      element.all(by.css('.heading .actions .dropdown-menu li')).last().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps/bulk-import-apps/uri').toBeTruthy();
          return url;
        });
      });
    });

    it('should navigate to the list app page', () => {
      pageBulkImportUriApps.getCancel().click();
      browser.sleep(100);
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should display the table, the filter form, not display the pagination', () => {
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTable().isPresent()).toBeTruthy();
      expect(pageApps.getFilters().isPresent()).toBeTruthy();
      expect(pageApps.getTableRows().count()).toBe(4);
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    it('should delete one app', () => {
      pageApps.setUnregister(0);
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(3);
    });

    it('should destroy 3 apps', () => {
      pageApps.setUnregisters();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(0);
    });

    // it('should be in the initial state (no app)', () => {
    //   expect(pageApps.getEmpty().isPresent()).toBeTruthy();
    //   expect(pageApps.getEmpty().getText()).toContain('No registered apps.');
    //   expect(pageApps.getEmpty().getText()).toContain('You can register apps by clicking:');
    // });

  });

  /**
   * Apps list (2 pages)
   * This test should:
   * - create 50 applications (10 per type)
   * - filter by name and/or type
   * - navigate into the pages
   * - sort the applications by name, type and uri
   * - Persist the context (filter, pagination, sort, app(s) selected)
   * - destroy all the applications
   */
  describe('Apps list (2 pages)', () => {

    // it('Create 10 apps', () => {
    //   pageApps.getEmpty().all(by.css('button')).first().click();
    //   browser.sleep(TICK_DELAY);
    //   for (let i = 0; i < 10; i++) {
    //     const type = 'source';
    //     pageRegisterApps.getAdd().click();
    //     browser.sleep(100);
    //     pageRegisterApps.setForm(i, `foo${i}`, type, `maven://io.spring.cloud:scdf-sample-app:jar:1.0.${i}.BUILD-SNAPSHOT`, '');
    //   }
    //   pageRegisterApps.getSubmit().click();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageApps.getTable().isPresent()).toBeTruthy();
    //   expect(pageApps.getFilters().isPresent()).toBeTruthy();
    // });

    it('Create 10 apps', () => {
      pageApps.navigateToRegisterApp();
      browser.sleep(TICK_DELAY);
      for (let i = 0; i < 10; i++) {
        const type = 'task';
        pageRegisterApps.getAdd().click();
        browser.sleep(100);
        pageRegisterApps.setForm(i, `foo${i + 10}`, type, `maven://io.spring.cloud:scdf-sample-app:jar:1.0.${i + 10}.BUILD-SNAPSHOT`, '');
      }
      pageRegisterApps.getSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTable().isPresent()).toBeTruthy();
      expect(pageApps.getFilters().isPresent()).toBeTruthy();
    });

    it('Create 10 apps', () => {
      pageApps.navigateToRegisterApp();
      browser.sleep(TICK_DELAY);
      for (let i = 0; i < 10; i++) {
        const type = 'processor';
        pageRegisterApps.getAdd().click();
        browser.sleep(100);
        pageRegisterApps.setForm(i, `foo${i + 20}`, type, `maven://io.spring.cloud:scdf-sample-app:jar:1.0.${i + 20}.BUILD-SNAPSHOT`, '');
      }
      pageRegisterApps.getSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTable().isPresent()).toBeTruthy();
      expect(pageApps.getFilters().isPresent()).toBeTruthy();
    });

    it('Create 10 apps', () => {
      pageApps.navigateToRegisterApp();
      browser.sleep(TICK_DELAY);
      for (let i = 0; i < 10; i++) {
        const type = 'sink';
        pageRegisterApps.getAdd().click();
        browser.sleep(100);
        pageRegisterApps.setForm(i, `foo${i + 30}`, type, `maven://io.spring.cloud:scdf-sample-app:jar:1.0.${i + 30}.BUILD-SNAPSHOT`, '');
      }
      pageRegisterApps.getSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTable().isPresent()).toBeTruthy();
      expect(pageApps.getFilters().isPresent()).toBeTruthy();
      expect(pagination.get().isPresent()).toBeTruthy();
    });
    it('should filter the result', () => {
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      pageApps.setFilters('foo1', 0);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      expect(pageApps.getTableRows().count()).toBe(11);
      pageApps.setFilters('', 3);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      expect(pageApps.getTableRows().count()).toBe(10);
      pageApps.setFilters('', 0);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(30);
      expect(pageApps.getFilterSubmit().getAttribute('disabled')).toEqual('true');
    });

    it('should navigate into the page', () => {
      pagination.getButtonByPage(2).click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pagination.getButtonByPage(1).click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(30);
      expect(pagination.getCurrentText()).toContain('1');
      pagination.getNext().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pagination.getPrevious().click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(30);
      expect(pagination.getCurrentText()).toContain('1');
    });

    it('should navigate to the page 1 after performed a search', () => {
      pagination.getButtonByPage(2).click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pageApps.setFilters('foo', 0);
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pagination.getCurrentText()).toContain('1');
      expect(pageApps.getTableRows().count()).toBe(30);
      pageApps.setFilters('', 0);
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
    });

    it('should sort the table', () => {
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');

      pageApps.setSort('type');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo28');

      pageApps.setSort('type');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo14');

      pageApps.setSort('type');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');

      pageApps.setSort('uri');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');

      pageApps.setSort('uri');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeTruthy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo9');

      pageApps.setSort('uri');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');

      pageApps.setSort('name');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');

      pageApps.setSort('name');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeTruthy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo9');

      pageApps.setSort('name');
      browser.sleep(TICK_DELAY);
      expect(pageApps.getSort('name', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('name', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('type', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeFalsy();
      expect(pageApps.getSort('uri', 'desc').isPresent()).toBeFalsy();
      expect(pageApps.getTableRows().first().getText()).toContain('foo0');
    });

    it('should persist the state (filter, pagination, sort, app(s) selected)', () => {
      pageApps.setSort('uri');
      browser.sleep(TICK_DELAY);
      pageApps.setFilters('foo', 0);
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      pagination.getButtonByPage(2).click();
      browser.sleep(TICK_DELAY);
      pageApps.getTableRows().get(0).element(by.css('.cell-checkbox input')).click();
      browser.sleep(100);
      pageApps.getTableRows().get(2).element(by.css('.cell-checkbox input')).click();
      browser.sleep(100);

      expect(pageApps.getFilters().element(by.css('#q')).getAttribute('value')).toContain('foo');
      expect(pagination.getCurrentText()).toContain('2');
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getTableRows().get(0).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeTruthy();
      expect(pageApps.getTableRows().get(1).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeFalsy();
      expect(pageApps.getTableRows().get(2).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeTruthy();

      navigation.navigateTo(Navigation.RUNTIME);
      browser.sleep(TICK_DELAY);
      navigation.navigateTo(Navigation.APPS);
      browser.sleep(TICK_DELAY);

      expect(pageApps.getFilters().element(by.css('#q')).getAttribute('value')).toContain('foo');
      expect(pagination.getCurrentText()).toContain('2');
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pageApps.getSort('uri', 'asc').isPresent()).toBeTruthy();
      expect(pageApps.getTableRows().get(0).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeTruthy();
      expect(pageApps.getTableRows().get(1).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeFalsy();
      expect(pageApps.getTableRows().get(2).element(by.css('.cell-checkbox input')).getAttribute('checked')).toBeTruthy();

      pageApps.setFilters('', 0);
      pageApps.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
    });

    it('should destroy all the apps of page 2', () => {
      pagination.getButtonByPage(2).click();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pageApps.setUnregisters();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(30);
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    // it('should destroy all the apps', () => {
    //   pageApps.setUnregisters();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageApps.getTableRows().count()).toBe(0);
    //   expect(pageApps.getEmpty().isPresent()).toBeTruthy();
    //   expect(pageApps.getEmpty().getText()).toContain('No registered apps.');
    //   expect(pageApps.getEmpty().getText()).toContain('You can register apps by clicking:');
    // });

  });

  /**
   * App details
   * This test should:
   * - create the Log application (sink)
   * - navigate into the details page of the Log application
   * - destroy the Log application
   */
  describe('App details', () => {

    // it('should create the Log application', () => {
    //   pageApps.getEmpty().all(by.css('button')).first().click();
    //   browser.sleep(TICK_DELAY);
    //   pageRegisterApps.setForm(0, 'log', 'sink', 'maven://org.springframework.cloud.stream.app:log-sink-kafka-10:1.2.0.RELEASE', '');
    //   pageRegisterApps.getSubmit().click();
    //   browser.wait(() => {
    //     return browser.getCurrentUrl().then((url) => {
    //       const parts = url.split('#');
    //       expect(parts[1] === '/apps').toBeTruthy();
    //       return url;
    //     });
    //   });
    // });

    it('should navigate to the Log application details page (button action)', () => {
      browser.sleep(TICK_DELAY);
      pageApps.getTableRows().first().element(by.name('app-view0')).click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps/sink/log').toBeTruthy();
          return url;
        });
      });
    });

    it('should display the app information', () => {
      browser.sleep(TICK_DELAY);
      expect(pageAppDetails.getHeaderText()).toContain('Application log');
      expect(pageAppDetails.getHeaderText()).toContain('SINK');
      expect(pageAppDetails.getHeaderText()).toContain('1.2.0.RELEASE');
      expect(pageAppDetails.getInfo()).toContain('1.2.0.RELEASE');
      expect(pageAppDetails.getInfo()).toContain('maven://org.springframework.cloud.stream.app:log-sink-kafka-10:1.2.0.RELEASE');

      const properties = pageAppDetails.getProperties();
      expect(properties.count()).toBe(3);
      expect(properties.get(0).getText()).toContain('name');
      expect(properties.get(0).getText()).toContain('The name of the logger to use.');
      expect(properties.get(0).getText()).toContain('java.lang.String');

      expect(properties.get(1).getText()).toContain('level');
      expect(properties.get(1).getText()).toContain('The level at which to log messages.');
      expect(properties.get(1).getText()).toContain('org.springframework.integration.handler.LoggingHandler$Level');

      expect(properties.get(2).getText()).toContain('expression');
      expect(properties.get(2).getText()).toContain('A SpEL expression (against the incoming message) to evaluate as the logged message.');
      expect(properties.get(2).getText()).toContain('java.lang.String (Default value: payload)');
    });

    it('should go back to the apps page', () => {
      pageAppDetails.getCancel().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should navigate to the Log application details page (link action)', () => {
      pageApps.getTableRows().first().element(by.css('a')).click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps/sink/log').toBeTruthy();
          return url;
        });
      });
    });

    it('should go back to the apps page', () => {
      browser.sleep(TICK_DELAY);
      pageAppDetails.getCancel().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    // it('should destroy all the apps', () => {
    //   pageApps.setUnregisters();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageApps.getTableRows().count()).toBe(0);
    //   expect(pageApps.getEmpty().isPresent()).toBeTruthy();
    //   expect(pageApps.getEmpty().getText()).toContain('No registered apps.');
    //   expect(pageApps.getEmpty().getText()).toContain('You can register apps by clicking:');
    // });

  });

  /**
   * Skipper integration: versions of an application
   * This test should:
   * - create the new version 1.2.0 and 1.3.1 of the Log application (sink)
   * - navigate into the modal versions of the Log application
   * - make the default version to 1.3.1 of the Log application
   * - destroy the version 1.2.0 of Log application
   * - destroy the version 1.3.1 of the Log application
   */
  describe('Skipper: manage versions of an application', () => {

    // it('should create the foo app (version 1.2.0)', () => {
    //   pageApps.getEmpty().all(by.css('button')).first().click();
    //   browser.sleep(TICK_DELAY);
    //   pageRegisterApps.setForm(0, 'log', 'sink', 'maven://org.springframework.cloud.stream.app:log-sink-kafka-10:1.2.0.RELEASE', '');
    //   pageRegisterApps.getSubmit().click();
    //   browser.wait(() => {
    //     return browser.getCurrentUrl().then((url) => {
    //       const parts = url.split('#');
    //       expect(parts[1] === '/apps').toBeTruthy();
    //       return url;
    //     });
    //   });
    // });

    it('should create the foo app (version 1.3.1)', () => {
      pageApps.navigateToRegisterApp();
      browser.sleep(TICK_DELAY);
      pageRegisterApps.setForm(0, 'log', 'sink', 'maven://org.springframework.cloud.stream.app:log-sink-kafka-10:1.3.1.RELEASE', '');
      pageRegisterApps.getSubmit().click();
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/apps').toBeTruthy();
          return url;
        });
      });
    });

    it('should display the version on the app list', () => {
      expect(pageApps.getTableRows().first().element(by.css('app-version-label')).getText()).toContain('1.2.0');
    });

    it('should display the modal versions/close', () => {
      pageApps.getTableRows().first().element(by.css('app-version-label a')).click();
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getModal().isPresent()).toBeTruthy();
      modalAppVersions.getFooterCancel().click();
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getModal().isPresent()).toBeFalsy();
      pageApps.getTableRows().first().element(by.css('app-version-label a')).click();
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getModal().isPresent()).toBeTruthy();
      modalAppVersions.getHeaderCancel().click();
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getModal().isPresent()).toBeFalsy();
    });

    it('should display 2 versions of the application log', () => {
      pageApps.getTableRows().first().element(by.css('app-version-label a')).click();
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getHeaderText()).toContain('Manage versions of the application log');
      expect(modalAppVersions.getHeaderText()).toContain('SINK');
      expect(modalAppVersions.getTableRows().count()).toBe(2);
    });

    it('should make the default version', () => {
      expect(modalAppVersions.getTableRows().get(0).element(by.css('.ico-current-version')).isPresent()).toBeTruthy();
      expect(modalAppVersions.getRowButtons(0).get(0).getAttribute('disabled')).toEqual('true');
      expect(modalAppVersions.getTableRows().get(1).element(by.css('.ico-current-version')).isPresent()).toBeFalsy();
      expect(modalAppVersions.getRowButtons(1).get(0).getAttribute('disabled')).toBeFalsy();
      modalAppVersions.setMakeDefault(1);
      browser.sleep(TICK_DELAY);
      expect(modalAppVersions.getTableRows().get(1).element(by.css('.ico-current-version')).isPresent()).toBeTruthy();
      expect(modalAppVersions.getRowButtons(1).get(0).getAttribute('disabled')).toEqual('true');
      expect(modalAppVersions.getTableRows().get(0).element(by.css('.ico-current-version')).isPresent()).toBeFalsy();
      expect(modalAppVersions.getRowButtons(0).get(0).getAttribute('disabled')).toBeFalsy();
      modalAppVersions.getFooterCancel().click();
      browser.sleep(500);
      expect(pageApps.getTableRows().first().element(by.css('app-version-label')).getText()).toContain('1.3.1');
    });

    // it('should destroy the two versions', () => {
    //   pageApps.getTableRows().first().element(by.css('app-version-label a')).click();
    //   browser.sleep(TICK_DELAY);
    //   expect(modalAppVersions.getTableRows().count()).toBe(2);
    //   modalAppVersions.setDestroy(0);
    //   browser.sleep(TICK_DELAY);
    //   expect(modalAppVersions.getTableRows().count()).toBe(1);
    //   modalAppVersions.setDestroy(0);
    //   browser.sleep(TICK_DELAY);
    //   expect(modalAppVersions.getModal().isPresent()).toBeFalsy();
    //   expect(pageApps.getTableRows().count()).toBe(0);
    //   expect(pageApps.getEmpty().isPresent()).toBeTruthy();
    //   expect(pageApps.getEmpty().getText()).toContain('No registered apps.');
    //   expect(pageApps.getEmpty().getText()).toContain('You can register apps by clicking:');
    // });

  });

  /**
   * Bulk import applications
   * - should import 59 applications (uri: https://bit.ly/Bacon-RELEASE-stream-applications-kafka-10-maven)
   * - should destroy all the applications
   */
  describe('Bulk import applications', () => {

    // it('should import applications using bulk import uri', () => {
    //   pageApps.getEmpty().all(by.css('button')).last().click();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageBulkImportUriApps.getSubmit().getAttribute('disabled')).toEqual('true');
    //   pageBulkImportUriApps.setUri('https://bit.ly/Bacon-RELEASE-stream-applications-kafka-10-maven');
    //   expect(pageBulkImportUriApps.getSubmit().getAttribute('disabled')).toBeFalsy();
    //   pageBulkImportUriApps.getSubmit().click();
    //   browser.wait(() => {
    //     return browser.getCurrentUrl().then((url) => {
    //       const parts = url.split('#');
    //       expect(parts[1] === '/apps').toBeTruthy();
    //       return url;
    //     });
    //   });
    // });

    // it('should destroy all the apps', () => {
    //   expect(pageApps.getTableRows().count()).toBe(30);
    //   expect(pagination.get().isPresent()).toBeTruthy();
    //   pageApps.setUnregisters();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageApps.getTableRows().count()).toBe(29);
    //   expect(pagination.get().isPresent()).toBeFalsy();
    //   pageApps.setUnregisters();
    //   browser.sleep(TICK_DELAY);
    //   expect(pageApps.getTableRows().count()).toBe(0);
    //   expect(pagination.get().isPresent()).toBeFalsy();
    //   expect(pageApps.getEmpty().isPresent()).toBeTruthy();
    //   expect(pageApps.getEmpty().getText()).toContain('No registered apps.');
    //   expect(pageApps.getEmpty().getText()).toContain('You can register apps by clicking:');
    // });

  });

});
