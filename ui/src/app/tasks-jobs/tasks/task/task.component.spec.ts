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
import { ToolsServiceMock } from '../../../tests/service/task-tools.service.mock';
import { TaskComponent } from './task.component';
import { DestroyComponent } from '../destroy/destroy.component';
import { LogComponent } from '../../executions/execution/log/log.component';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { ScheduleServiceMock } from '../../../tests/api/schedule.service.mock';

describe('tasks-jobs/tasks/task/task.component.ts', () => {

  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskComponent,
        DestroyComponent,
        LogComponent,
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
        ToolsServiceMock.provider,
        ContextServiceMock.provider,
        ScheduleServiceMock.provider,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
