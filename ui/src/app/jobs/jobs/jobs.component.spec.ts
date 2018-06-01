import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { JobsComponent } from './jobs.component';
import { DefinitionStatusComponent } from '../components/definition-status.component';
import { JobExecutionStatusComponent } from '../components/job-execution-status.component';
import { SearchfilterPipe } from '../../shared/pipes/search-filter.pipe';
import { JobsService } from '../jobs.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockJobsService } from '../../tests/mocks/jobs';
import { BusyService } from '../../shared/services/busy.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { JOB_EXECUTIONS_WITH_PAGINATION } from '../../tests/mocks/mock-data';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { MockConfirmService } from '../../tests/mocks/confirm';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { NotificationService } from '../../shared/services/notification.service';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  const notificationService = new MockNotificationService();
  const jobsService = new MockJobsService();
  const comfirmService = new MockConfirmService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobsComponent,
        SearchfilterPipe,
        JobExecutionStatusComponent,
        DefinitionStatusComponent,
        PagerComponent
      ],
      imports: [
        NgBusyModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: BusyService, useValue: new BusyService() },
        { provide: JobsService, useValue: jobsService },
        { provide: ConfirmService, useValue: comfirmService },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    jobsService.setJobExecutions(JOB_EXECUTIONS_WITH_PAGINATION);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate task definitions', () => {
    jobsService.setJobExecutions(JOB_EXECUTIONS_WITH_PAGINATION);
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=tableJobs] tr:first-child td'));
    expect(des.length).toBe(8);
    expect(des[0].nativeElement.textContent).toContain('4');
    expect(des[1].nativeElement.textContent).toContain('job4');
    expect(des[2].nativeElement.textContent).toContain('95');
    expect(des[3].nativeElement.textContent).toContain('4');
    expect(des[4].nativeElement.textContent).toContain('2017-09-06');
    expect(des[5].nativeElement.textContent).toContain('1');
    expect(des[6].nativeElement.textContent).toContain('STARTED');
  });

  describe('no job', () => {

    beforeEach(() => {
      jobsService.setJobExecutions({
        _embedded: {
          taskDefinitionResourceList: []
        },
        page: {
          size: 30,
          totalElements: 0,
          totalPages: 1
        }
      });
      fixture.detectChanges();
    });

    it('should display a message', () => {
      const message = fixture.debugElement.query(By.css('#empty')).nativeElement;
      fixture.detectChanges();
      expect(message).toBeTruthy();
    });

    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#tableJobs'));
      expect(table).toBeNull();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('One page', () => {

    beforeEach(() => {
      jobsService.setJobExecutions(JOB_EXECUTIONS_WITH_PAGINATION);
      fixture.detectChanges();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#tableJobs')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });


  describe('At least 2 pages', () => {

    beforeEach(() => {

      jobsService.setJobExecutions({
        _embedded: {
          jobExecutionResourceList: Array.from({ length: 30 }).map((a, i) => {
            return {
              executionId: 2,
              stepExecutionCount: 1,
              jobId: i,
              taskExecutionId: 95,
              name: `job${i}`,
              startDate: '2017-09-06',
              startTime: '00:54:46',
              duration: '00:00:00',
              jobExecution: {
                id: i,
                version: 2,
                jobParameters: {
                  parameters: {},
                  empty: true
                },
                jobInstance: {
                  id: i,
                  version: null,
                  jobName: `job${i}`,
                  instanceId: 2
                },
                stepExecutions: [
                  {
                    id: 2,
                    version: 3,
                    stepName: `job${i}step1`,
                    status: 'COMPLETED',
                    readCount: 0,
                    writeCount: 0,
                    commitCount: 1,
                    rollbackCount: 0,
                    readSkipCount: 0,
                    processSkipCount: 0,
                    writeSkipCount: 0,
                    startTime: '2017-09-06T00:54:46.000Z',
                    endTime: '2017-09-06T00:54:46.000Z',
                    lastUpdated: '2017-09-06T00:54:46.000Z',
                    executionContext: {
                      dirty: false,
                      empty: true,
                      values: []
                    },
                    exitStatus: {
                      exitCode: 'COMPLETED',
                      exitDescription: '',
                      running: false
                    },
                    terminateOnly: false,
                    filterCount: 0,
                    failureExceptions: [],
                    jobExecutionId: 2,
                    jobParameters: {
                      parameters: {},
                      empty: true
                    },
                    skipCount: 0,
                    summary: 'StepExecution: id=2, version=3, name=job2step1, status=COMPLETED, exitStatus=COMPLETED, ' +
                    'readCount=0, filterCount=0, writeCount=0 readSkipCount=0, writeSkipCount=0, processSkipCount=0,' +
                    ' commitCount=1, rollbackCount=0'
                  }
                ],
                status: 'COMPLETED',
                startTime: '2017-09-06T00:54:46.000Z',
                createTime: '2017-09-06T00:54:46.000Z',
                endTime: '2017-09-06T00:54:46.000Z',
                lastUpdated: '2017-09-06T00:54:46.000Z',
                exitStatus: {
                  exitCode: 'COMPLETED',
                  exitDescription: '',
                  running: false
                },
                executionContext: {
                  dirty: false,
                  empty: true,
                  values: []
                },
                failureExceptions: [],
                jobConfigurationName: null,
                running: false,
                jobId: i,
                stopping: false,
                allFailureExceptions: []
              },
              jobParameters: {},
              jobParametersString: '',
              restartable: false,
              abandonable: false,
              stoppable: false,
              defined: false,
              timeZone: 'UTC',
              _links: {
                self: {
                  href: 'http://localhost:9393/jobs/executions/' + i
                }
              }
            };
          })
        },
        page: {
          size: 30,
          totalElements: 40,
          totalPages: 2
        }
      });

      fixture.detectChanges();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#tableJobs')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      expect(pagination).toBeTruthy();
    });

    it('should change the page', () => {
      fixture.detectChanges();
      const buttonPage2 = fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement;
      buttonPage2.click();
      fixture.detectChanges();
      expect(component.params.page).toBe(1);
    });

  });

  describe('Job action', () => {

    beforeEach(() => {
      jobsService.jobsContext.page = 0;
      jobsService.setJobExecutions(JOB_EXECUTIONS_WITH_PAGINATION);
      fixture.detectChanges();
    });

    it('should stop a job', () => {
      const button: DebugElement = fixture.debugElement
        .queryAll(By.css('#tableJobs tbody tr'))[0]
        .query(By.css('.actions button[name=job-stop0]'));

      const spy = spyOn(component, 'stopJob');
      button.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should restart a job', () => {
      const button: DebugElement = fixture.debugElement
        .queryAll(By.css('#tableJobs tbody tr'))[1]
        .query(By.css('.actions button[name=job-restart1]'));

      const spy = spyOn(component, 'restartJob');
      button.nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail job', () => {
      const button: DebugElement = fixture.debugElement
        .queryAll(By.css('#tableJobs tbody tr'))[2]
        .query(By.css('.actions button[name="job-details2"]'));

      const navigate = spyOn((<any>component).router, 'navigate');
      button.nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['jobs/executions/2']);
    });

    it('Should navigate to the task page.', () => {
      const link: DebugElement = fixture.debugElement
        .queryAll(By.css('#tableJobs tbody tr'))[0]
        .queryAll(By.css('td'))[2]
        .query(By.css('a'));

      const navigate = spyOn((<any>component).router, 'navigate');
      link.nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/executions/95']);
    });

  });

});
