import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAuthService } from '../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { TaskSchedulesDestroyComponent } from './task-schedules-destroy.component';
import { TaskSchedule } from '../model/task-schedule';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';

/**
 * Test {@link TaskSchedulesDestroyComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskSchedulesDestroyComponent', () => {

  let component: TaskSchedulesDestroyComponent;
  let fixture: ComponentFixture<TaskSchedulesDestroyComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const tasksService = new MockTasksService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskSchedulesDestroyComponent,
        LoaderComponent,
        RolesDirective,
        DataflowDateTimePipe
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
    fixture = TestBed.createComponent(TaskSchedulesDestroyComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('1 task schedule delete', () => {

    const mock = [
      new TaskSchedule('schedule_1', 'task_1', '')
    ];

    beforeEach(() => {
      component.open({ taskSchedules: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicate message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will delete the task schedule`);
      expect(message.textContent).toContain(`schedule_1`);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(tasksService, 'destroySchedules').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after delete one task schedule', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('1 task schedule(s) deleted.');
    }));

    it('Should close the modal after a success destroy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Multiple task schedules delete', () => {

    const mock = [
      new TaskSchedule('schedule_1', 'task_1', ''),
      new TaskSchedule('schedule_2', 'task_1', '0 0 0 0 0 0 0 0')
    ];

    beforeEach(() => {
      component.open({ taskSchedules: mock });
      fixture.detectChanges();
    });

    it('Should display 2 tasks', () => {
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-tasks tbody tr'));
      const tr1: HTMLElement = tr[0].nativeElement;
      const tr2: HTMLElement = tr[1].nativeElement;
      expect(tr.length).toBe(2);
      expect(tr1.textContent).toContain(mock[0].name);
      expect(tr2.textContent).toContain(mock[1].name);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(tasksService, 'destroySchedules').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after delete 2 task schedules', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('2 task schedule(s) deleted.');
    }));

    it('Should close the modal after a success destroy', (() => {
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
        taskSchedules: [
          new TaskSchedule('schedule_1', 'task_1', ''),
          new TaskSchedule('schedule_2', 'task_1', '0 0 0 0 0 0 0 0')
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
