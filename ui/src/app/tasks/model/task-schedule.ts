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

}
