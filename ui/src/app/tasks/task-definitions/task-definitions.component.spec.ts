import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { KeyValuePipe } from '../../shared/pipes/key-value-filter.pipe';
import { TASK_DEFINITIONS, TASK_EXECUTIONS, TASK_SCHEDULES } from '../../tests/mocks/mock-data';
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
import { MockModalService } from '../../tests/mocks/modal';
import { TaskDefinitionsComponent } from './task-definitions.component';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TaskStatusComponent } from '../components/task-status/task-status.component';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TasksHeaderComponent } from '../components/tasks-header/tasks-header.component';
import { MockGroupRouteService } from '../../tests/mocks/group-route';
import { GroupRouteService } from '../../shared/services/group-route.service';

/**
 * Test {@link TaskDefinitionsComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionsComponent', () => {
  let component: TaskDefinitionsComponent;
  let fixture: ComponentFixture<TaskDefinitionsComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const modalService = new MockModalService();
  const busyService = new BusyService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const groupRouteService = new MockGroupRouteService();

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        KeyValuePipe,
        RolesDirective,
        TaskDefinitionsComponent,
        TaskDefinitionsDestroyComponent,
        TriStateButtonComponent,
        TriStateCheckboxComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        PagerComponent,
        TruncatePipe,
        TaskStatusComponent,
        TasksTabulationComponent,
        TasksHeaderComponent
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
        { provide: BsModalService, useValue: modalService },
        { provide: GroupRouteService, useValue: groupRouteService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDefinitionsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should populate task definitions', () => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    fixture.detectChanges();
    const des: DebugElement[] = fixture.debugElement.queryAll(By.css('table[id=taskDefinitionsTable] tr:first-child td'));
    expect(des.length).toBe(5);
    expect(des[1].nativeElement.textContent).toContain('foo');
    expect(des[2].nativeElement.textContent).toContain('bar');
    expect(des[3].nativeElement.textContent).toContain('UNKNOWN');
  });

  describe('no task', () => {

    beforeEach(() => {
      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: []
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

    it('should not display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters'));
      expect(search).toBeNull();
    });

    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskDefinitionsTable'));
      expect(table).toBeNull();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('One page', () => {

    beforeEach(() => {
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskDefinitionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('At least 2 pages', () => {

    beforeEach(() => {

      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: Array.from({ length: 20 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'foo && bar ',
              status: 'unknown',
              composed: true
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

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#taskDefinitionsTable')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      expect(pagination).toBeTruthy();
    });

    it('should display a message if no result after run a search', () => {
      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#no-result')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should clear the search', () => {
      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#no-result .btn')).nativeElement;

      button.click();
      fixture.detectChanges();
      expect(button).toBeTruthy();
      expect(component.form.q).toBe('');
    });

    it('should apply a search', () => {
      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: Array.from({ length: 12 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'foo && bar ',
              status: 'unknown',
              composed: true
            };
          })
        },
        page: {
          size: 20,
          totalElements: 12,
          totalPages: 1
        }
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#taskDefinitionsTable')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should apply a sort on name and dsl', () => {
      const sortName: HTMLElement = fixture.debugElement.query(By.css('#sort-name a')).nativeElement;
      const sortDsl: HTMLElement = fixture.debugElement.query(By.css('#sort-dsl a')).nativeElement;
      [
        { click: sortName, nameDesc: true, sort: 'DEFINITION_NAME', order: 'DESC' },
        { click: sortDsl, dslAsc: true, sort: 'DEFINITION', order: 'ASC' },
        { click: sortDsl, dslDesc: true, sort: 'DEFINITION', order: 'DESC' },
        { click: sortName, nameAsc: true, sort: 'DEFINITION_NAME', order: 'ASC' },
        { click: sortDsl, dslAsc: true, sort: 'DEFINITION', order: 'ASC' }
      ].forEach((test) => {
        test.click.click();
        fixture.detectChanges();
        if (test['nameDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeNull();
        }
        if (test['nameAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeNull();
        }
        if (test['dslDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .desc'))).toBeNull();
        }
        if (test['dslAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-dsl .ico .asc'))).toBeNull();
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

  describe('Task action', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      fixture.detectChanges();
    });

    it('should delete a task', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      const spy = spyOn(component, 'destroy');
      line.query(By.css('.actions button[name=task-destroy0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail task', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="task-details0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/definitions/foo']);
    });

    it('Should navigate to the launch page.', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="task-launch0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['tasks/definitions/launch/foo']);
    });

  });

  describe('Task Schedule enable', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      tasksService.taskSchedules = TASK_SCHEDULES;
      aboutService.dataflowVersionInfo.featureInfo.schedulerEnabled = true;
      fixture.detectChanges();
    });

    it('should navigate to the schedule creation page', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      const spy = spyOn(component, 'schedule');
      line.query(By.css('.actions button[name=task-schedule0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should delete all the schedules related to a task', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      const spy = spyOn(component, 'destroySchedules');
      line.query(By.css('.actions button[name=task-schedule-destroy0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the schedules creation page (multiple schedules)', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      tick();
      fixture.detectChanges();
      const spy = spyOn((<any>component).router, 'navigate');
      fixture.debugElement.query(By.css('#schedule-tasks')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(['tasks/schedules/create/' + groupRouteService.last.key]);
    }));

  });

  describe('Task Schedule disabled', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      aboutService.dataflowVersionInfo.featureInfo.schedulerEnabled = false;
      fixture.detectChanges();
    });

    /*
    TODO: fix it
    it('should not display the inline action for schedule/delete schedules', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      expect(line.query(By.css('.actions button[name=task-schedule0]'))).toBeNull();
      expect(line.query(By.css('.actions button[name=task-schedule-destroy0]'))).toBeNull();
      expect(line.query(By.css('.actions button[name=task-details0]'))).toBeTruthy();
    });
    */

    it('should not show the grouped action Schedule task(s)', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();
      expect(component.countSelected()).toBe(2);
      expect(fixture.debugElement.query(By.css('#schedule-tasks'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#destroy-tasks'))).toBeTruthy();
    }));

  });


  describe('Grouped applications action', () => {

    beforeEach(() => {
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      tasksService.taskSchedules = TASK_SCHEDULES;
      fixture.detectChanges();
    });

    it('should show the grouped action if at least one task is selected', () => {
      fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      expect(component.countSelected()).toBe(2);
      expect(fixture.debugElement.query(By.css('#dropdown-actions'))).toBeTruthy();
    });

    it('should call the destroy modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#destroy-tasks')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(TaskDefinitionsDestroyComponent, { class: 'modal-lg' });
    }));

  });

});
