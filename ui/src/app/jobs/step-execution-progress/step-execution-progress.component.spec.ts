import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BsDropdownModule, ProgressbarModule, TooltipModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { JobsService } from '../jobs.service';
import { MockJobsService } from '../../tests/mocks/jobs';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { StepExecutionProgressComponent } from './step-execution-progress.component';
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
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

describe('StepExecutionProgressComponent', () => {
  let component: StepExecutionProgressComponent;
  let fixture: ComponentFixture<StepExecutionProgressComponent>;
  let de: DebugElement;
  let el: HTMLElement;
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
        StepExecutionProgressComponent,
        LoaderComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ProgressbarModule.forRoot()
      ],
      providers: [
        { provide: JobsService, useValue: jobsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepExecutionProgressComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate execution progress', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('job1step1');
  });

  it('refresh should refresh data', () => {
    activeRoute.testParams = { jobid: '1', stepid: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    jobsService.testStepExecutionResource = JOBS_EXECUTIONS_1_STEPS_1;
    jobsService.testStepExecutionProgress = JOBS_EXECUTIONS_1_STEPS_1_PROGRESS;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('button[id=refresh]'));
    el = de.nativeElement;
    const refresh = spyOn((<any>component), 'refresh');
    fixture.detectChanges();
    el.click();
    expect(refresh).toHaveBeenCalled();
  });

  /*
  TODO: fix it
  it('back should navigate to step execution details', () => {
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

});
