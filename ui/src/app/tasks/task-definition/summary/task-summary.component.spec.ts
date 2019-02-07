import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskSummaryComponent } from './task-summary.component';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';
import { TasksService } from '../../tasks.service';
import { TASK_DEFINITIONS } from '../../../tests/mocks/mock-data';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { TaskStatusComponent } from '../../components/task-status/task-status.component';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { AuthService } from '../../../auth/auth.service';
import { MockModalService } from '../../../tests/mocks/modal';
import { BsModalService } from 'ngx-bootstrap';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MockToolsService } from '../../../tests/mocks/mock-tools';
import { ToolsService } from '../../components/flo/tools.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Test {@link TaskSummaryComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskSummaryComponent', () => {
  let component: TaskSummaryComponent;
  let fixture: ComponentFixture<TaskSummaryComponent>;
  let activeRoute: MockActivatedRoute;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const modalService = new MockModalService();
  const toolsService = new MockToolsService();
  const commonTestParams = { id: 'foo' };
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskSummaryComponent,
        DataflowDateTimePipe,
        AppTypeComponent,
        TaskStatusComponent,
        StreamDslComponent,
        LoaderComponent
      ],
      imports: [
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
        { provide: ToolsService, useValue: toolsService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskSummaryComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
