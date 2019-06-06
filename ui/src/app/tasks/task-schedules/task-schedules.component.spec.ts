import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule, BsModalRef, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
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
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskSchedulesComponent } from './task-schedules.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TruncatorComponent } from '../../shared/components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from '../../shared/components/truncator/truncator-width-provider.directive';
import { TASK_SCHEDULES } from '../../tests/mocks/mock-data';
import { TaskSchedulesDestroyComponent } from '../task-schedules-destroy/task-schedules-destroy.component';
import { TaskSchedulesFilterPipe } from './task-schedules.filter';
import { Observable, of } from 'rxjs';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { MockAppsService } from '../../tests/mocks/apps';
import { AppsService } from '../../apps/apps.service';
import { TaskSchedule } from '../model/task-schedule';

/**
 * Test {@link TaskSchedulesComponent}.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
describe('TaskSchedulesComponent', () => {
  let component: TaskSchedulesComponent;
  let fixture: ComponentFixture<TaskSchedulesComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const appsService = new MockAppsService();
  let modalService;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskSchedulesComponent,
        TaskDefinitionsDestroyComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        PagerComponent,
        TruncatePipe,
        TruncatorComponent,
        TruncatorWidthProviderDirective,
        TasksTabulationComponent,
        LoaderComponent,
        TaskSchedulesFilterPipe,
        DATAFLOW_PAGE,
        DATAFLOW_LIST
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
        BsModalService,
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: AppsService, useValue: appsService },
        { provide: TasksService, useValue: tasksService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    modalService = TestBed.get(BsModalService);
    fixture = TestBed.createComponent(TaskSchedulesComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
    modalService = TestBed.get(BsModalService);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate task schedules', () => {
    tasksService.taskSchedules = TASK_SCHEDULES;
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=taskSchedulesTable] tr:first-child td'));
    expect(des.length).toBe(5);
    expect(des[1].nativeElement.textContent).toContain('foo1');
    expect(des[2].nativeElement.textContent).toContain('bar1');
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
    TODO: fix it
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

  describe('At least 2 pages', () => {

    beforeEach(() => {

      tasksService.taskSchedules = {
        _embedded: {
          scheduleInfoResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              scheduleName: `foo${i}`,
              taskDefinitionName: `bar${i}`,
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

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskSchedulesTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    /*
    TODO: fix it
    it('should display a message if no result after run a search', () => {
      tasksService.taskSchedules = null;
      component.listBar.form.q = 'inputinvalid';
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#no-result')).nativeElement;
      expect(noResult).toBeTruthy();
    });
    it('should clear the search', () => {
      component.listBar.form.q = 'inputinvalid';
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#no-result .btn')).nativeElement;
      button.click();
      fixture.detectChanges();
      expect(button).toBeTruthy();
      expect(component.form.q).toBe('');
    });

    it('should apply a search', () => {
      tasksService.taskSchedules = {
        _embedded: {
          scheduleInfoResourceList: Array.from({ length: 12 }).map((a, i) => {
            return {
              scheduleName: `foo${i}`,
              taskDefinitionName: `bar${i}`,
              cronExpression: ''
            };
          })
        },
        page: {
          size: 100000,
          totalElements: 12,
          totalPages: 1
        }
      };
      component.listBar.form.q = 'foo';
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#taskSchedulesTable')).nativeElement;
      expect(noResult).toBeTruthy();
    });
    */

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

    it('should navigate to the task (link)', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('a.link-task')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/definitions/bar1']);
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

    it('should call the destroy modal', fakeAsync(() => {
      const mockBsModalRef = new BsModalRef();
      mockBsModalRef.content = {
        open: () => of('testing')
      };
      const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);
      component.destroySelectedSchedules();
      expect(spy).toHaveBeenCalledWith(TaskSchedulesDestroyComponent, { class: 'modal-lg' });
    }));

  });

});
