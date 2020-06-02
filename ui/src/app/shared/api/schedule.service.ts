import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorUtils } from '../support/error.utils';
import { Schedule, SchedulePage } from '../model/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) {
  }

  getSchedules(search?: string): Observable<SchedulePage> {
    let url = '/tasks/schedules';
    if (search) {
      url = `${url}/instances/${search}`;
    }
    return this.httpClient
      .get<any>(url)
      .pipe(
        map(SchedulePage.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  getSchedule(scheduleName: string): Observable<Schedule> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.get<any>(`/tasks/schedules/${scheduleName}`, { headers })
      .pipe(
        map(Schedule.parse),
        catchError(ErrorUtils.catchError)
      );
  }

  createSchedules(schedules: Array<any>): Observable<any> {
    return forkJoin(schedules.map(schedule =>
      this.createSchedule(schedule.schedulerName, schedule.task, schedule.cronExpression, schedule.args, schedule.props)
    ));
  }

  createSchedule(schedulerName: string, task: string, cronExpression: string, args: string, props: string): Observable<any> {
    const properties = ['scheduler.cron.expression=' + cronExpression];
    properties.push(...props.split(','));
    const params = new HttpParams()
      .append('scheduleName', schedulerName)
      .append('taskDefinitionName', task)
      .append('arguments', args)
      .append('properties', properties.filter((prop) => !!prop).join(','));
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .post(`/tasks/schedules`, {}, { headers, params })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  destroySchedule(scheduleName: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient
      .delete(`/tasks/schedules/${scheduleName}`, { headers, observe: 'response' })
      .pipe(
        catchError(ErrorUtils.catchError)
      );
  }

  destroySchedules(scheduleNames: Array<string>): Observable<any> {
    return forkJoin(scheduleNames.map(name => this.destroySchedule(name)));
  }

}
