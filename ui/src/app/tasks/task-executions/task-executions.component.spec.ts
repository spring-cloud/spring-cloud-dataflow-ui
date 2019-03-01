import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { TASK_EXECUTIONS } from '../../tests/mocks/mock-data';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { FloModule } from 'spring-flo';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { MasterCheckboxComponent } from '../../shared/components/master-checkbox.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { MockModalService } from '../../tests/mocks/modal';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TaskStatusComponent } from '../components/task-status/task-status.component';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { TaskExecutionsComponent } from './task-executions.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { AppsService } from '../../apps/apps.service';
import { MockAppsService } from '../../tests/mocks/apps';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';

/**
 * Test {@link TaskExecutionsComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskExecutionsComponent', () => {
  let component: TaskExecutionsComponent;
  let fixture: ComponentFixture<TaskExecutionsComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const modalService = new MockModalService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskExecutionsComponent,
        TaskDefinitionsDestroyComponent,
        PagerComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        TruncatePipe,
        TaskStatusComponent,
        TasksTabulationComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        DataflowDateTimePipe,
        LoaderComponent
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: TasksService, useValue: tasksService },
        { provide: BsModalService, useValue: modalService },
        { provide: AppsService, useValue: appsService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExecutionsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate task executions', () => {
    tasksService.taskExecutions = TASK_EXECUTIONS;
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=taskExecutionsTable] tr:first-child td'));
    expect(des.length).toBe(6);
    expect(des[0].nativeElement.textContent).toContain('#2');
    expect(des[1].nativeElement.textContent).toContain('foo1');
  });

  describe('no execution', () => {

    beforeEach(() => {
      tasksService.taskExecutions = {
        _embedded: {
          taskExecutionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 1
        }
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      const message = fixture.debugElement.query(By.css('#empty')).nativeElement;
      fixture.detectChanges();
      expect(message).toBeTruthy();
    });

    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskExecutionsTable'));
      expect(table).toBeNull();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('One page', () => {

    beforeEach(() => {
      tasksService.taskExecutions = TASK_EXECUTIONS;
      fixture.detectChanges();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskExecutionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('At least 2 pages', () => {

    beforeEach(() => {

      tasksService.taskExecutions = {
        _embedded: {
          taskExecutionResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              executionId: (i + 1),
              exitCode: 0,
              taskName: 'foo1',
              startTime: null,
              endTime: null,
              exitMessage: null,
              arguments: [],
              jobExecutionIds: [],
              errorMessage: null,
              externalExecutionId: null
            };
          })
        },
        page: {
          size: 20,
          totalElements: 30,
          totalPages: 2
        }
      };

      fixture.detectChanges();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskExecutionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      expect(pagination).toBeTruthy();
    });

    it('should apply a sort on ID, Task Name, Date Start, Date End, Exit code', () => {
      const sortId: HTMLElement = fixture.debugElement.query(By.css('#sort-id a')).nativeElement;
      const sortTask: HTMLElement = fixture.debugElement.query(By.css('#sort-task a')).nativeElement;
      const sotDateStart: HTMLElement = fixture.debugElement.query(By.css('#sort-startdate a')).nativeElement;
      const sortEndDate: HTMLElement = fixture.debugElement.query(By.css('#sort-enddate a')).nativeElement;
      const sortExitCode: HTMLElement = fixture.debugElement.query(By.css('#sort-exitcode a')).nativeElement;
      [
        { click: sortId, idAsc: true, sort: 'TASK_EXECUTION_ID', order: 'ASC' },
        { click: sortId, idDesc: true, sort: 'TASK_EXECUTION_ID', order: 'DESC' },
        { click: sortTask, taskAsc: true, sort: 'TASK_NAME', order: 'ASC' },
        { click: sortTask, taskDesc: true, sort: 'TASK_NAME', order: 'DESC' },
        { click: sotDateStart, dateStartAsc: true, sort: 'START_TIME', order: 'ASC' },
        { click: sotDateStart, dateStartDesc: true, sort: 'START_TIME', order: 'DESC' },
        { click: sortEndDate, dateEndAsc: true, sort: 'END_TIME', order: 'ASC' },
        { click: sortEndDate, dateEndDesc: true, sort: 'END_TIME', order: 'DESC' },
        { click: sortExitCode, exitCodeAsc: true, sort: 'EXIT_CODE', order: 'ASC' },
        { click: sortExitCode, exitCodeDesc: true, sort: 'EXIT_CODE', order: 'DESC' },
      ].forEach((test) => {
        test.click.click();
        fixture.detectChanges();
        if (test['idDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-id .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-id .ico .desc'))).toBeNull();
        }
        if (test['idAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-id .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-id .ico .asc'))).toBeNull();
        }
        if (test['taskDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-task .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-task .ico .desc'))).toBeNull();
        }
        if (test['taskAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-task .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-task .ico .asc'))).toBeNull();
        }
        if (test['dateStartDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-startdate .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-startdate .ico .desc'))).toBeNull();
        }
        if (test['dateStartAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-startdate .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-startdate .ico .asc'))).toBeNull();
        }
        if (test['dateEndDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-enddate .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-enddate .ico .desc'))).toBeNull();
        }
        if (test['dateEndAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-enddate .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-enddate .ico .asc'))).toBeNull();
        }
        if (test['exitCodeDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-exitcode .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-exitcode .ico .desc'))).toBeNull();
        }
        if (test['exitCodeAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-exitcode .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-exitcode .ico .asc'))).toBeNull();
        }
        expect(component.params.sort).toBe(test.sort);
        expect(component.params.order).toBe(test.order);
      });
    });

    it('should change the page', () => {
      fixture.detectChanges();
      const buttonPage2 = fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement;
      buttonPage2.click();
      fixture.detectChanges();
      expect(component.params.page).toBe(1);
    });

  });

  describe('Execution action', () => {

    beforeEach(() => {
      tasksService.executionsContext.page = 0;
      tasksService.taskExecutions = TASK_EXECUTIONS;
      fixture.detectChanges();
    });

    it('should navigate to the detail task', () => {
      const navigate = spyOn((<any>component).router, 'navigate');
      component.applyAction('details', tasksService.taskExecutions._embedded.taskExecutionResourceList[0]);
      expect(navigate).toHaveBeenCalledWith(['tasks/executions/2']);
    });


  });

});
