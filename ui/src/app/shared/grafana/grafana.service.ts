import { Injectable } from '@angular/core';
import { StreamDefinition } from '../../streams/model/stream-definition';
import { Observable, of } from 'rxjs';
import { SharedAboutService } from '../services/shared-about.service';
import { map } from 'rxjs/operators';
import { FeatureInfo } from '../model/about/feature-info.model';
import { AboutInfo } from '../model/about/about-info.model';
import { GrafanaInfo } from '../model/about/grafana.model';
import { TaskDefinition } from '../../tasks/model/task-definition';
import { TaskExecution } from '../../tasks/model/task-execution';
import { JobExecution } from '../../jobs/model/job-execution.model';

/**
 * Grafana Service.
 *
 * @author Damien Vitrac
 * @author Christian Tzolov
 */
@Injectable()
export class GrafanaService {

  /**
   * Constructor
   * @param sharedAboutService
   */
  constructor(private sharedAboutService: SharedAboutService) {
  }

  /**
   * Return an observable which contains a boolean
   * True if Grafana is enabled
   */
  isAllowed(): Observable<boolean> {
    return this.sharedAboutService
      .getFeatureInfo()
      .pipe(map((featuredInfo: FeatureInfo) => featuredInfo.grafanaEnabled));
  }

  /**
   * Return an observable which contains the URL to the streams dashboard
   */
  getDashboardStreams(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-streams/streams?refresh=' + grafanaInfo.refreshInterval + 's';
        })
      );
  }

  /**
   * Return an observable which contains the URL to the stream dashboard
   * @param {StreamDefinition} stream
   */
  getDashboardStream(stream: StreamDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-applications/applications?refresh=' + grafanaInfo.refreshInterval +
            's&var-stream_name=' + stream.name + '&var-application_name=All';
        })
      );
  }

  /**
   * Return an observable which contains the URL to the application dashboard
   * @param streamName
   * @param appName
   */
  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-applications/applications?refresh=' + grafanaInfo.refreshInterval +
            's&var-stream_name=' + streamName + '&var-application_name=' + appName + '&var-name=All';
        })
      );
  }

  /**
   * Return an observable which contains the URL to the application instance dashboard
   * @param streamName
   * @param appName
   * @param guid
   */
  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-applications/applications?refresh=' + grafanaInfo.refreshInterval +
            's&var-stream_name=' + streamName + '&var-application_name=' + appName +
            '&var-name=All&var-application_guid=' + guid;
        })
      );
  }

  /**
   * Return an observable which contains the URL to the tasks dashboard
   */
  getDashboardTasks(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-tasks/tasks?refresh=' + grafanaInfo.refreshInterval + 's';
        })
      );
  }


  /**
   * Return an observable which contains the URL to the task dashboard
   * @param {TaskDefinition} stream
   */
  getDashboardTask(task: TaskDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-tasks/tasks?refresh=' + grafanaInfo.refreshInterval +
            's&var-task_name=' + task.name + '&var-task_name=All';
        })
      );
  }

  /**
   * Return an observable which contains the URL to the task execution dashboard
   * @param {TaskExecution} taskExecution
   */
  getDashboardTaskExecution(taskExecution: TaskExecution): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-tasks/tasks?refresh=' + grafanaInfo.refreshInterval +
            's&var-task_name=' + taskExecution.taskName + '&var-task_name=All' + '&var-task_execution_id='
            + taskExecution.executionId;
        })
      );
  }

  /**
   * Return an observable which contains the URL to the job execution dashboard
   * @param {JobExecution} jobExecution
   */
  getDashboardJobExecution(jobExecution: JobExecution): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): GrafanaInfo => aboutInfo.grafanaInfo),
        map((grafanaInfo: GrafanaInfo): string => {
          return grafanaInfo.url + '/d/scdf-tasks/tasks?refresh=' + grafanaInfo.refreshInterval +
            's&var-job_name=' + jobExecution.name
            + '&var-job_execution_id=' + jobExecution.jobExecutionId
            + '&var-job_instance_id=' + jobExecution.jobInstanceId
            + '&var-step_execution_count=' + jobExecution.stepExecutionCount
            + '&var-task_execution_id=' + jobExecution.taskExecutionId;
        })
      );
  }

}
