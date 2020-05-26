import { GrafanaService } from '../../shared/grafana/grafana.service';
import { Observable, of } from 'rxjs';
import { Stream } from '../../shared/model/stream.model';
import { Task } from '../../shared/model/task.model';
import { TaskExecution } from '../../shared/model/task-execution.model';
import { JobExecution } from '../../shared/model/job.model';

export class GrafanaServiceMock {

  static mock: GrafanaServiceMock = null;

  isAllowed(): Observable<boolean> {
    return of(true);
  }

  getDashboardStreams(): Observable<string> {
    return of('http://localhost:3000/d/scdf-streams/streams?refresh=15s');
  }

  getDashboardStream(stream: Stream): Observable<string> {
    return of('http://localhost:3000/d/scdf-applications/applications?refresh=15s&var-stream_name=' +
      stream.name + '&var-application_name=All');
  }

  getDashboardApplication(streamName: string, appName: string): Observable<string> {
    return of('http://localhost:3000/d/scdf-applications/applications?refresh=15s&var-stream_name=' + streamName
      + '&var-application_name=' + appName + '&var-name=All');
  }

  getDashboardApplicationInstance(streamName: string, appName: string, guid: string): Observable<string> {
    return of('http://localhost:3000/d/scdf-applications/applications?refresh=15s&var-stream_name=' + streamName
      + '&var-application_name=' + appName +
      '&var-name=All&var-application_guid=' + guid);
  }

  getDashboardTasks(): Observable<string> {
    return of('http://localhost:3000/d/scdf-tasks/tasks?refresh=15s');
  }

  getDashboardTask(task: Task): Observable<string> {
    return of('http://localhost:3000/d/scdf-tasks/tasks?refresh=15s&var-task_name=' + task.name
      + '&var-task_name=All');
  }

  getDashboardTaskExecution(execution: TaskExecution): Observable<string> {
    return of('http://localhost:3000/d/scdf-tasks/tasks?refresh=15s&var-task_name=' + execution.taskName
      + '&var-task_name=All' + '&var-task_execution_id='
      + execution.executionId);
  }

  getDashboardJobExecution(jobExecution: JobExecution): Observable<string> {
    return of('http://localhost:3000/d/scdf-tasks/tasks?refresh=15s&var-job_name=' + jobExecution.name
      + '&var-job_execution_id=' + jobExecution.jobExecutionId + '&var-job_instance_id=' + jobExecution.jobInstanceId
      + '&var-step_execution_count=' + jobExecution.stepExecutionCount
      + '&var-task_execution_id=' + jobExecution.taskExecutionId);
  }

  static get provider() {
    if (!GrafanaServiceMock.mock) {
      GrafanaServiceMock.mock = new GrafanaServiceMock();
    }
    return { provide: GrafanaService, useValue: GrafanaServiceMock.mock };
  }

}
