import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TaskSummaryComponent } from './task-summary.component';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { MockToastyService } from '../../../tests/mocks/toasty';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { BusyService } from '../../../shared/services/busy.service';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../../shared/pipes/dataflow-duration.pipe';
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

/**
 * Test {@link TaskSummaryComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskSummaryComponent', () => {
  let component: TaskSummaryComponent;
  let fixture: ComponentFixture<TaskSummaryComponent>;
  let activeRoute: MockActivatedRoute;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const modalService = new MockModalService();
  const busyService = new BusyService();
  const commonTestParams = { id: 'foo' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskSummaryComponent,
        DataflowDateTimePipe,
        DataflowDurationPipe,
        AppTypeComponent,
        TaskStatusComponent,
        StreamDslComponent,
        LoaderComponent
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
        { provide: BusyService, useValue: busyService },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskSummaryComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
