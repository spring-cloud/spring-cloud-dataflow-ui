import { JobsPage } from './jobs.po';
import { browser } from 'protractor';

/**
 * E2E spec for Jobs page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for jobs page', () => {

  let pageJobs: JobsPage;

  const TICK_DELAY = 1500;

  browser.waitForAngularEnabled(false);

  beforeEach(() => {
    pageJobs = new JobsPage();
  });

  it('should display jobs title', () => {
    pageJobs.navigateTo();
    browser.sleep(TICK_DELAY);
    expect(pageJobs.getHeaderText()).toEqual('Batch Job Executions');
  });
});
