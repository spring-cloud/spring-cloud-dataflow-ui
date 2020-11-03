import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExecutionsComponent } from './executions.component';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { TaskServiceMock } from '../../tests/api/task.service.mock';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { StopComponent } from './stop/stop.component';
import { CleanupComponent } from './cleanup/cleanup.component';
import { RoleDirective } from '../../security/directive/role.directive';
import { ContextServiceMock } from '../../tests/service/context.service.mock';
import { SettingsServiceMock } from '../../tests/service/settings.service.mock';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { DatagridColumnPipe } from '../../shared/pipe/datagrid-column.pipe';

describe('tasks-jobs/executions/executions.component.ts', () => {

  let component: ExecutionsComponent;
  let fixture: ComponentFixture<ExecutionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExecutionsComponent,
        StopComponent,
        CleanupComponent,
        RoleDirective,
        DatagridColumnPipe
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
        ContextServiceMock.provider,
        SettingsServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
