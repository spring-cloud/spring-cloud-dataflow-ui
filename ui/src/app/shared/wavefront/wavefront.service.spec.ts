import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { of } from 'rxjs';
import { WavefrontService } from './wavefront.service';

describe('shared/wavefront/wavefront.service.ts', () => {

  let wavefrontService;
  let aboutService;

  beforeEach(() => {
    aboutService = new AboutServiceMock();
    aboutService.getMonitoringType = () => {
      return of('WAVEFRONT');
    };
    aboutService.getMonitoring = () => {
      return of({
        url: 'http://foo',
        refreshInterval: 15,
        dashboardType: 'WAVEFRONT',
        source: 'bar1'
      });
    };
    wavefrontService = new WavefrontService(aboutService);
  });

  it('Should be allow', () => {
    wavefrontService.isAllowed()
      .subscribe((allow) => {
        expect(allow).toBeTrue();
      });
  });

  it('Should not be allow', () => {
    aboutService.getMonitoringType = () => {
      return of('GRAFANA');
    };
    wavefrontService.isAllowed()
      .subscribe((allow) => {
        expect(allow).toBeFalsy();
      });
  });

  it('Should return the streams URL dashboard', () => {
    wavefrontService.getDashboardStreams()
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-streams#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:'*'),q:'',s:Label,tbr:'')))`);
      });
  });

  it('Should return the stream URL dashboard', () => {
    wavefrontService.getDashboardStream({ name: 'bar' })
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:'*'),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar),q:'',tbr:'')))`);
      });
  });

  it('Should return the stream application URL dashboard', () => {
    wavefrontService.getDashboardApplication('bar1', 'bar2')
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:bar2),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar1),q:'',tbr:'')))`);
      });
  });

  it('Should return the stream application instance URL dashboard', () => {
    wavefrontService.getDashboardApplicationInstance('bar1', 'bar2', 'bar3')
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'bar3'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:bar2),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar1),q:'',tbr:'')))`);
      });
  });

  it('Should return the tasks URL dashboard', () => {
    wavefrontService.getDashboardTasks()
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:'*'),q:'',tbr:'')))`);
      });
  });

  it('Should return the task URL dashboard', () => {
    wavefrontService.getDashboardTask({ name: 'bar' })
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:bar),q:'',tbr:'')))`);
      });
  });

  it('Should return the task execution URL dashboard', () => {
    wavefrontService.getDashboardTaskExecution({ taskName: 'bar1', executionId: 'bar2' })
      .subscribe((url) => {
        expect(url).toBe(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'bar2'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:bar1),q:'',tbr:'')))`);
      });
  });

});
