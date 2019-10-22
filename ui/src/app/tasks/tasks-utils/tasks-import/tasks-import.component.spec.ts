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
import { TasksImportComponent } from './tasks-import.component';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { TasksService } from '../../tasks.service';

describe('TasksImportComponent', () => {

  let component: TasksImportComponent;
  let fixture: ComponentFixture<TasksImportComponent>;
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
        TasksImportComponent,
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
        BlockerService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksImportComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Invalid file', () => {

    it('should display an error', () => {
      fixture.detectChanges();
      const spy = spyOn(notificationService, 'error');
      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Please, select a file.');
    });


  });

  describe('Valid file', () => {

    it('should call the right service', () => {
      component.file = {
        name: 'sample',
      };
      fixture.detectChanges();
      const spy = spyOn(tasksUtilsService, 'importTasks');
      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should display the result', () => {
      component.file = {
        name: 'sample',
      };
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#import-file'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#import-result'))).toBeFalsy();

      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#import-file'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('#import-result'))).toBeTruthy();
    });

  });


});
