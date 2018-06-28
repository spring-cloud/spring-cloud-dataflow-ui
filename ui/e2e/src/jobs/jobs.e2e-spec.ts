import { JobsPage } from './jobs.po';

/**
 * E2E spec for Jobs page.
 *
 * @author Glenn Renfro
 */
describe('E2E spec for jobs page', () => {
  let page: JobsPage;

  beforeEach(() => {
    page = new JobsPage();
  });

  it('should display jobs title', () => {
    page.navigateTo();

    expect(page.getHeaderText()).toEqual('Batch Job Executions');
  });
});
