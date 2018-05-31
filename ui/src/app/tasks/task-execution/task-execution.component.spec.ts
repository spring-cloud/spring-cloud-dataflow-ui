import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockTasksService } from '../../tests/mocks/tasks';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../shared/pipes/dataflow-duration.pipe';
import * as moment from 'moment';
import { TaskExecutionComponent } from './task-execution.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { NotificationService } from '../../shared/services/notification.service';

describe('TaskExecutionsDetailsComponent', () => {
  let component: TaskExecutionComponent;
  let fixture: ComponentFixture<TaskExecutionComponent>;
  let activeRoute: MockActivatedRoute;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const routingStateService = new MockRoutingStateService();
  const commonTestParams = { id: '1' };
  const commonTestExecutionDetails = {
    1: {
      executionId: 1,
      exitCode: 0,
      taskName: 'footask',
      startTime: moment('2017-08-10T05:46:19.079Z'),
      endTime: moment('2017-08-10T05:46:19.098Z'),
      exitMessage: null,
      arguments: ['--spring.cloud.task.executionid=1'],
      jobExecutionIds: [],
      errorMessage: null,
      externalExecutionId: 'footask-d465ffe7-6874-42f7-ab04-191e9e6c6376'
    }
  };
  const commonTestExecutionDetailsWithJobIds = {
    1: {
      executionId: 1,
      exitCode: 0,
      taskName: 'footask',
      startTime: moment('2017-08-10T05:46:19.079Z'),
      endTime: moment('2017-08-10T05:46:19.098Z'),
      exitMessage: null,
      arguments: ['--spring.cloud.task.executionid=1'],
      jobExecutionIds: [1, 2, 3],
      errorMessage: null,
      externalExecutionId: 'footask-d465ffe7-6874-42f7-ab04-191e9e6c6376'
    }
  };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        TaskExecutionComponent,
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
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExecutionComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    expect(component).toBeTruthy();
  });

