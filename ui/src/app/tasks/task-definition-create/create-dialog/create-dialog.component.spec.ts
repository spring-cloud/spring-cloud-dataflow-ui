import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../tasks.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { TaskDefinitionCreateDialogComponent } from './create-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { MockBlockerService } from '../../../tests/mocks/blocker.service';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

describe('TaskDefinitionCreateDialogComponent', () => {
  let component: TaskDefinitionCreateDialogComponent;
  let fixture: ComponentFixture<TaskDefinitionCreateDialogComponent>;
  const tasksService = new MockTasksService();
  const notificationService = new MockNotificationService();
  const bsModalRefStub = {};
  const loggerService = new LoggerService();
  const blockerService = new MockBlockerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskDefinitionCreateDialogComponent,
        StreamDslComponent,
        FocusDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: BlockerService, useValue: blockerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: BsModalRef, useValue: bsModalRefStub },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDefinitionCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
