import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class TasksJobsExecutionsPage {

  navigateTo() {
    return browser.get(`#/tasks-jobs/task-executions`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
