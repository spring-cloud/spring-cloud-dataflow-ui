import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class TasksJobsJobExecutionsPage {

  navigateTo() {
    return browser.get(`#/tasks-jobs/job-executions`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
