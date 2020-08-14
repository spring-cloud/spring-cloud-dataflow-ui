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
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-streams#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts(%22spring.integration.send.count%22)',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:'*'),q:'ts(%22spring.integration.send.count%22,%20source=%22$%7Bsource%7D%22)',s:Label,tbr:'')))`;
        })
      );
  }

  getDashboardStream(stream: StreamDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:'*'),q:'lag(10s, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}"))',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and (name="input" or name="output") and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.integration.send.count")',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${stream.name}),q:'ts("spring.integration.send.count", source="\${source}")',tbr:'')))`;
        })
      );
  }

  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:${appName}),q:'lag(10s, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}"))',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and (name="input" or name="output") and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.integration.send.count")',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${streamName}),q:'ts("spring.integration.send.count", source="\${source}")',tbr:'')))`;
        })
      );
  }

  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'${guid}'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:${appName}),q:'lag(10s, ts("spring.integration.send.count", source="\${source}" and stream.name="\${stream_name}"))',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'hideAfter(1m, ts("spring.integration.send.count", source="\${source}" and (name="input" or name="output") and stream.name="\${stream_name}" and application.name="\${application_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.integration.send.count")',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${streamName}),q:'ts("spring.integration.send.count", source="\${source}")',tbr:'')))`;
        })
      );
  }

  getDashboardTasks(): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'lag(10s, ts("spring.cloud.task.count", source="\${source}" and task.name="\${task_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.cloud.task.count")',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:'*'),q:'ts("spring.cloud.task.count", source="\${source}")',tbr:'')))`;
        })
      );
  }

  getDashboardTask(task: TaskDefinition): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'lag(10s, ts("spring.cloud.task.count", source="\${source}" and task.name="\${task_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.cloud.task.count")',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:${task.name}),q:'ts("spring.cloud.task.count", source="\${source}")',tbr:'')))`;
        })
      );
  }

  getDashboardTaskExecution(taskExecution: TaskExecution): Observable<string> {
    return this.sharedAboutService
      .getAboutInfo()
      .pipe(
        map((aboutInfo: AboutInfo): MonitoringDashboardInfo => aboutInfo.monitoringDashboardInfo),
        map((monitoringDashboardInfo: MonitoringDashboardInfo): string => {
          return `${monitoringDashboardInfo.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:${taskExecution.executionId}),q:'lag(10s, ts("spring.cloud.task.count", source="\${source}" and task.name="\${task_name}"))',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${monitoringDashboardInfo.source}),q:'ts("spring.cloud.task.count")',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:${taskExecution.taskName}),q:'ts("spring.cloud.task.count", source="\${source}")',tbr:'')))`;
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
