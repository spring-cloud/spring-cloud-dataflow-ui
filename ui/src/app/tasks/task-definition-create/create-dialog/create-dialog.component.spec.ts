import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../../tasks.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { TaskDefinitionCreateDialogComponent } from './create-dialog.component';
import { NotificationService } from '../../../shared/services/notification.service';

describe('TaskDefinitionCreateDialogComponent', () => {
  let component: TaskDefinitionCreateDialogComponent;
  let fixture: ComponentFixture<TaskDefinitionCreateDialogComponent>;
  const tasksService = new MockTasksService();
  const notificationService = new MockNotificationService();
  const bsModalRefStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskDefinitionCreateDialogComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: NotificationService, useValue: notificationService },
        { provide: BsModalRef, useValue: bsModalRefStub }
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
