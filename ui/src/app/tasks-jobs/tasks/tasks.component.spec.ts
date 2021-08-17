import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RoleDirective} from '../../security/directive/role.directive';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {TasksComponent} from './tasks.component';
import {DestroyComponent} from './destroy/destroy.component';
import {TaskServiceMock} from '../../tests/api/task.service.mock';
import {GroupServiceMock} from '../../tests/service/group.service.mock';
import {ContextServiceMock} from '../../tests/service/context.service.mock';
import {SettingsServiceMock} from '../../tests/service/settings.service.mock';
import {ConfirmComponent} from '../../shared/component/confirm/confirm.component';
import {DatagridColumnPipe} from '../../shared/pipe/datagrid-column.pipe';
import {CleanupComponent} from './cleanup/cleanup.component';

describe('tasks-jobs/tasks/tasks.component.ts', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TasksComponent, DestroyComponent, CleanupComponent, RoleDirective, DatagridColumnPipe],
        imports: [FormsModule, ClarityModule, RouterTestingModule.withRoutes([]), BrowserAnimationsModule],
        providers: [
          SecurityServiceMock.provider,
          AboutServiceMock.provider,
          NotificationServiceMock.provider,
          TaskServiceMock.provider,
          GroupServiceMock.provider,
          ContextServiceMock.provider,
          SettingsServiceMock.provider
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
