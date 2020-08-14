import { Observable, of } from 'rxjs';
import { Schedule, SchedulePage } from '../../shared/model/schedule.model';
import { delay, map } from 'rxjs/operators';
import { GET_SCHEDULE, GET_SCHEDULES } from '../data/schedule';
import { ScheduleService } from '../../shared/api/schedule.service';

export class ScheduleServiceMock {

  static mock: ScheduleServiceMock = null;

  getSchedules(search?: string, platform?: string): Observable<SchedulePage> {
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

  getSchedulesByTask(task, platform): Observable<SchedulePage> {
    return of(GET_SCHEDULES)
      .pipe(
        delay(1),
        map(SchedulePage.parse),
      );
  }

  createSchedules(schedules: Array<any>): Observable<any> {
    return of(schedules);
  }

  createSchedule(schedulerName: string, task: string, platform: string, cronExpression: string, args: string,
                 props: string): Observable<any> {
    return of({});
  }


  destroySchedule(scheduleName: string, platform: string): Observable<any> {
    return of({});
  }

  destroySchedules(schedules: Array<any>): Observable<any> {
    return of(schedules);
  }

  static get provider() {
    if (!ScheduleServiceMock.mock) {
      ScheduleServiceMock.mock = new ScheduleServiceMock();
    }
    return { provide: ScheduleService, useValue: ScheduleServiceMock.mock };
  }

}
