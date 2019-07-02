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
import { TaskExecution } from '../model/task-execution';
import { TaskExecutionsDestroyComponent } from './task-executions-destroy.component';

/**
 * Test {@link TaskExecutionsDestroyComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskExecutionsDestroyComponent', () => {

  let component: TaskExecutionsDestroyComponent;
  let fixture: ComponentFixture<TaskExecutionsDestroyComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const tasksService = new MockTasksService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskExecutionsDestroyComponent,
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
    fixture = TestBed.createComponent(TaskExecutionsDestroyComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('1 task execution destroy', () => {
    const mock = [
      TaskExecution.fromJSON({
        executionId: '1',
        exitCode: 0,
        taskName: 'foo1',
        startTime: null,
        endTime: null,
        exitMessage: null,
        arguments: [],
        jobExecutionIds: [],
        errorMessage: null,
        externalExecutionId: null
      })
    ];

    beforeEach(() => {
      component.open({ taskExecutions: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicated message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will remove the data of the task execution with the id 1`);
      expect(message.textContent).toContain(`1`);
    });

    it('Should call the service after validating the button click to destroy the task execution', () => {
      const spy = spyOn(tasksService, 'destroyExecutions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroying one task', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('1 task execution(s) cleaned up.');
    }));

    it('Should close the modal dialog after a successful destruction', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Destruction of multiple task executions', () => {

    const mock = [
      TaskExecution.fromJSON({
        executionId: '1',
        exitCode: 0,
        taskName: 'foo1',
        startTime: null,
        endTime: null,
        exitMessage: null,
        arguments: [],
        jobExecutionIds: [],
        errorMessage: null,
        externalExecutionId: null
      }),
      TaskExecution.fromJSON({
        executionId: '2',
        exitCode: 0,
        taskName: 'foo2',
        startTime: null,
        endTime: null,
        exitMessage: null,
        arguments: [],
        jobExecutionIds: [],
        errorMessage: null,
        externalExecutionId: null
      })
    ];

    beforeEach(() => {
      component.open({ taskExecutions: mock });
      fixture.detectChanges();
    });

    it('Should display 2 task executions', () => {
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-tasks tbody tr'));
      const tr1: HTMLElement = tr[0].nativeElement;
      const tr2: HTMLElement = tr[1].nativeElement;
      expect(tr.length).toBe(2);
      expect(tr1.textContent).toContain(mock[0].executionId.toString());
      expect(tr1.textContent).toContain(mock[0].taskName);
      expect(tr2.textContent).toContain(mock[1].executionId.toString());
      expect(tr2.textContent).toContain(mock[1].taskName);
    });

    it('Should call the service upon validating the destruction of task executions', () => {
      const spy = spyOn(tasksService, 'destroyExecutions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroying 2 tasks', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('2 task execution(s) cleaned up.');
    }));

    it('Should close the modal after a successful destruction', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
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
            executionId: '1',
            exitCode: 0,
            taskName: 'foo1',
            startTime: null,
            endTime: null,
            exitMessage: null,
            arguments: [],
            jobExecutionIds: [],
            errorMessage: null,
            externalExecutionId: null
          }),
          TaskExecution.fromJSON({
            executionId: '2',
            exitCode: 0,
            taskName: 'foo2',
            startTime: null,
            endTime: null,
            exitMessage: null,
            arguments: [],
            jobExecutionIds: [],
            errorMessage: null,
            externalExecutionId: null
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