/*

  it('Execution details should get populated', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testExecutionDetails = commonTestExecutionDetails;
    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    fixture.detectChanges();
    const expectedStart = moment('2017-08-10T05:46:19.079Z').format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    const expectedStop = moment('2017-08-10T05:46:19.098Z').format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');

    expect(el.textContent).toContain('Task Execution Details - Execution ID: 1');

    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('tbody td'));
    expect(des.length).toBe(26);
    expect(des[0].nativeElement.textContent).toContain('Execution Id');
    expect(des[1].nativeElement.textContent).toContain(commonTestExecutionDetails[1].executionId);
    expect(des[2].nativeElement.textContent).toContain('Task Name');
    expect(des[3].nativeElement.textContent).toContain('footask');
    expect(des[4].nativeElement.textContent).toContain('Arguments');
    expect(des[5].nativeElement.textContent).toContain('--spring.cloud.task.executionid=1');
    expect(des[6].nativeElement.textContent).toContain('External Execution Id');
    expect(des[7].nativeElement.textContent).toContain('footask-d465ffe7-6874-42f7-ab04-191e9e6c6376');
    expect(des[8].nativeElement.textContent).toContain('Start Time');
    expect(des[9].nativeElement.textContent).toContain(expectedStart);
    expect(des[10].nativeElement.textContent).toContain('End Time');
    expect(des[11].nativeElement.textContent).toContain(expectedStop);
    expect(des[12].nativeElement.textContent).toContain('Batch Job');
    expect(des[13].query(By.css('span')).nativeElement.classList.contains('glyphicon-remove')).toBe(true);
    expect(des[14].nativeElement.textContent).toContain('Job Execution Ids');
    expect(des[15].nativeElement.textContent).toContain('N/A');
    expect(des[16].nativeElement.textContent).toContain('Start Time');
    expect(des[17].nativeElement.textContent).toContain(expectedStart);
    expect(des[18].nativeElement.textContent).toContain('End Time');
    expect(des[19].nativeElement.textContent).toContain(expectedStop);
    expect(des[20].nativeElement.textContent).toContain('Duration');
    expect(des[21].nativeElement.textContent).toContain('00:00:00.019');
    expect(des[22].nativeElement.textContent).toContain('Exit Code');
    expect(des[23].nativeElement.textContent).toContain('0');
    expect(des[24].nativeElement.textContent).toContain('Exit Message');
    expect(des[25].nativeElement.textContent).toContain('N/A');
  });

  it('Execution details should get populated with Job Execution Ids', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testExecutionDetails = commonTestExecutionDetailsWithJobIds;

    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    fixture.detectChanges();
    const expectedStart = moment('2017-08-10T05:46:19.079Z').format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');
    const expectedStop = moment('2017-08-10T05:46:19.098Z').format('Y-MM-DD[T]HH:mm:ss.SSS[Z]');

    expect(el.textContent).toContain('Task Execution Details - Execution ID: 1');

    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('tbody td'));
    expect(des.length).toBe(26);
    expect(des[0].nativeElement.textContent).toContain('Execution Id');
    expect(des[1].nativeElement.textContent).toContain(commonTestExecutionDetails[1].executionId);
    expect(des[2].nativeElement.textContent).toContain('Task Name');
    expect(des[3].nativeElement.textContent).toContain('footask');
    expect(des[4].nativeElement.textContent).toContain('Arguments');
    expect(des[5].nativeElement.textContent).toContain('--spring.cloud.task.executionid=1');
    expect(des[6].nativeElement.textContent).toContain('External Execution Id');
    expect(des[7].nativeElement.textContent).toContain('footask-d465ffe7-6874-42f7-ab04-191e9e6c6376');
    expect(des[8].nativeElement.textContent).toContain('Start Time');
    expect(des[9].nativeElement.textContent).toContain(expectedStart);
    expect(des[10].nativeElement.textContent).toContain('End Time');
    expect(des[11].nativeElement.textContent).toContain(expectedStop);
    expect(des[12].nativeElement.textContent).toContain('Batch Job');

    expect(des[13].query(By.css('span')).nativeElement.classList.contains('glyphicon-ok')).toBe(true);
    expect(des[14].nativeElement.textContent).toContain('Job Execution Ids');
    const jobExecutionIdButtons = fixture.debugElement.queryAll(By.css('#jobExecutionIds button'));
    expect(jobExecutionIdButtons.length).toEqual(3);

    expect(jobExecutionIdButtons[0].nativeElement.innerHTML.trim()).toEqual('1');
    expect(jobExecutionIdButtons[1].nativeElement.innerHTML.trim()).toEqual('2');
    expect(jobExecutionIdButtons[2].nativeElement.innerHTML.trim()).toEqual('3');

    expect(des[16].nativeElement.textContent).toContain('Start Time');
    expect(des[17].nativeElement.textContent).toContain(expectedStart);
    expect(des[18].nativeElement.textContent).toContain('End Time');
    expect(des[19].nativeElement.textContent).toContain(expectedStop);
    expect(des[20].nativeElement.textContent).toContain('Duration');
    expect(des[21].nativeElement.textContent).toContain('00:00:00.019');
    expect(des[22].nativeElement.textContent).toContain('Exit Code');
    expect(des[23].nativeElement.textContent).toContain('0');
    expect(des[24].nativeElement.textContent).toContain('Exit Message');
    expect(des[25].nativeElement.textContent).toContain('N/A');
  });

  it('Back button should navigate to tasks executions on click', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testExecutionDetails = commonTestExecutionDetails;
    de = fixture.debugElement.query(By.css('button[type=button]'));
    el = de.nativeElement;
    const navigate = spyOn((<any>component).router, 'navigate');

    fixture.detectChanges();
    el.click();
    expect(navigate).toHaveBeenCalledWith(['tasks/executions']);
  });

  it('Job Execution Id button should navigate to job execution details page on click', () => {
    activeRoute.testParams = commonTestParams;
    tasksService.testExecutionDetails = commonTestExecutionDetailsWithJobIds;

    de = fixture.debugElement.query(By.css('div'));
    el = de.nativeElement;
    fixture.detectChanges();

    const jobExecutionIdButtons = fixture.debugElement.queryAll(By.css('#jobExecutionIds button'));

    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();

    jobExecutionIdButtons[0].nativeElement.click();
    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1']);

    jobExecutionIdButtons[1].nativeElement.click();
    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1']);

    jobExecutionIdButtons[2].nativeElement.click();
    expect(navigate).toHaveBeenCalledWith(['jobs/executions/1']);
  });
*/

});
