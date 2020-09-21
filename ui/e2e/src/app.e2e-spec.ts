import { browser, element } from 'protractor';
import { AppsPage } from './page/apps/apps.po';
import { ManageRecordsPage } from './page/manage/records.po';
import { ManageImportExportPage } from './page/manage/import-export.po';
import { StreamsListPage } from './page/streams/list.po';
import { StreamsRuntimePage } from './page/streams/runtime.po';
import { TasksJobsTasksPage } from './page/tasks-jobs/tasks.po';
import { TasksJobsExecutionsPage } from './page/tasks-jobs/executions.po';
import { TasksJobsJobExecutionsPage } from './page/tasks-jobs/job-executions.po';

describe('should display the pages', () => {

  let appsPage: AppsPage;
  let manageRecordsPage: ManageRecordsPage;
  let manageImportExportPage: ManageImportExportPage;
  let streamsListPage: StreamsListPage;
  let streamsRuntimePage: StreamsRuntimePage;
  let tasksJobsTasksPage: TasksJobsTasksPage;
  let tasksJobsExecutionsPage: TasksJobsExecutionsPage;
  let tasksJobsJobExecutionsPage: TasksJobsJobExecutionsPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

    appsPage = new AppsPage();
    manageRecordsPage = new ManageRecordsPage();
    manageImportExportPage = new ManageImportExportPage();
    streamsListPage = new StreamsListPage();
    streamsRuntimePage = new StreamsRuntimePage();
    tasksJobsTasksPage = new TasksJobsTasksPage();
    tasksJobsExecutionsPage = new TasksJobsExecutionsPage();
    tasksJobsJobExecutionsPage = new TasksJobsJobExecutionsPage();
  });

  describe('Apps', () => {

    it('should display the apps page', async (done) => {
      await appsPage.navigateTo();
      const title = await appsPage.getTitle();
      expect(element(title).getText()).toEqual('Applications');
      done();
    });

  });

  describe('Manage section', () => {


    it('should display the record page', async (done) => {
      await manageRecordsPage.navigateTo();
      const title = await manageRecordsPage.getTitle();
      expect(element(title).getText()).toEqual('Audit Records');
      done();
    });

    it('should display the Import / Export page', async (done) => {
      await manageImportExportPage.navigateTo();
      const title = await manageImportExportPage.getTitle();
      expect(element(title).getText()).toEqual('Import / Export');
      done();
    });

  });

  describe('Streams section', () => {

    it('should display the stream page', async (done) => {
      await streamsListPage.navigateTo();
      const title = await streamsListPage.getTitle();
      expect(element(title).getText()).toEqual('Streams');
      done();
    });

    it('should display the runtime page', async (done) => {
      await streamsRuntimePage.navigateTo();
      const title = await streamsRuntimePage.getTitle();
      expect(element(title).getText()).toEqual('Runtime');
      done();
    });

  });

  describe('Tasks section', () => {

    it('should display the task page', async (done) => {
      await tasksJobsTasksPage.navigateTo();
      const title = await tasksJobsTasksPage.getTitle();
      expect(element(title).getText()).toEqual('Tasks');
      done();
    });

    it('should display the task executions page', async (done) => {
      await tasksJobsExecutionsPage.navigateTo();
      const title = await tasksJobsExecutionsPage.getTitle();
      expect(element(title).getText()).toEqual('Task Executions');
      done();
    });

    it('should display the job executions page', async (done) => {
      await tasksJobsJobExecutionsPage.navigateTo();
      const title = await tasksJobsJobExecutionsPage.getTitle();
      expect(element(title).getText()).toEqual('Job Executions');
      done();
    });

  });

});
