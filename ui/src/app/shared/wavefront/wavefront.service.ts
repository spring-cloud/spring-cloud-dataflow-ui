import { Injectable } from '@angular/core';
import { SharedAboutService } from '../services/shared-about.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FeatureInfo } from '../model/about/feature-info.model';
import { AboutInfo } from '../model/about/about-info.model';
import { MonitoringDashboardInfo } from '../model/about/monitoring-dashboard-info.model';
import { StreamDefinition } from '../../streams/model/stream-definition';
import { TaskDefinition } from '../../tasks/model/task-definition';
import { TaskExecution } from '../../tasks/model/task-execution';
import { JobExecution } from '../../jobs/model/job-execution.model';

@Injectable()
export class WavefrontService {

  constructor(private sharedAboutService: SharedAboutService) {
  }

  isAllowed(): Observable<boolean> {
    return this.sharedAboutService
      .getFeatureInfo()
      .pipe(map((featuredInfo: FeatureInfo) => featuredInfo.wavefrontEnabled));
  }

  getDashboardStreams(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-streams`;
        })
      );
  }

  getDashboardStream(stream: StreamDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-streams#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts(%22spring.integration.send.count%22)',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${stream.name}),q:'ts(%22spring.integration.send.count%22,%20source=%22$%7Bsource%7D%22)',s:Label,tbr:'')))`;
        })
      );
  }

  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return '';
        })
      );
  }

  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return '';
        })
      );
  }

  getDashboardTasks(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-tasks`;
        })
      );
  }

  getDashboardTask(task: TaskDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return '';
        })
      );
  }

  getDashboardTaskExecution(taskExecution: TaskExecution): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return '';
        })
      );
  }

  getDashboardJobExecution(jobExecution: JobExecution): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return '';
        })
      );
  }

}
