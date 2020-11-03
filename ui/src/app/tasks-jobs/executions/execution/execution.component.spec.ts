import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { ExecutionComponent } from './execution.component';
import { ToolsServiceMock } from '../../../tests/service/task-tools.service.mock';
import { StopComponent } from '../stop/stop.component';
import { CleanupComponent } from '../cleanup/cleanup.component';
import { RoleDirective } from '../../../security/directive/role.directive';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks-jobs/executions/execution/execution.component.ts', () => {

  let component: ExecutionComponent;
  let fixture: ComponentFixture<ExecutionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExecutionComponent,
        StopComponent,
        CleanupComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
