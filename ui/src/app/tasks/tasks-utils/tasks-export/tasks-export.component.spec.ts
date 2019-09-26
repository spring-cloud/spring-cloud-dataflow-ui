import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAuthService } from '../../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { LoggerService } from '../../../shared/services/logger.service';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MasterCheckboxComponent } from '../../../shared/components/master-checkbox.component';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { MockRoutingStateService } from '../../../tests/mocks/routing-state';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { By } from '@angular/platform-browser';
import { MockTasksUtilsService } from '../../../tests/mocks/tasks-utils';
import { TasksUtilsService } from '../tasks-utils.service';
import { TasksExportComponent } from './tasks-export.component';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { TasksService } from '../../tasks.service';

describe('TasksExportComponent', () => {

  let component: TasksExportComponent;
  let fixture: ComponentFixture<TasksExportComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const tasksService = new MockTasksService();
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();
  const tasksUtilsService = new MockTasksUtilsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TasksExportComponent,
        StreamDslComponent,
        LoaderComponent,
        TruncatePipe,
        MasterCheckboxComponent,
        DATAFLOW_PAGE,
        RolesDirective
      ],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: TasksService, useValue: tasksService },
        { provide: LoggerService, useValue: loggerService },
        { provide: TasksUtilsService, useValue: tasksUtilsService },
        BlockerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksExportComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
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
          totalPages: 0
        }
      };
      fixture.detectChanges();
    });

    it('should display a specific message', () => {
      const message = fixture.debugElement.query(By.css('#empty'));
      const tasksExport = fixture.debugElement.query(By.css('#tasks-export'));
      fixture.detectChanges();
      expect(message).toBeTruthy();
      expect(tasksExport).toBeFalsy();
    });

  });

  describe('with tasks', () => {

    beforeEach(() => {
      tasksService.taskDefinitions = {
        _embedded: {
          taskDefinitionResourceList: Array.from({ length: 10 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'timestamp ',
              description: 'demo-task',
              status: 'unknown',
              composed: true
            };
          })
        },
        page: {
          size: 20,
          totalElements: 10,
          totalPages: 1
        }
      };
      fixture.detectChanges();
    });

    it('should display the export box, 10 tasks', () => {
      const message = fixture.debugElement.query(By.css('#empty'));
      const tasksExport = fixture.debugElement.query(By.css('#tasks-export'));
      const lines = fixture.debugElement.queryAll(By.css('#tasks-export table tbody tr'));
      fixture.detectChanges();
      expect(tasksExport).toBeTruthy();
      expect(lines.length).toBe(10);
      expect(message).toBeFalsy();
    });

    it('should call the right service', () => {
      const spy = spyOn(tasksUtilsService, 'createFile').and.callThrough();
      fixture.debugElement.query(By.css('#btn-export')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

  });

});
