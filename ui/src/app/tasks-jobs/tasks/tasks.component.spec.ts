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
import {DatagridColumnPipe} from '../../shared/pipe/datagrid-column.pipe';
import {CleanupComponent} from './cleanup/cleanup.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';
import {throwError} from 'rxjs';
import {AppError} from 'src/app/shared/model/error.model';

describe('tasks-jobs/tasks/tasks.component.ts', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TasksComponent, DestroyComponent, CleanupComponent, RoleDirective, DatagridColumnPipe],
        imports: [
          FormsModule,
          ClarityModule,
          RouterTestingModule.withRoutes([]),
          TranslateTestingModule.withTranslations('en', TRANSLATIONS),
          BrowserAnimationsModule
        ],
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

  it('should catch API error and display a message', async done => {
    spyOn(TaskServiceMock.mock, 'getTasks').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message.toString()).toBe('Fake error');
    done();
  });
});
