import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockToastyService } from '../../tests/mocks/toasty';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import { TaskDefinitionComponent } from './task-definition.component';
import { BusyService } from '../../shared/services/busy.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TASK_DEFINITIONS } from '../../tests/mocks/mock-data';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';

/**
 * Test {@link TaskDefinitionComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionComponent', () => {
  let component: TaskDefinitionComponent;
  let fixture: ComponentFixture<TaskDefinitionComponent>;
  let activeRoute: MockActivatedRoute;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();
  const busyService = new BusyService();
  const commonTestParams = { id: 'foo' };
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
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
        { provide: TasksService, useValue: tasksService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: BusyService, useValue: busyService },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
