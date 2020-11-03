import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoleDirective } from '../../security/directive/role.directive';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { SchedulesComponent } from './schedules.component';
import { DestroyComponent } from './destroy/destroy.component';
import { ScheduleServiceMock } from '../../tests/api/schedule.service.mock';
import { ContextServiceMock } from '../../tests/service/context.service.mock';
import { SettingsServiceMock } from '../../tests/service/settings.service.mock';
import { PlatformFilterComponent } from './platform.filter';
import { TaskServiceMock } from '../../tests/api/task.service.mock';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { DatagridColumnPipe } from '../../shared/pipe/datagrid-column.pipe';

describe('tasks-jobs/schedules/schedules.component.ts', () => {

  let component: SchedulesComponent;
  let fixture: ComponentFixture<SchedulesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SchedulesComponent,
        DestroyComponent,
        PlatformFilterComponent,
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
        ScheduleServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider,
        TaskServiceMock.provider,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
