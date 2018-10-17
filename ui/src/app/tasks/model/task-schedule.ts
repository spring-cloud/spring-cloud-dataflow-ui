/**
 * Representation of a task schedule
 */
import { Page } from '../../shared/model/page';

export class TaskSchedule {

  /**
   * Schedule name
   */
  name: string;

  /**
   * Task Definition name
   */
  taskName: string;

  /**
   * Cron Expression (trigger)
   */
  cronExpression: string;

  /**
   * Constructor
   *
   * @param {string} name
   * @param {string} taskName
   * @param {string} cronExpression
   */
  constructor(name: string, taskName: string, cronExpression: string) {
    this.name = name;
    this.taskName = taskName;
    this.cronExpression = cronExpression;
  }

  /**
   * Create a TaskSchedule from JSON
   * @param input
   * @returns {TaskSchedule}
   */
  static fromJSON(input): TaskSchedule {
    let cron = '';
    if (!!input.scheduleProperties) {
      cron = input.scheduleProperties['spring.cloud.scheduler.cron.expression'];
    }
    return new TaskSchedule(input.scheduleName, input.taskDefinitionName, cron);
  }

  static pageFromJSON(input): Page<TaskSchedule> {
    const page = Page.fromJSON<TaskSchedule>(input);
    if (input && input._embedded && input._embedded.scheduleInfoResourceList) {
      page.items = input._embedded.scheduleInfoResourceList.map(TaskSchedule.fromJSON);
    }
    return page;
  }

}
