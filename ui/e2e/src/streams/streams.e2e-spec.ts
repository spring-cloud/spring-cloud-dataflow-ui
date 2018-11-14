import { StreamsPage } from './streams.po';
import { browser, by, element } from 'protractor';
import { Pagination } from '../utils/pagination.po';
import { AppsPage } from '../apps/apps.po';
import { AppsBulkImportUriPage } from '../apps/apps-bulk-import-uri.po';
import * as request from 'request';

/**
 * E2E spec for streams page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for streams page', () => {

  let pageStreams: StreamsPage;

  let pageApps: AppsPage;

  let pageBulkImportUriApps: AppsBulkImportUriPage;

  let pagination: Pagination;

  const TICK_DELAY = 1500;

  browser.waitForAngularEnabled(false);

  const createStreams = (streams: Array<any>, done: Function) => {
    let counter = 0;
    streams.forEach((stream) => {
      const req = request({
        uri: 'http://localhost:9393/streams/definitions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        qs: {
          name: stream.name,
          definition: stream.definition
        }
      }, (e, r, b) => {
        if (e) {
          throw 'Error request creation stream';
        }
        counter++;
        if (counter === streams.length) {
          done();
        }
      });
      req.end();
    });
  };

  beforeEach(() => {
    pageStreams = new StreamsPage();
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
      pageStreams.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getHeaderText()).toEqual('Streams');
    });

    it('should display an empty message', () => {
      expect(pageStreams.getEmpty().isPresent()).toBeTruthy();
      expect(pageStreams.getEmpty().getText()).toContain('There is no stream registered, yet.');
      expect(pageStreams.getEmpty().getText()).toContain('To create stream(s), you have to register Apps first.');
      expect(pageStreams.getEmpty().getText()).toContain('You can Refresh the page.');
    });

    it('should not display the table, the filter form and the pagination', () => {
      expect(pageStreams.getTable().isPresent()).toBeFalsy();
      expect(pageStreams.getFilters().isPresent()).toBeFalsy();
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    it('should import applications using bulk import uri', () => {
      pageBulkImportUriApps.navigateTo();
      browser.sleep(TICK_DELAY);
      pageBulkImportUriApps.setUri('http://bit.ly/Bacon-RELEASE-stream-applications-kafka-10-maven');
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

    it('Create 5 streams', (done) => {
      createStreams([
        { name: 'foo', definition: 'time|log' },
        { name: 'bar', definition: 'time|log' },
        { name: 'lorem', definition: 'time|log' },
        { name: 'ipsum', definition: 'time|log' },
        { name: 'sit', definition: 'time|log' }
      ], () => {
        done();
      });
    });

  });

  /**
   * Streams list (one page, 2 streams)
   * - filter with foo
   * - Deploy a stream
   * - Delete the 5 streams
   */
  describe('Streams basic usages', () => {

    it('should display streams title', () => {
      pageStreams.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getHeaderText()).toEqual('Streams');
    });

    it('should display the table, the filter form, not display the pagination', () => {
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTable().isPresent()).toBeTruthy();
      expect(pageStreams.getFilters().isPresent()).toBeTruthy();
      expect(pageStreams.getTableRows().count()).toBe(5);
      expect(pagination.get().isPresent()).toBeFalsy();
    });

    it('should filter the result', () => {
      expect(pageStreams.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      pageStreams.setFilters('foo');
      expect(pageStreams.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      pageStreams.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getFilterSubmit().getAttribute('disabled')).toEqual('true');
      expect(pageStreams.getTableRows().count()).toBe(1);
      browser.sleep(TICK_DELAY);
      pageStreams.setFilters('');
      expect(pageStreams.getFilterSubmit().getAttribute('disabled')).toBeFalsy();
      pageStreams.getFilterSubmit().click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(5);
      expect(pageStreams.getFilterSubmit().getAttribute('disabled')).toEqual('true');
    });

    it('should destroy all the streams', () => {
      pageStreams.setDestroys();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(0);
      expect(pageStreams.getEmpty().isPresent()).toBeTruthy();
      expect(pageStreams.getEmpty().getText()).toContain('There is no stream registered, yet.');
      expect(pageStreams.getEmpty().getText()).toContain('You can Create Streams(s) or Refresh the page');
    });

  });

  /**
   * Streams list (5 pages)
   */
  describe('Streams basic usages', () => {

    it('should display apps title', () => {
      pageApps.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getHeaderText()).toEqual('Applications');
    });

    it('Create 40 streams', (done) => {
      createStreams(
        Array.from({ length: 40 }).map((a, i) => {
          return { name: 'foo' + i, definition: 'time|log' };
        }), () => {
          done();
        });
    });

    it('should display streams title', () => {
      pageStreams.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getHeaderText()).toEqual('Streams');
    });


    it('should navigate into the page', () => {
      pagination.getButtonByPage(2).click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pagination.getButtonByPage(1).click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(30);
      expect(pagination.getCurrentText()).toContain('1');
      pagination.getNext().click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(10);
      expect(pagination.getCurrentText()).toContain('2');
      pagination.getPrevious().click();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(30);
      expect(pagination.getCurrentText()).toContain('1');
    });

    it('Navigate to the launch page (single)', () => {
      pageStreams.getTableRows().first().element(by.name('deploy-stream0')).click();
      browser.sleep(TICK_DELAY);
      browser.wait(() => {
        return browser.getCurrentUrl().then((url) => {
          const parts = url.split('#');
          expect(parts[1] === '/streams/definitions/foo0/deploy').toBeTruthy();
          return url;
        });
      });
    });

    it('should display streams title', () => {
      pageStreams.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getHeaderText()).toEqual('Streams');
    });

    it('should destroy all the streams', () => {
      expect(pageStreams.getTableRows().count()).toBe(30);
      expect(pagination.get().isPresent()).toBeTruthy();
      pageStreams.setDestroys();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(10);
      expect(pagination.get().isPresent()).toBeFalsy();
      pageStreams.setDestroys();
      browser.sleep(TICK_DELAY);
      expect(pageStreams.getTableRows().count()).toBe(0);
      expect(pagination.get().isPresent()).toBeFalsy();
      expect(pageStreams.getEmpty().isPresent()).toBeTruthy();
      expect(pageStreams.getEmpty().getText()).toContain('There is no stream registered, yet.');
      expect(pageStreams.getEmpty().getText()).toContain('You can Create Streams(s) or Refresh the page');
    });

  });

  /**
   * Remove all the applications
   */
  describe('Clean applications', () => {

    it('should display apps title', () => {
      pageApps.navigateTo();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getHeaderText()).toEqual('Applications');
    });

    it('should destroy all the apps', () => {
      expect(pageApps.getTableRows().count()).toBe(30);
      expect(pagination.get().isPresent()).toBeTruthy();
      pageApps.setUnregisters();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(29);
      expect(pagination.get().isPresent()).toBeFalsy();
      pageApps.setUnregisters();
      browser.sleep(TICK_DELAY);
      expect(pageApps.getTableRows().count()).toBe(0);
      expect(pagination.get().isPresent()).toBeFalsy();
      expect(pageApps.getEmpty().isPresent()).toBeTruthy();
      expect(pageApps.getEmpty().getText()).toContain('There is no application registered, yet.');
      expect(pageApps.getEmpty().getText()).toContain('You can: Add Application(s) or Refresh the page.');
    });

  });


});
