import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';
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
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
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
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../../shared/components/list/list.component';
import { TaskSchedule } from '../../model/task-schedule';
import { TippyDirective } from '../../../shared/directives/tippy.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        AppTypeComponent,
        TaskStatusComponent,
        StreamDslComponent,
        PagerComponent,
        LoaderComponent,
        SortComponent,
        MasterCheckboxComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        TippyDirective
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BrowserAnimationsModule,
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
        { provide: ToolsService, useValue: toolsService },
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
          scheduleInfoResourceList: []
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
          scheduleInfoResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              scheduleName: `foo${i}`,
              taskDefinitionName: `foo`,
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
      const spy = spyOn(component, 'destroySchedules');
      component.applyAction('destroy', TaskSchedule.fromJSON(tasksService.taskSchedules._embedded.scheduleInfoResourceList[0]));
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail schedule', () => {
      const navigate = spyOn((<any>component).router, 'navigate');
      component.applyAction('details', TaskSchedule.fromJSON(tasksService.taskSchedules._embedded.scheduleInfoResourceList[0]));
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
    });

    /*
    it('should call the destroy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      const mockBsModalRef = new BsModalRef();
      mockBsModalRef.content = {
        open: () => of('testing')
      };
      const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);
      component.destroySelectedSchedules();

      expect(spy).toHaveBeenCalledWith(TaskSchedulesDestroyComponent, { class: 'modal-lg' });
    }));
    */

  });

});
