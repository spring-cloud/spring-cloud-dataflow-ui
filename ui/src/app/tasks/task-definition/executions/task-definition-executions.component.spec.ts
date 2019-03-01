import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { DataflowDateTimePipe } from '../../../shared/pipes/dataflow-date-time.pipe';
import { TasksService } from '../../tasks.service';
import { TASK_EXECUTIONS } from '../../../tests/mocks/mock-data';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { TaskStatusComponent } from '../../components/task-status/task-status.component';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { AuthService } from '../../../auth/auth.service';
import { MockModalService } from '../../../tests/mocks/modal';
import { BsDropdownModule, BsModalService, TooltipModule } from 'ngx-bootstrap';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MockToolsService } from '../../../tests/mocks/mock-tools';
import { ToolsService } from '../../components/flo/tools.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SortComponent } from '../../../shared/components/sort/sort.component';
import { TaskDefinitionExecutionsComponent } from './task-definition-executions.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DATAFLOW_LIST } from '../../../shared/components/list/list.component';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';

/**
 * Test {@link TaskDefinitionExecutionsComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionExecutionsComponent', () => {

  let component: TaskDefinitionExecutionsComponent;
  let fixture: ComponentFixture<TaskDefinitionExecutionsComponent>;
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
        TaskDefinitionExecutionsComponent,
        DataflowDateTimePipe,
        AppTypeComponent,
        TaskStatusComponent,
        StreamDslComponent,
        PagerComponent,
        LoaderComponent,
        SortComponent,
        DATAFLOW_LIST,
        DATAFLOW_PAGE
      ],
      imports: [
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
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
    tasksService.taskExecutions = TASK_EXECUTIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskDefinitionExecutionsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate task executions', () => {
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=taskExecutionsTable] tr:first-child td'));
    expect(des.length).toBe(5);
    expect(des[0].nativeElement.textContent).toContain('#2');
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
          taskExecutionResourceList: Array.from({ length: 30 }).map((a, i) => {
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
          size: 30,
          totalElements: 40,
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
      const sotDateStart: HTMLElement = fixture.debugElement.query(By.css('#sort-startdate a')).nativeElement;
      const sortEndDate: HTMLElement = fixture.debugElement.query(By.css('#sort-enddate a')).nativeElement;
      const sortExitCode: HTMLElement = fixture.debugElement.query(By.css('#sort-exitcode a')).nativeElement;
      [
        { click: sortId, idAsc: true, sort: 'TASK_EXECUTION_ID', order: 'ASC' },
        { click: sortId, idDesc: true, sort: 'TASK_EXECUTION_ID', order: 'DESC' },
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
      });
    });

  });

  describe('Execution action', () => {

    beforeEach(() => {
      tasksService.executionsContext.page = 0;
      tasksService.taskExecutions = TASK_EXECUTIONS;
      fixture.detectChanges();
    });

    it('should navigate to the detail page', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskExecutionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions-btn button[name="task-details0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/executions/2']);
    });

    it('should navigate to the detail page', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskExecutionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.queryAll(By.css('td a'))[0].nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/executions/2']);
    });

  });

});
