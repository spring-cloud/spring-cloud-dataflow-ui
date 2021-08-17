import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, delay, map, mergeMap} from 'rxjs/operators';
import {ErrorUtils} from '../support/error.utils';
import {Schedule, SchedulePage} from '../model/schedule.model';
import {TaskService} from './task.service';
import {Platform} from '../model/platform.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private httpClient: HttpClient, private taskService: TaskService) {}

  getSchedules(search?: string, platform?: string): Observable<SchedulePage | unknown> {
    // return of(GET_SCHEDULES)
    //   .pipe(
    //     delay(2000),
    //     map(SchedulePage.parse),
    //     map((page: SchedulePage) => {
    //       page.items = page.items.filter(schedule => {
    //         console.log(schedule.platform, platform);
    //         return schedule.platform === platform;
    //       });
    //       return page;
    //     })
    //   );
    let url = '/tasks/schedules';
    if (search) {
      url = `${url}/instances/${search}`;
    }
    return this.httpClient.get<any>(`${url}?platform=${platform}`).pipe(
      map(SchedulePage.parse),
      map((page: SchedulePage) => {
        page.items.forEach(schedule => {
          schedule.platform = platform;
        });
        return page;
      }),
      catchError(ErrorUtils.catchError)
    );
  }

  getSchedule(scheduleName: string, platformName?: string): Observable<Schedule | unknown> {
    // return of(GET_SCHEDULE)
    //   .pipe(
    //     map(Schedule.parse),
    //     delay(2000),
    //     catchError(ErrorUtils.catchError)
    //   );
    const paramPlatform = platformName ? `?platform=${platformName}` : '';
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient
      .get<any>(`/tasks/schedules/${scheduleName}${paramPlatform}`, {headers})
      .pipe(map(Schedule.parse), catchError(ErrorUtils.catchError));
  }

  getSchedulesByTask(task: string): Observable<SchedulePage> {
    return this.taskService.getPlatforms().pipe(
      mergeMap((platforms: Platform[]) =>
        forkJoin([...platforms.map(platform => this.getSchedules(task, platform.name))])
      ),
      map((pages: SchedulePage[]) => {
        const page = new SchedulePage();
        pages.forEach(p => {
          page.items.push(...p.items);
        });
        page.total = page.items.length;
        page.pages = 1;
        return page;
      })
    );
  }

  createSchedules(schedules: Array<any>): Observable<any> {
    return forkJoin(
      schedules.map(schedule =>
        this.createSchedule(
          schedule.schedulerName,
          schedule.task,
          schedule.platform,
          schedule.cronExpression,
          schedule.args,
          schedule.props
        )
      )
    );
  }

  createSchedule(
    schedulerName: string,
    task: string,
    platform: string,
    cronExpression: string,
    args: string,
    props: string
  ): Observable<any> {
    const properties = ['scheduler.cron.expression=' + cronExpression];
    properties.push(...props.split(','));
    const params = new HttpParams()
      .append('scheduleName', schedulerName)
      .append('taskDefinitionName', task)
      .append('arguments', args)
      .append('platform', platform)
      .append('properties', properties.filter(prop => !!prop).join(','));
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.httpClient.post('/tasks/schedules', {}, {headers, params}).pipe(catchError(ErrorUtils.catchError));
  }

  destroySchedule(name: string, platform?: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    let url = `/tasks/schedules/${name}`;
    if (platform) {
      url = `${url}?platform=${platform}`;
    }
    return this.httpClient.delete(url, {headers, observe: 'response'}).pipe(catchError(ErrorUtils.catchError));
  }

  destroySchedules(schedules: Array<any>): Observable<any> {
    return forkJoin(schedules.map(({name, platform}) => this.destroySchedule(name, platform)));
  }
}
