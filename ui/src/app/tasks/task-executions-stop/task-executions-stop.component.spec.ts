import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAuthService } from '../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { TaskExecutionsStopComponent } from './task-executions-stop.component';
import { TaskExecution } from '../model/task-execution';

/**
 * Test {@link TaskExecutionsStopComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskExecutionsStopComponent', () => {

  let component: TaskExecutionsStopComponent;
  let fixture: ComponentFixture<TaskExecutionsStopComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const tasksService = new MockTasksService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskExecutionsStopComponent,
        StreamDslComponent,
        TruncatePipe,
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
        { provide: TasksService, useValue: tasksService },
        { provide: LoggerService, useValue: loggerService },
        BlockerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExecutionsStopComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('Stop 1 task', () => {

    const mock = [
      TaskExecution.fromJSON({
        executionId: 1,
        exitCode: 1,
        taskName: 'foo1',
        exitMessage: '',
        arguments: '',
        taskExecutionStatus: 'COMPLETE'
      })
    ];

    beforeEach(() => {
      component.open({ taskExecutions: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicated message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will stop the task execution`);
      expect(message.textContent).toContain(`1`);
    });

    it('Should call the service on validate stop', () => {
      const spy = spyOn(tasksService, 'stopExecutions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after stop request submitted for one task', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('Request submitted to stop 1 task execution(s)');
    }));

    it('Should close the modal after a success stop', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Multiple tasks stop', () => {

    const mock = [
      TaskExecution.fromJSON({
        executionId: 1,
        exitCode: 1,
        taskName: 'foo1',
        exitMessage: '',
        arguments: '',
        taskExecutionStatus: 'COMPLETE'
      }),

      TaskExecution.fromJSON({
        executionId: 2,
        exitCode: 1,
        taskName: 'foo1',
        exitMessage: '',
        arguments: '',
        taskExecutionStatus: 'COMPLETE'
      }),
    ];

    beforeEach(() => {
      component.open({ taskExecutions: mock });
      fixture.detectChanges();
    });

    it('Should display 2 tasks', () => {
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-tasks tbody tr'));
      const tr1: HTMLElement = tr[0].nativeElement;
      const tr2: HTMLElement = tr[1].nativeElement;
      expect(tr.length).toBe(2);
      expect(tr1.textContent).toContain(mock[0].executionId.toString());
      expect(tr1.textContent).toContain(mock[0].taskName);
      expect(tr2.textContent).toContain(mock[1].executionId.toString());
      expect(tr2.textContent).toContain(mock[1].taskName);
    });

    it('Should call the service on validate stop', () => {
      const spy = spyOn(tasksService, 'stopExecutions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after stop 2 tasks', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('Request submitted to stop 2 task execution(s).');
    }));

    it('Should close the modal after a success destroy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-stop')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Modal', () => {

    beforeEach(() => {
      component.open({
        taskExecutions: [
          TaskExecution.fromJSON({
            executionId: 1,
            exitCode: 1,
            taskName: 'foo1',
            exitMessage: '',
            arguments: '',
            taskExecutionStatus: 'COMPLETE'
          }),

          TaskExecution.fromJSON({
            executionId: 2,
            exitCode: 1,
            taskName: 'foo1',
            exitMessage: '',
            arguments: '',
            taskExecutionStatus: 'COMPLETE'
          })
        ]
      });
      fixture.detectChanges();
    });

    it('Should call the close action (header close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('Should call the close action (footer close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-cancel')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
