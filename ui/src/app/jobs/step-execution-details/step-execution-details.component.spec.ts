import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule, ProgressbarModule, TooltipModule } from 'ngx-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JobsService } from '../jobs.service';
import { MockJobsService } from '../../tests/mocks/jobs';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { StepExecutionDetailsComponent } from './step-execution-details.component';
import { JobExecutionStatusComponent } from '../components/job-execution-status.component';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import {
  JOBS_EXECUTIONS, JOBS_EXECUTIONS_1_STEPS_1,
  JOBS_EXECUTIONS_1_STEPS_1_PROGRESS
} from '../../tests/mocks/mock-data';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('StepExecutionDetailsComponent', () => {
  let component: StepExecutionDetailsComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<StepExecutionDetailsComponent>;
  let activeRoute: MockActivatedRoute;
  let jobsService: MockJobsService;
  const notificationService = new MockNotificationService();
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    jobsService = new MockJobsService();
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        StepExecutionDetailsComponent,
        JobExecutionStatusComponent,
        DataflowDurationPipe,
        LoaderComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ProgressbarModule.forRoot(),
        TooltipModule.forRoot()
      ],
      providers: [
        { provide: JobsService, useValue: jobsService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepExecutionDetailsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate execution details', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('job1step1');
    expect(el.textContent).toContain('1');

    let des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=stepExecution] td'));
    expect(des.length).toBe(30);
    expect(des[0].nativeElement.textContent).toContain('Step Execution Id');
    expect(des[1].nativeElement.textContent).toContain('1');
    expect(des[2].nativeElement.textContent).toContain('Job Execution Id');
    expect(des[3].nativeElement.textContent).toContain('1');
    expect(des[4].nativeElement.textContent).toContain('Step Name');
    expect(des[5].nativeElement.textContent).toContain('job1step1');
    expect(des[6].nativeElement.textContent).toContain('Step Type');
    expect(des[7].nativeElement.textContent)
      .toContain('org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1');
    expect(des[8].nativeElement.textContent).toContain('Status');
    expect(des[9].nativeElement.textContent).toContain('COMPLETED');
    expect(des[10].nativeElement.textContent).toContain('Commits');
    expect(des[11].nativeElement.textContent).toContain('1');
    expect(des[12].nativeElement.textContent).toContain('Duration');
    expect(des[13].nativeElement.textContent).toContain('00:00:00.018');
    expect(des[14].nativeElement.textContent).toContain('Filter Count');
    expect(des[15].nativeElement.textContent).toContain('0');
    expect(des[16].nativeElement.textContent).toContain('Process Skips');
    expect(des[17].nativeElement.textContent).toContain('0');
    expect(des[18].nativeElement.textContent).toContain('Reads');
    expect(des[19].nativeElement.textContent).toContain('0');
    expect(des[20].nativeElement.textContent).toContain('Read Skips');
    expect(des[21].nativeElement.textContent).toContain('0');
    expect(des[22].nativeElement.textContent).toContain('Rollbacks');
    expect(des[23].nativeElement.textContent).toContain('0');
    expect(des[24].nativeElement.textContent).toContain('Skips');
    expect(des[25].nativeElement.textContent).toContain('0');
    expect(des[26].nativeElement.textContent).toContain('Writes');
    expect(des[27].nativeElement.textContent).toContain('0');
    expect(des[28].nativeElement.textContent).toContain('Write Skips');
    expect(des[29].nativeElement.textContent).toContain('0');

    des = fixture.debugElement.queryAll(By.css('table[id=stepExecutionContext] td'));
    expect(des.length).toBe(4);
    expect(des[2].nativeElement.textContent).toContain('batch.taskletType');
    expect(des[3].nativeElement.textContent)
      .toContain('org.springframework.cloud.task.app.timestamp.batch.TimestampBatchTaskConfiguration$1');
    expect(des[0].nativeElement.textContent).toContain('batch.stepType');
    expect(des[1].nativeElement.textContent).toContain('org.springframework.batch.core.step.tasklet.TaskletStep');

    de = fixture.debugElement.query(By.css('pre'));
    expect(de).toBeNull();
  });

  /*
  TODO: fix it
  it('back should navigate to jobs executions', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('button[id=back]'));
    el = de.nativeElement;
    const navigate = spyOn(routingStateService, 'back');
    fixture.detectChanges();
    el.click();
    expect(navigate).toHaveBeenCalled();
  });
  */

  it('stats should navigate to step execution progress', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('button[id=stats]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    el.click();
    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1/1/progress']);
  });

  /*
  it('should show No Step Execution available.', () => {
    activeRoute.testParams = { jobid: '1', stepid: '3' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('Step Execution Details - Step Execution ID: 3');

    de = fixture.debugElement.query(By.css('div[id=nostepexecution]'));
    el = de.nativeElement;
    expect(el.textContent).toContain('No Step Execution available.');
  });
  */

});
