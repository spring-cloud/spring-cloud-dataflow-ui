import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GrafanaJobExecutionDirective,
  GrafanaRuntimeAppDirective, GrafanaRuntimeInstanceDirective,
  GrafanaStreamDirective,
  GrafanaStreamsDirective,
  GrafanaTaskDirective, GrafanaTaskExecutionDirective,
  GrafanaTasksDirective
} from './grafana.directive';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AboutService } from '../api/about.service';
import { RuntimeApp, RuntimeAppInstance } from '../model/runtime.model';

@Component({
  template: `
    <div>
      <button name="bt1" type="button" grafanaDashboardStreams>Dashboard</button>
      <button name="bt2" type="button" [stream]="{name: 'bar'}" grafanaDashboardStream>Dashboard</button>
      <button name="bt3" type="button" grafanaDashboardTasks>Dashboard</button>
      <button name="bt4" type="button" [task]="{name: 'bar'}" grafanaDashboardTask>Dashboard</button>
      <button name="bt5" type="button"
              [runtimeApp]="runtimeApp"
              grafanaDashboardRuntimeApp>
        Dashboard
      </button>
      <button name="bt6" type="button"
              [instance]="runtimeAppInstance"
              grafanaDashboardRuntimeInstance>
        Dashboard
      </button>
      <button name="bt7" type="button"
              [taskExecution]="{taskName: 'bar1', executionId: 'bar2'}"
              grafanaDashboardTaskExecution>
        Dashboard
      </button>
      <button name="bt8" type="button"
              [jobExecution]="{name: 'bar1', jobExecutionId: 'bar2', jobInstanceId: 'bar3', stepExecutionCount: 'bar4', taskExecutionId: 'bar5'}"
              grafanaDashboardJobExecution>
        Dashboard
      </button>
    </div>`
})
class TestGrafanaDirectivesComponent {
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

describe('shared/grafana/grafana.directive.ts', () => {

  let aboutService;
  let component: TestGrafanaDirectivesComponent;
  let fixture: ComponentFixture<TestGrafanaDirectivesComponent>;

  beforeEach(() => {

    aboutService = new AboutServiceMock();
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

    TestBed.configureTestingModule({
      declarations: [
        TestGrafanaDirectivesComponent,
        GrafanaStreamDirective,
        GrafanaStreamsDirective,
        GrafanaTasksDirective,
        GrafanaTaskDirective,
        GrafanaRuntimeAppDirective,
        GrafanaRuntimeInstanceDirective,
        GrafanaTaskExecutionDirective,
        GrafanaJobExecutionDirective,
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
    fixture = TestBed.createComponent(TestGrafanaDirectivesComponent);
    component = fixture.componentInstance;
  });

  it('Should open the streams dashboard', async () => {
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt1]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-streams/streams?refresh=15s');
  });

  it('Should open the stream dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt2]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-applications/applications?refresh=15s' +
      '&var-stream_name=bar&var-application_name=All');
  });

  it('Should open the tasks dashboard', async () => {
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt3]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-tasks/tasks?refresh=15s');
  });

  it('Should open the task dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt4]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-tasks/tasks?refresh=15s&var-task_name=bar' +
      '&var-task_name=All');
  });

  it('Should open the stream app dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt5]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-applications/applications?refresh=15s' +
      '&var-stream_name=bar1&var-application_name=bar2&var-name=All');
  });

  it('Should open the stream app instance dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt6]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-applications/applications?refresh=15s' +
      '&var-stream_name=bar1&var-application_name=bar2&var-name=All&var-application_guid=bar3');
  });

  it('Should open the task execution dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt7]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-tasks/tasks?refresh=15s&var-task_name=bar1' +
      '&var-task_name=All&var-task_execution_id=bar2');
  });

  it('Should open the job execution dashboard', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const spy = spyOn(window, 'open').and.callThrough();
    const btn = fixture.debugElement.query(By.css('button[name=bt8]'));
    btn.triggerEventHandler('click', null);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith('http://foo/d/scdf-tasks/tasks?refresh=15s&var-job_name=bar1' +
      '&var-job_execution_id=bar2&var-job_instance_id=bar3&var-step_execution_count=bar4&var-task_execution_id=bar5');
  });

});
