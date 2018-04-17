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
import { BusyService } from '../../shared/services/busy.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TASK_DEFINITIONS } from '../../tests/mocks/mock-data';
import { TaskLaunchComponent } from './task-launch.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

/**
 * Test {@link TaskLaunchComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskLaunchComponent', () => {
  let component: TaskLaunchComponent;
  let fixture: ComponentFixture<TaskLaunchComponent>;
  let activeRoute: MockActivatedRoute;
  const toastyService = new MockToastyService();
  const tasksService = new MockTasksService();
  const busyService = new BusyService();
  const commonTestParams = { id: 'foo' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        TaskLaunchComponent,
        DataflowDateTimePipe,
        DataflowDurationPipe,
        LoaderComponent
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
        { provide: BusyService, useValue: busyService },
        { provide: ToastyService, useValue: toastyService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskLaunchComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
