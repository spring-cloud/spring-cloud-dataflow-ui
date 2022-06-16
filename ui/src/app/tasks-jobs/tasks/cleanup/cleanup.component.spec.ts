import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../tests/service/notification.service.mock';
import {By} from '@angular/platform-browser';
import {TaskServiceMock} from '../../../tests/api/task.service.mock';
import {CleanupComponent} from './cleanup.component';
import {ContextServiceMock} from '../../../tests/service/context.service.mock';
import {Task} from '../../../shared/model/task.model';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../assets/i18n/en.json';

describe('tasks-jobs/tasks/cleanup/cleanup.component.ts', () => {
  let component: CleanupComponent;
  let fixture: ComponentFixture<CleanupComponent>;
  let task: Task;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CleanupComponent],
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
        ContextServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanupComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    task = Task.parse({name: 'foo'});
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should clean up the task executions', async done => {
    component.open(task);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Clean Up Execution(s)');
    fixture.debugElement.query(By.css('.modal-footer .btn-danger')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Clean up execution(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('12 execution(s) cleaned up.');
    done();
  });
});
