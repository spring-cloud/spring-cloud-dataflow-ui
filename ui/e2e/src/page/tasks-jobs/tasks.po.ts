import { browser, by } from 'protractor';
import { ElementHelper } from '../../utils/element.helper';

export class TasksJobsTasksPage {

  navigateTo() {
    return browser.get(`#/tasks-jobs/tasks`);
  }

  getTitle() {
    return ElementHelper.getElement(by.css('.content-area h1'));
  }

}
