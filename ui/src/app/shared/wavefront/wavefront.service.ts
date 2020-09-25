import { Injectable } from '@angular/core';
import { AboutService } from '../api/about.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AboutState } from '../store/about.reducer';
import { Stream } from '../model/stream.model';
import { TaskExecution } from '../model/task-execution.model';
import { Task } from '../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class WavefrontService {

  constructor(private aboutService: AboutService) {
  }

  isAllowed(): Observable<boolean> {
    return this.aboutService
      .getMonitoringType()
      .pipe(
        map(type => type === 'WAVEFRONT')
      );
  }

  getDashboardStreams(): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-streams#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:'*'),q:'',s:Label,tbr:'')))`;
        })
      );
  }

  getDashboardStream(stream: Stream): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:'*'),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${stream.name}),q:'',tbr:'')))`;
        })
      );
  }

  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:${appName}),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${streamName}),q:'',tbr:'')))`;
        })
      );
  }

  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'${guid}'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:${appName}),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:${streamName}),q:'',tbr:'')))`;
        })
      );
  }

  getDashboardTasks(): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:'*'),q:'',tbr:'')))`;
        })
      );
  }

  getDashboardTask(task: Task): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:${task.name}),q:'',tbr:'')))`;
        })
      );
  }

  getDashboardTaskExecution(taskExecution: TaskExecution): Observable<string> {
    return this.aboutService
      .getMonitoring()
      .pipe(
        map((wavefront: any): string => {
          return `${wavefront.url}/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'${taskExecution.executionId}'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:${wavefront.source}),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:${taskExecution.taskName}),q:'',tbr:'')))`;
        })
      );
  }

}
