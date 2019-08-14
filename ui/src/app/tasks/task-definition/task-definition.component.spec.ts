import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockNotificationService } from '../../tests/mocks/notification';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { TaskDefinitionComponent } from './task-definition.component';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TASK_DEFINITIONS, TASK_EXECUTIONS, TASK_SCHEDULES } from '../../tests/mocks/mock-data';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { MockAuthService } from '../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { AuthService } from '../../auth/auth.service';
import { LoggerService } from '../../shared/services/logger.service';
import { MockModalService } from '../../tests/mocks/modal';
import { BsDropdownModule, BsModalService, TooltipModule } from 'ngx-bootstrap';
import { By } from '@angular/platform-browser';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TaskStatusComponent } from '../components/task-status/task-status.component';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link TaskDefinitionComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionComponent', () => {
  let component: TaskDefinitionComponent;
  let fixture: ComponentFixture<TaskDefinitionComponent>;
  let activeRoute: MockActivatedRoute;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const commonTestParams = { id: 'foo' };
  const routingStateService = new MockRoutingStateService();
  const loggerService = new LoggerService();
  const modalService = new MockModalService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskDefinitionComponent,
        DataflowDateTimePipe,
        PagerComponent,
        LoaderComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        TaskStatusComponent,
        TippyDirective
      ],
      imports: [
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: TasksService, useValue: tasksService },
        { provide: BsModalService, useValue: modalService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    aboutService.dataflowVersionInfo.featureInfo.schedulesEnabled = false;
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    tasksService.taskSchedules = TASK_SCHEDULES;
    tasksService.taskExecutions = TASK_EXECUTIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Task action', () => {

    beforeEach(() => {
      aboutService.dataflowVersionInfo.featureInfo.schedulesEnabled = true;
      fixture.detectChanges();
    });

    it('should delete the task', () => {
      const spy = spyOn(component, 'destroy');
      fixture.debugElement.query(By.css('#task-remove')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should launch the task', () => {
      const spy = spyOn(component, 'launch');
      fixture.debugElement.query(By.css('#task-launch')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should schedule the task', () => {
      const spy = spyOn(component, 'schedule');
      fixture.debugElement.query(By.css('#task-schedule')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

  });

});
