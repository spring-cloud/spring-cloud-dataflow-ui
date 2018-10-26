import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JobExecutionDetailsComponent } from './job-execution-details.component';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { DebugElement } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockJobsService } from '../../tests/mocks/jobs';
import { JobsService } from '../jobs.service';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import { JobExecutionStatusComponent } from '../components/job-execution-status.component';
import { JOBS_EXECUTIONS } from '../../tests/mocks/mock-data';
import { MockNotificationService } from '../../tests/mocks/notification';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateTime } from 'luxon';
import { DateTimeUtils } from '../../shared/support/date-time.utils';

describe('JobExecutionDetailsComponent', () => {
  let component: JobExecutionDetailsComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<JobExecutionDetailsComponent>;
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
        JobExecutionDetailsComponent,
        JobExecutionStatusComponent,
        DataflowDateTimePipe,
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
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([])
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
    fixture = TestBed.createComponent(JobExecutionDetailsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    activeRoute.testParams = { id: '1' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate execution details', () => {
    activeRoute.testParams = { id: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('h1'));
    el = de.nativeElement;
    expect(el.textContent).toContain('job1');
    expect(el.textContent).toContain('(1)');

    let des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=jobExecution] td'));
    expect(des.length).toBe(24);
    expect(des[0].nativeElement.textContent).toContain('Id');
    expect(des[1].nativeElement.textContent).toContain('1');
    expect(des[2].nativeElement.textContent).toContain('Job Name');
    expect(des[3].nativeElement.textContent).toContain('job1');
    expect(des[4].nativeElement.textContent).toContain('Job Instance');
    expect(des[5].nativeElement.textContent).toContain('1');
    expect(des[6].nativeElement.textContent).toContain('Task Execution Id');
    expect(des[7].nativeElement.textContent).toContain('2');
    expect(des[8].nativeElement.textContent).toContain('Job Parameters');
    expect(des[9].nativeElement.textContent).toContain('--spring.cloud.task.executionid=2');
    expect(des[10].nativeElement.textContent).toContain('Start Time');
    expect(des[11].nativeElement.textContent).toContain(DateTimeUtils.formatAsDateTime(DateTime.fromISO('2017-08-11T06:15:50.027Z')));
    expect(des[12].nativeElement.textContent).toContain('End Time');
    expect(des[13].nativeElement.textContent).toContain(DateTimeUtils.formatAsDateTime(DateTime.fromISO('2017-08-11T06:15:50.067Z')));
    expect(des[14].nativeElement.textContent).toContain('Duration');
    expect(des[15].nativeElement.textContent).toContain('00:00:00.040');
    expect(des[16].nativeElement.textContent).toContain('Status');
    expect(des[17].nativeElement.textContent).toContain('COMPLETED');
    expect(des[18].nativeElement.textContent).toContain('Exit Code');
    expect(des[19].nativeElement.textContent).toContain('COMPLETED');
    expect(des[20].nativeElement.textContent).toContain('Exit Message');
    expect(des[21].nativeElement.textContent).toBe('');
    expect(des[22].nativeElement.textContent).toContain('Step Execution Count');
    expect(des[23].nativeElement.textContent).toContain('1');

    des = fixture.debugElement.queryAll(By.css('table[id=stepExecutions] td'));
    expect(des.length).toBe(9);
    expect(des[0].nativeElement.textContent).toContain('1');
    expect(des[1].nativeElement.textContent).toContain('job1step1');
    expect(des[2].nativeElement.textContent).toContain('0');
    expect(des[3].nativeElement.textContent).toContain('0');
    expect(des[4].nativeElement.textContent).toContain('1');
    expect(des[5].nativeElement.textContent).toContain('0');
    expect(des[6].nativeElement.textContent).toContain('00:00:00.018');
  });

/*
  it('back should navigate to jobs executions', () => {
    activeRoute.testParams = { id: '1' };
    jobsService.testJobExecutions = JOBS_EXECUTIONS;
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('#button-back'));
    el = de.nativeElement;

    const navigate = spyOn(routingStateService, 'back');
    fixture.detectChanges();
    el.click();

    expect(navigate).toHaveBeenCalled();
  });
*/

  /*
  it('should show No Job Execution available.', () => {
    activeRoute.testParams = { id: '3' };
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    expect(el.textContent).toContain('No Job Execution available.');
  });
  */

});
