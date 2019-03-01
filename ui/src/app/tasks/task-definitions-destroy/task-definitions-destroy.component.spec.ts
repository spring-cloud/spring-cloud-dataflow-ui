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
import { TaskDefinitionsDestroyComponent } from './task-definitions-destroy.component';
import { TaskDefinition } from '../model/task-definition';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Test {@link TaskDefinitionsDestroyComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskDefinitionsDestroyComponent', () => {

  let component: TaskDefinitionsDestroyComponent;
  let fixture: ComponentFixture<TaskDefinitionsDestroyComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const tasksService = new MockTasksService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskDefinitionsDestroyComponent,
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
    fixture = TestBed.createComponent(TaskDefinitionsDestroyComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('1 tasks destroy', () => {

    const mock = [
      TaskDefinition.fromJSON({name: 'foo0', dslText: 'foo1 && foo2', composed: true, status: ''})
    ];

    beforeEach(() => {
      component.open({ taskDefinitions: mock });
      fixture.detectChanges();
    });

    it('Should display a dedicate message', () => {
      const message: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
      expect(message.textContent).toContain(`This action will destroy and delete the task`);
      expect(message.textContent).toContain(`foo0`);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(tasksService, 'destroyDefinitions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy one task', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('1 task definition(s) destroyed.');
    }));

    it('Should close the modal after a success destroy', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      const spy = spyOn(bsModalRef, 'hide');
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

  });

  describe('Multiple tasks destroy', () => {

    const mock = [
      TaskDefinition.fromJSON({name: 'foo0', dslText: 'foo1 && foo2', composed: true, status: ''}),
      TaskDefinition.fromJSON({name: 'foo1', dslText: 'foo1 && foo2', composed: true, status: ''})
    ];

    beforeEach(() => {
      component.open({ taskDefinitions: mock });
      fixture.detectChanges();
    });

    it('Should display 2 tasks', () => {
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-tasks tbody tr'));
      const tr1: HTMLElement = tr[0].nativeElement;
      const tr2: HTMLElement = tr[1].nativeElement;
      expect(tr.length).toBe(2);
      expect(tr1.textContent).toContain(mock[0].name);
      expect(tr1.textContent).toContain(mock[0].dslText);
      expect(tr2.textContent).toContain(mock[1].name);
      expect(tr2.textContent).toContain(mock[1].dslText);
    });

    it('Should call the service on validate destroy', () => {
      const spy = spyOn(tasksService, 'destroyDefinitions').and.callThrough();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(mock);
    });

    it('Should display a message after destroy 2 tasks', (() => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('#btn-destroy')).nativeElement;
      bt.click();
      expect(notificationService.testSuccess[0]).toContain('2 task definition(s) destroyed.');
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
        taskDefinitions: [
          TaskDefinition.fromJSON({name: 'foo0', dslText: 'foo1 && foo2', composed: true, status: ''}),
          TaskDefinition.fromJSON({name: 'foo1', dslText: 'foo1 && foo2', composed: true, status: ''})
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
