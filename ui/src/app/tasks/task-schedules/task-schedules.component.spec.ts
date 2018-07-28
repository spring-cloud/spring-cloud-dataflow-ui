import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, BsModalRef } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { KeyValuePipe } from '../../shared/pipes/key-value-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { FloModule } from 'spring-flo';
import { TriStateButtonComponent } from '../../shared/components/tri-state-button.component';
import { TriStateCheckboxComponent } from '../../shared/components/tri-state-checkbox.component';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { MasterCheckboxComponent } from '../../shared/components/master-checkbox.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { BusyService } from '../../shared/services/busy.service';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskSchedulesComponent } from './task-schedules.component';
import { TasksHeaderComponent } from '../components/tasks-header/tasks-header.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TruncatorComponent } from '../../shared/components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from '../../shared/components/truncator/truncator-width-provider.directive';
import { TASK_SCHEDULES } from '../../tests/mocks/mock-data';
import { TaskSchedulesDestroyComponent } from '../task-schedules-destroy/task-schedules-destroy.component';
import { TaskSchedulesFilterPipe } from './task-schedules.filter';
import { Observable } from 'rxjs';

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
  let modalService;
  const busyService = new BusyService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        KeyValuePipe,
        RolesDirective,
        TaskSchedulesComponent,
        TaskDefinitionsDestroyComponent,
        TriStateButtonComponent,
        TriStateCheckboxComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        PagerComponent,
        TruncatePipe,
        TasksHeaderComponent,
        TruncatorComponent,
        TruncatorWidthProviderDirective,
        TasksTabulationComponent,
        LoaderComponent,
        TaskSchedulesFilterPipe
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: BusyService, useValue: busyService },
        { provide: TasksService, useValue: tasksService },
        BsModalService,
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
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
          taskScheduleResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              name: `foo${i}`,
              taskName: `bar${i}`,
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

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskSchedulesTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display a message if no result after run a search', () => {
      component.form.q = 'inputinvalid';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#no-result')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should clear the search', () => {
      component.form.q = 'invalidinput';
      component.search();
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
          taskScheduleResourceList: Array.from({ length: 12 }).map((a, i) => {
            return {
              name: `foo${i}`,
              taskName: `bar${i}`,
              status: 'complete',
              date: '2017-08-11T06:15:50.064Z',
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
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#taskSchedulesTable')).nativeElement;
      expect(noResult).toBeTruthy();
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
      expect(fixture.debugElement.queryAll(By.css('#dropdown-actions'))).toBeTruthy();
    });

    it('should call the destroy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskSchedulesTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const mockBsModalRef =  new BsModalRef();
      mockBsModalRef.content = {
        open: () => Observable.of('testing')
      };

      const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);
      fixture.debugElement.query(By.css('#destroy-schedules')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(TaskSchedulesDestroyComponent, { class: 'modal-lg' });
    }));

  });

});
