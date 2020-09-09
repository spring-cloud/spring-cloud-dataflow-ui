import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AboutService } from '../api/about.service';
import { Stream } from '../model/stream.model';
import { Task } from '../model/task.model';
import { TaskExecution } from '../model/task-execution.model';
import { JobExecution } from '../model/job.model';

@Injectable({
  providedIn: 'root'
})
export class GrafanaService {

  constructor(private aboutService: AboutService) {
  }

  isAllowed(): Observable<boolean> {
    return this.aboutService
      .getMonitoringType()
      .pipe(
        map(type => type === 'GRAFANA')
      );
  }

  getDashboardStreams(): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return `${info.url}/d/scdf-streams/streams?refresh=${info.refreshInterval}s`;
        })
      );
  }

  getDashboardStream(stream: Stream): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-applications/applications?refresh=' + info.refreshInterval +
            's&var-stream_name=' + stream.name + '&var-application_name=All';
        })
      );
  }

  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-applications/applications?refresh=' + info.refreshInterval +
            's&var-stream_name=' + streamName + '&var-application_name=' + appName + '&var-name=All';
        })
      );
  }

  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-applications/applications?refresh=' + info.refreshInterval +
            's&var-stream_name=' + streamName + '&var-application_name=' + appName +
            '&var-name=All&var-application_guid=' + guid;
        })
      );
  }

  getDashboardTasks(): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-tasks/tasks?refresh=' + info.refreshInterval + 's';
        })
      );
  }

  getDashboardTask(task: Task): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-tasks/tasks?refresh=' + info.refreshInterval +
            's&var-task_name=' + task.name + '&var-task_name=All';
        })
      );
  }

  getDashboardTaskExecution(execution: TaskExecution): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-tasks/tasks?refresh=' + info.refreshInterval +
            's&var-task_name=' + execution.taskName + '&var-task_name=All' + '&var-task_execution_id='
            + execution.executionId;
        })
      );
  }

  getDashboardJobExecution(jobExecution: JobExecution): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((info: any): string => {
          return info.url + '/d/scdf-tasks/tasks?refresh=' + info.refreshInterval +
            's&var-job_name=' + jobExecution.name
            + '&var-job_execution_id=' + jobExecution.jobExecutionId
            + '&var-job_instance_id=' + jobExecution.jobInstanceId
            + '&var-step_execution_count=' + jobExecution.stepExecutionCount
            + '&var-task_execution_id=' + jobExecution.taskExecutionId;
        })
      );
  }

}
