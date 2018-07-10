import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { BusyService } from '../../../shared/services/busy.service';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from '../../../shared/pipes/dataflow-duration.pipe';
import { TasksService } from '../../tasks.service';
import { TASK_SCHEDULES } from '../../../tests/mocks/mock-data';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { TaskStatusComponent } from '../../components/task-status/task-status.component';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { AuthService } from '../../../auth/auth.service';
import { MockModalService } from '../../../tests/mocks/modal';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MockToolsService } from '../../../tests/mocks/mock-tools';
import { ToolsService } from '../../components/flo/tools.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { TaskDefinitionScheduleComponent } from './task-definition-schedules.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { MasterCheckboxComponent } from '../../../shared/components/master-checkbox.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TaskSchedulesDestroyComponent } from '../../task-schedules-destroy/task-schedules-destroy.component';

/**
 * Test {@link TaskDefinitionScheduleComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionScheduleComponent', () => {
  let component: TaskDefinitionScheduleComponent;
  let fixture: ComponentFixture<TaskDefinitionScheduleComponent>;
  let activeRoute: MockActivatedRoute;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const modalService = new MockModalService();
  const busyService = new BusyService();
  const toolsService = new MockToolsService();
  const commonTestParams = { id: 'foo' };
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskDefinitionScheduleComponent,
        DataflowDateTimePipe,
        DataflowDurationPipe,
        AppTypeComponent,
        TaskStatusComponent,
        StreamDslComponent,
        PagerComponent,
        LoaderComponent,
        SortComponent,
        MasterCheckboxComponent
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
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
        { provide: ToolsService, useValue: toolsService },
        { provide: BusyService, useValue: busyService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskSchedules = TASK_SCHEDULES;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionScheduleComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  it('should populate task schedules', () => {
    tasksService.taskSchedules = TASK_SCHEDULES;
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=taskSchedulesTable] tr:first-child td'));
    expect(des.length).toBe(4);
    expect(des[1].nativeElement.textContent).toContain('foo1');
  });

  describe('no schedule', () => {

    beforeEach(() => {
      tasksService.taskSchedules = {
        _embedded: {
          taskScheduleResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      const message = fixture.debugElement.query(By.css('#empty')).nativeElement;
      expect(message).toBeTruthy();
    });
    /*
        it('should not display the search', () => {
          const search = fixture.debugElement.query(By.css('#filters'));
          expect(search).toBeNull();
        });
    */
    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskSchedulesTable'));
      expect(table).toBeNull();
    });

  });

  describe('At least 2 schedules', () => {

    beforeEach(() => {

      tasksService.taskSchedules = {
        _embedded: {
          taskScheduleResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              name: `foo${i}`,
              taskName: `foo`,
              status: 'complete',
              date: '2017-08-11T06:15:50.064Z',
              cronExpression: ''
            };
          })
        },
        page: {
          size: 100000,
          totalElements: 20,
          totalPages: 1
        }
      };

      fixture.detectChanges();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskSchedulesTable')).nativeElement;
      expect(table).toBeTruthy();
    });

  });

  describe('Schedule action', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskSchedules = TASK_SCHEDULES;
      fixture.detectChanges();
    });

    it('should delete a schedule', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr'))[0];
      const spy = spyOn(component, 'destroySchedules');
      line.query(By.css('.actions button[name=schedule-destroy0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail schedule', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="schedule-details0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/schedules/foo1']);
    });

    it('should navigate to the detail schedule (link)', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('a.link-schedule')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/schedules/foo1']);
    });

  });

  describe('Grouped applications action', () => {

    beforeEach(() => {
      tasksService.taskSchedules = TASK_SCHEDULES;
      fixture.detectChanges();
    });

    it('should show the grouped action if at least one schedule is selected', () => {
      fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      expect(component.countSelected()).toBe(2);
      expect(fixture.debugElement.queryAll(By.css('#dropdown-actions'))).toBeTruthy();
    });

    it('should call the destroy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      tick();
      fixture.debugElement.query(By.css('#destroy-schedules')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(TaskSchedulesDestroyComponent, { class: 'modal-lg' });
    }));

  });

});
