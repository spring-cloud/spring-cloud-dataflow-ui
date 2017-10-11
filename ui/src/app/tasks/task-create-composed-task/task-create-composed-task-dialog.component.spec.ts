import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreateComposedTaskDialogComponent } from './task-create-composed-task-dialog.component';
import { ToastyService } from 'ng2-toasty';
import { BsModalRef } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { MockToastyService } from '../../tests/mocks/toasty';
import { MockTasksService } from '../../tests/mocks/tasks';

describe('TaskCreateComposedTaskDialogComponent', () => {
  let component: TaskCreateComposedTaskDialogComponent;
  let fixture: ComponentFixture<TaskCreateComposedTaskDialogComponent>;
  const tasksService = new MockTasksService();
  const toastyService = new MockToastyService();
  const bsModalRefStub = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskCreateComposedTaskDialogComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ToastyService, useValue: toastyService },
        { provide: BsModalRef, useValue: bsModalRefStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCreateComposedTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
