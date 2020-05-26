import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { ContextService } from '../../../shared/service/context.service';
import { ImportExportServiceMock } from '../../../tests/service/import-export.service.mock';
import { TaskExportComponent } from './export.component';

describe('manage/import-export/task/export.component.ts', () => {

  let component: TaskExportComponent;
  let fixture: ComponentFixture<TaskExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskExportComponent
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
        StreamServiceMock.provider,
        TaskServiceMock.provider,
        NotificationServiceMock.provider,
        ImportExportServiceMock.provider,
        ContextService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskExportComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run a stream export', async (done) => {
    fixture.detectChanges();
    component.open();
    setTimeout(() => {
      fixture.detectChanges();
      component.run();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Task(s) export');
      expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('Task(s) has been exported.');
      expect(component.isOpen).toBeFalsy();
      done();
    }, 200);
  });

  it('should manage error if no stream selected', async (done) => {
    fixture.detectChanges();
    component.open();
    setTimeout(() => {
      fixture.detectChanges();
      component.selected = [];
      component.run();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('No task selected');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Please, select task(s) to export.');
      done();
    }, 200);
  });

});
