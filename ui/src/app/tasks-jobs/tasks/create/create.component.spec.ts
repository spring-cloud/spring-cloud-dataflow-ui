import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoleDirective } from '../../../security/directive/role.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { CreateComponent } from './create.component';
import { ToolsServiceMock } from '../../../tests/service/task-tools.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { TaskService } from '../../../shared/api/task.service';
import { of } from 'rxjs';

describe('tasks-jobs/tasks/create/create.component.ts', () => {

  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let taskService;

  beforeEach(waitForAsync(() => {
    taskService = new TaskServiceMock();
    taskService.getTask = () => {
      return of(null);
    };

    TestBed.configureTestingModule({
      declarations: [
        CreateComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        TaskServiceMock.provider,
        GroupServiceMock.provider,
        ToolsServiceMock.provider,
        ContextServiceMock.provider,
        { provide: TaskService, useValue: taskService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    component.flo.dsl = 'timestamp';
    NotificationServiceMock.mock.clearAll();
  });

  it('should create a task', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.createTask();
    fixture.detectChanges();
    await fixture.whenStable();
    component.form.get('taskName').setValue('foo');
    component.form.get('taskDescription').setValue('bar');
    fixture.detectChanges();
    await fixture.whenStable();
    component.submit();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Task creation');
  });

});

