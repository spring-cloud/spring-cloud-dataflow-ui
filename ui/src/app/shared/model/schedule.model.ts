import { Page } from './page.model';

export class Schedule {
  name: string;
  taskName: string;
  cronExpression: string;
  platform: string;

  static parse(input) {
    let cron = '';
    if (!!input.scheduleProperties) {
      cron = input.scheduleProperties['spring.cloud.scheduler.cron.expression'];
    }
    const schedule = new Schedule();
    schedule.name = input.scheduleName;
    schedule.taskName = input.taskDefinitionName;
    schedule.cronExpression = cron;
    schedule.platform = input?.platform;
    return schedule;
  }
}

export class SchedulePage extends Page<Schedule> {
  static parse(input): Page<Schedule> {
    const page = Page.fromJSON<Schedule>(input);
    if (input && input._embedded && input._embedded.scheduleInfoResourceList) {
      page.items = input._embedded.scheduleInfoResourceList.map(Schedule.parse);
    }
    return page;
  }
}
