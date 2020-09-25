import { GrafanaService } from './grafana.service';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { of } from 'rxjs';

describe('shared/grafana/grafana.service.ts', () => {

  let grafanaService;
  let aboutService;

  beforeEach(() => {
    aboutService = new AboutServiceMock();
    grafanaService = new GrafanaService(aboutService);
    aboutService.getMonitoringType = () => {
      return of('GRAFANA');
    };
    aboutService.getMonitoring = () => {
      return of({
        url: 'http://foo',
        refreshInterval: 15,
        dashboardType: 'GRAFANA',
        source: ''
      });
    };
  });

  it('Should be allow', () => {
    grafanaService.isAllowed()
      .subscribe((allow) => {
        expect(allow).toBeTrue();
      });
  });

  it('Should not be allow', () => {
    aboutService.getMonitoringType = () => {
      return of('wavefront');
    };
    grafanaService.isAllowed()
      .subscribe((allow) => {
        expect(allow).toBeFalsy();
      });
  });

  it('Should return the streams URL dashboard', () => {
    grafanaService.getDashboardStreams()
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-streams/streams?refresh=15s');
      });
  });

  it('Should return the stream URL dashboard', () => {
    grafanaService.getDashboardStream({ name: 'bar' })
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-applications/applications?refresh=15s&var-stream_name=bar&var-application_name=All');
      });
  });

  it('Should return the stream application URL dashboard', () => {
    grafanaService.getDashboardApplication('bar1', 'bar2')
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-applications/applications?refresh=15s&var-stream_name=bar1&var-application_name=bar2&var-name=All');
      });
  });

  it('Should return the stream application instance URL dashboard', () => {
    grafanaService.getDashboardApplicationInstance('bar1', 'bar2', 'bar3')
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-applications/applications?refresh=15s&var-stream_name=bar1&var-application_name=bar2&var-name=All&var-application_guid=bar3');
      });
  });

  it('Should return the tasks URL dashboard', () => {
    grafanaService.getDashboardTasks()
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-tasks/tasks?refresh=15s');
      });
  });

  it('Should return the task URL dashboard', () => {
    grafanaService.getDashboardTask({ name: 'bar' })
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-tasks/tasks?refresh=15s&var-task_name=bar&var-task_name=All');
      });
  });

  it('Should return the task execution URL dashboard', () => {
    grafanaService.getDashboardTaskExecution({ taskName: 'bar1', executionId: 'bar2' })
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-tasks/tasks?refresh=15s&var-task_name=bar1&var-task_name=All&var-task_execution_id=bar2');
      });
  });

  it('Should return the job execution URL dashboard', () => {
    grafanaService.getDashboardJobExecution({
      name: 'bar1',
      jobExecutionId: 'bar2',
      jobInstanceId: 'bar3',
      stepExecutionCount: 'bar4',
      taskExecutionId: 'bar5'
    })
      .subscribe((url) => {
        expect(url).toBe('http://foo/d/scdf-tasks/tasks?refresh=15s&var-job_name=bar1&var-job_execution_id=bar2&var-job_instance_id=bar3&var-step_execution_count=bar4&var-task_execution_id=bar5');
      });
  });

});
