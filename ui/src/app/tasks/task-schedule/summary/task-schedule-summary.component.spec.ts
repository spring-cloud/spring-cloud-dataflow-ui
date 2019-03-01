import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule, BsDropdownModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { FloModule } from 'spring-flo';
import { ActivatedRoute } from '@angular/router';
import { TaskScheduleSummaryComponent } from './task-schedule-summary.component';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { LoggerService } from '../../../shared/services/logger.service';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../auth/auth.service';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { TasksService } from '../../tasks.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TASK_DEFINITIONS, TASK_SCHEDULES } from '../../../tests/mocks/mock-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * Test {@link TaskScheduleSummaryComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskScheduleSummaryComponent', () => {
  let component: TaskScheduleSummaryComponent;
  let fixture: ComponentFixture<TaskScheduleSummaryComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const commonTestParams = { id: 'foo1' };
  let activeRoute: MockActivatedRoute;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TruncatePipe,
        LoaderComponent,
        TaskScheduleSummaryComponent,
        StreamDslComponent
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: TasksService, useValue: tasksService },
        { provide: LoggerService, useValue: loggerService },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskSchedules = TASK_SCHEDULES;
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskScheduleSummaryComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the schedule informations', () => {
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('.schedule-summary-row'));
    expect(des[0].nativeElement.textContent).toContain('foo1');
    expect(des[1].nativeElement.textContent).toContain('foo');
    expect(des[2].nativeElement.textContent).toContain('bar');
    expect(des[3].nativeElement.textContent).toContain('0 0 0 * 8 1');
  });

});
