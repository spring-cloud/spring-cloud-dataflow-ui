import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, BsModalRef, TooltipModule } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { TASK_DEFINITIONS, TASK_SCHEDULES } from '../../tests/mocks/mock-data';
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
import { TaskDefinitionsComponent } from './task-definitions.component';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TaskStatusComponent } from '../components/task-status/task-status.component';
import { TaskDefinitionsDestroyComponent } from '../task-definitions-destroy/task-definitions-destroy.component';
import { TasksTabulationComponent } from '../components/tasks-tabulation/tasks-tabulation.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { MockGroupRouteService } from '../../tests/mocks/group-route';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { Observable, of } from 'rxjs';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { MockAppsService } from '../../tests/mocks/apps';
import { AppsService } from '../../apps/apps.service';
import { GrafanaModule } from '../../shared/grafana/grafana.module';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { TippyDirective } from '../../shared/directives/tippy.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Test {@link TaskDefinitionsComponent}.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
describe('TaskDefinitionsComponent', () => {
  let component: TaskDefinitionsComponent;
  let fixture: ComponentFixture<TaskDefinitionsComponent>;
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  let modalService;
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const groupRouteService = new MockGroupRouteService();

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TaskDefinitionsComponent,
        TaskDefinitionsDestroyComponent,
        SortComponent,
        StreamDslComponent,
        MasterCheckboxComponent,
        PagerComponent,
        TruncatePipe,
        TaskStatusComponent,
        TasksTabulationComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        LoaderComponent,
        TippyDirective
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        BrowserAnimationsModule,
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        GrafanaModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        BsModalService,
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AppsService, useValue: appsService },
        { provide: AuthService, useValue: authService },
        { provide: TasksService, useValue: tasksService },
        { provide: GroupRouteService, useValue: groupRouteService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        GrafanaService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    modalService = TestBed.inject(BsModalService);
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
    expect(des.length).toBe(6);
    expect(des[1].nativeElement.textContent).toContain('foo');
    expect(des[2].nativeElement.textContent).toContain('demo');
    expect(des[3].nativeElement.textContent).toContain('bar');
    expect(des[4].nativeElement.textContent).toContain('UNKNOWN');
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
              description: 'demo-description',
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

    /*
    TODO: fix it
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
      component.listBar.form.q = 'foo';
      fixture.detectChanges();
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
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
      component.listBar.form.q = 'foo';
      fixture.detectChanges();
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
      fixture.detectChanges();
      console.log(fixture.debugElement.query(By.css('#no-result')).nativeElement);
      const button = fixture.debugElement.query(By.css('#no-result a')).nativeElement;
      button.click();
      fixture.detectChanges();
      expect(component.listBar.form.q).toBe('');
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
      component.listBar.form.q = 'foo';
      fixture.debugElement.query(By.css('#search-submit')).nativeElement.click();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#taskDefinitionsTable')).nativeElement;
      expect(noResult).toBeTruthy();
    });

     */

    it('should apply a sort on name and dsl', () => {
      const sortName: HTMLElement = fixture.debugElement.query(By.css('#sort-name a')).nativeElement;
      const sortDsl: HTMLElement = fixture.debugElement.query(By.css('#sort-dsl a')).nativeElement;
      [
        { click: sortName, nameDesc: true, sort: 'taskName', order: 'DESC' },
        { click: sortDsl, dslAsc: true, sort: 'dslText', order: 'ASC' },
        { click: sortDsl, dslDesc: true, sort: 'dslText', order: 'DESC' },
        { click: sortName, nameAsc: true, sort: 'taskName', order: 'ASC' },
        { click: sortDsl, dslAsc: true, sort: 'dslText', order: 'ASC' }
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
      const spy = spyOn(component, 'destroy');
      component.applyAction('destroy', tasksService.taskDefinitions._embedded.taskDefinitionResourceList[0]);
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail task', () => {
      const navigate = spyOn((<any>component).router, 'navigate');
      component.applyAction('details', tasksService.taskDefinitions._embedded.taskDefinitionResourceList[0]);
      expect(navigate).toHaveBeenCalledWith(['tasks/definitions/foo']);
    });

    it('Should navigate to the launch page.', () => {
      const navigate = spyOn((<any>component).router, 'navigate');
      component.applyAction('launch', tasksService.taskDefinitions._embedded.taskDefinitionResourceList[0]);
      expect(navigate).toHaveBeenCalledWith(['tasks/definitions/launch/foo']);
    });

  });

  describe('Task Schedule enable', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      tasksService.taskSchedules = TASK_SCHEDULES;
      aboutService.dataflowVersionInfo.featureInfo.schedulesEnabled = true;
      fixture.detectChanges();
    });

    it('should navigate to the schedule creation page', () => {
      const spy = spyOn(component, 'schedule');
      component.applyAction('schedule', tasksService.taskDefinitions._embedded.taskDefinitionResourceList[0]);
      expect(spy).toHaveBeenCalled();
    });

    it('should delete all the schedules related to a task', () => {
      const spy = spyOn(component, 'destroySchedules');
      component.applyAction('delete-schedules', tasksService.taskDefinitions._embedded.taskDefinitionResourceList[0]);
      expect(spy).toHaveBeenCalled();
    });

    it('should call the schedules creation page (multiple schedules)', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      const spy = spyOn((<any>component).router, 'navigate');
      component.scheduleSelectedTasks();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(['tasks/schedules/create/' + groupRouteService.last.key]);
    }));

  });

  /*
  TODO: fix it
  describe('Task Schedule disabled', () => {

    beforeEach(() => {
      tasksService.tasksContext.page = 0;
      tasksService.taskDefinitions = TASK_DEFINITIONS;
      aboutService.dataflowVersionInfo.featureInfo.schedulesEnabled = false;
      fixture.detectChanges();
    });

    it('should not display the inline action for schedule/delete schedules', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#taskDefinitionsTable tbody tr'))[0];
      expect(line.query(By.css('.actions button[name=task-schedule0]'))).toBeNull();
      expect(line.query(By.css('.actions button[name=task-schedule-destroy0]'))).toBeNull();
      expect(line.query(By.css('.actions button[name=task-details0]'))).toBeTruthy();
    });

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
  */


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
    });

    it('should call the destroy modal', () => {
      const mockBsModalRef = new BsModalRef();
      mockBsModalRef.content = {
        open: () => of('testing')
      };
      const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);
      component.itemsSelected = ['foo', 'bar2'];
      component.destroySelectedTasks();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(TaskDefinitionsDestroyComponent, { class: 'modal-lg' });
    });

  });

});
