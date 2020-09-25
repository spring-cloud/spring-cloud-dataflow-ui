import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AboutService } from '../api/about.service';
import { RuntimeApp, RuntimeAppInstance } from '../model/runtime.model';
import {
  WavefrontRuntimeAppDirective, WavefrontRuntimeInstanceDirective,
  WavefrontStreamDirective,
  WavefrontStreamsDirective,
  WavefrontTaskDirective, WavefrontTaskExecutionDirective,
  WavefrontTasksDirective
} from './wavefront.directive';

@Component({
  template: `
    <div>
      <button name="bt1" type="button" wavefrontDashboardStreams>Dashboard</button>
      <button name="bt2" type="button" [stream]="{name: 'bar'}" wavefrontDashboardStream>Dashboard</button>
      <button name="bt3" type="button" wavefrontDashboardTasks>Dashboard</button>
      <button name="bt4" type="button" [task]="{name: 'bar'}" wavefrontDashboardTask>Dashboard</button>
      <button name="bt5" type="button"
              [runtimeApp]="runtimeApp"
              wavefrontDashboardRuntimeApp>
        Dashboard
      </button>
      <button name="bt6" type="button"
              [instance]="runtimeAppInstance"
              wavefrontDashboardRuntimeInstance>
        Dashboard
      </button>
      <button name="bt7" type="button"
              [taskExecution]="{taskName: 'bar1', executionId: 'bar2'}"
              wavefrontDashboardTaskExecution>
        Dashboard
      </button>
    </div>`
})
class TestWavefrontDirectivesComponent {
  runtimeApp;
  runtimeAppInstance;

  constructor() {
    this.runtimeApp = new RuntimeApp();
    this.runtimeApp.appInstances = [
      {
        attributes: {
          'skipper.application.name': 'bar2',
          'skipper.release.name': 'bar1',
        }
      }
    ];
    this.runtimeAppInstance = new RuntimeAppInstance();
    this.runtimeAppInstance.attributes = {
      'skipper.application.name': 'bar2',
      'skipper.release.name': 'bar1',
      'guid': 'bar3'
    };
  }
}

describe('shared/wavefront/wavefront.directive.ts', () => {

  let aboutService;
  let component: TestWavefrontDirectivesComponent;
  let fixture: ComponentFixture<TestWavefrontDirectivesComponent>;

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

    TestBed.configureTestingModule({
      declarations: [
        TestWavefrontDirectivesComponent,
        WavefrontStreamsDirective,
        WavefrontStreamDirective,
        WavefrontTasksDirective,
        WavefrontTaskDirective,
        WavefrontRuntimeAppDirective,
        WavefrontRuntimeInstanceDirective,
        WavefrontTaskExecutionDirective,
      ],

      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AboutService, useValue: aboutService }
      ]
    });
    fixture = TestBed.createComponent(TestWavefrontDirectivesComponent);
    component = fixture.componentInstance;
  });

  it('Should open the streams dashboard', async () => {
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt1]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-streams#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:'*'),q:'',s:Label,tbr:'')))`);
  });

  it('Should open the stream dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt2]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:'*'),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar),q:'',tbr:'')))`);
  });

  it('Should open the tasks dashboard', async () => {
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt3]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:'*'),q:'',tbr:'')))`);
  });

  it('Should open the task dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt4]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:bar),q:'',tbr:'')))`);
  });

  it('Should open the stream app dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt5]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'*'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:bar2),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar1),q:'',tbr:'')))`);
  });

  it('Should open the stream app instance dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt6]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-applications#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(application_guid:(d:Label,f:TAG_KEY,k:application.guid,l:guid,m:(Label:'bar3'),q:'',tbr:''),application_name:(d:Label,f:TAG_KEY,k:application.name,l:application,m:(Label:bar2),q:'',tbr:''),channel_name:(d:Label,f:TAG_KEY,k:name,l:channel,m:(Label:'*'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),stream_name:(d:Label,f:TAG_KEY,k:stream.name,l:stream,m:(Label:bar1),q:'',tbr:'')))`);
  });

  it('Should open the task execution dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt7]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(`http://foo/dashboards/integration-scdf-tasks#_v01(g:(d:7200,ls:!t,s:0,w:'2h'),p:(execution_id:(d:Label,f:TAG_KEY,k:task.execution.id,l:execution,m:(Label:'bar2'),q:'',tbr:''),source:(d:Label,f:SOURCE,k:'',l:source,m:(Label:bar1),q:'',s:Label,tbr:''),task_name:(d:Label,f:TAG_KEY,k:task.name,l:task,m:(Label:bar1),q:'',tbr:'')))`);
  });

});
