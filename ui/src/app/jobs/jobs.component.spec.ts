import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { NgxPaginationModule } from 'ngx-pagination';
import { JobsComponent } from './jobs.component';
import { DefinitionStatusComponent } from './components/definition-status.component';
import { JobExecutionStatusComponent } from './components/job-execution-status.component';
import { SearchfilterPipe } from '../shared/pipes/search-filter.pipe';
import { JobsService } from './jobs.service';
import { MockNotificationService } from '../tests/mocks/notification';
import { RouterTestingModule } from '@angular/router/testing';
import { MockJobsService } from '../tests/mocks/jobs';
import { BusyService } from '../shared/services/busy.service';
import { NotificationService } from '../shared/services/notification.service';
import { LoggerService } from '../shared/services/logger.service';

describe('JobsComponent', () => {
  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;
  const notificationService = new MockNotificationService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    const jobsService = new MockJobsService();
    TestBed.configureTestingModule({
      declarations: [
        JobsComponent,
        SearchfilterPipe,
        JobExecutionStatusComponent,
        DefinitionStatusComponent
      ],
      imports: [
        NgBusyModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: BusyService, useValue: new BusyService()},
        { provide: JobsService, useValue: jobsService},
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
