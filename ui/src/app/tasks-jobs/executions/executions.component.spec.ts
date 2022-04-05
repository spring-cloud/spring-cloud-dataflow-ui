import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExecutionsComponent} from './executions.component';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {TaskServiceMock} from '../../tests/api/task.service.mock';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {StopComponent} from './stop/stop.component';
import {CleanupComponent} from './cleanup/cleanup.component';
import {RoleDirective} from '../../security/directive/role.directive';
import {ContextServiceMock} from '../../tests/service/context.service.mock';
import {SettingsServiceMock} from '../../tests/service/settings.service.mock';
import {DatagridColumnPipe} from '../../shared/pipe/datagrid-column.pipe';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';
import {throwError} from 'rxjs';
import {AppError} from 'src/app/shared/model/error.model';

describe('tasks-jobs/executions/executions.component.ts', () => {
  let component: ExecutionsComponent;
  let fixture: ComponentFixture<ExecutionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ExecutionsComponent, StopComponent, CleanupComponent, RoleDirective, DatagridColumnPipe],
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
          ContextServiceMock.provider,
          SettingsServiceMock.provider
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutionsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should catch API error and display a message', async done => {
    spyOn(TaskServiceMock.mock, 'getExecutions').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message.toString()).toBe('Fake error');
    done();
  });
});
