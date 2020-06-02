import { Observable, of } from 'rxjs';
import { Schedule, SchedulePage } from '../../shared/model/schedule.model';
import { delay, map } from 'rxjs/operators';
import { GET_SCHEDULE, GET_SCHEDULES } from '../data/schedule';
import { ScheduleService } from '../../shared/api/schedule.service';

export class ScheduleServiceMock {

  static mock: ScheduleServiceMock = null;

  getSchedules(search?: string): Observable<SchedulePage> {
    return of(GET_SCHEDULES)
      .pipe(
        delay(1),
        map(SchedulePage.parse),
      );
  }

  getSchedule(scheduleName: string): Observable<Schedule> {
    return of(GET_SCHEDULE)
      .pipe(
        delay(1),
        map(Schedule.parse),
      );
  }

  createSchedules(schedules: Array<any>): Observable<any> {
    return of(schedules);
  }

  createSchedule(schedulerName: string, task: string, cronExpression: string, args: string, props: string): Observable<any> {
    return of({});
  }


  destroySchedule(scheduleName: string): Observable<any> {
    return of({});
  }

  destroySchedules(scheduleNames: Array<string>): Observable<any> {
    return of(scheduleNames);
  }

  static get provider() {
    if (!ScheduleServiceMock.mock) {
      ScheduleServiceMock.mock = new ScheduleServiceMock();
    }
    return { provide: ScheduleService, useValue: ScheduleServiceMock.mock };
  }

}
