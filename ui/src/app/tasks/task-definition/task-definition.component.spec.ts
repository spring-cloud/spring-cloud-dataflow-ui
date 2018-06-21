import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockNotificationService } from '../../tests/mocks/notification';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import { TaskDefinitionComponent } from './task-definition.component';
import { BusyService } from '../../shared/services/busy.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TASK_DEFINITIONS } from '../../tests/mocks/mock-data';
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
import { BsModalService } from 'ngx-bootstrap';

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
  const busyService = new BusyService();
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
        DataflowDurationPipe
      ],
      imports: [
        NgBusyModule,
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
        { provide: BusyService, useValue: busyService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
