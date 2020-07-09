import { Page } from '../../shared/model';
import { ListDefaultParams } from '../../shared/components/shared.interface';

/**
 * Representation of a task schedule
 */
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
   * Task platform
   */
  platform: string;

  /**
   * Constructor
   *
   * @param {string} name
   * @param {string} taskName
   * @param {string} cronExpression
   * @param {string} platform
   */
  constructor(name: string, taskName: string, cronExpression: string, platform: string) {
    this.name = name;
    this.taskName = taskName;
    this.cronExpression = cronExpression;
    this.platform = platform;
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
    return new TaskSchedule(input.scheduleName, input.taskDefinitionName, cron, input?.platform);
  }

  static pageFromJSON(input, platform: string = ''): Page<TaskSchedule> {
    const page = Page.fromJSON<TaskSchedule>(input);
    if (input && input._embedded && input._embedded.scheduleInfoResourceList) {
      page.items = input._embedded.scheduleInfoResourceList
        .map((item) => TaskSchedule.fromJSON({...item, platform}));
    }
    return page;
  }

}

export interface ListSchedulesParams extends ListDefaultParams {
  q: string;
  platform: string;
  page: number;
  size: number;
  sort: string;
  order: string;
}
