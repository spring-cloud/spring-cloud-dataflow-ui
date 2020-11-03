import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { CleanupComponent } from './cleanup.component';
import { TaskExecution } from '../../../shared/model/task-execution.model';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks-jobs/executions/cleanup/cleanup.component.ts', () => {

  let component: CleanupComponent;
  let fixture: ComponentFixture<CleanupComponent>;
  let executions: TaskExecution[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CleanupComponent
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
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanupComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    executions = [
      TaskExecution.parse({ executionId: 'foo' }),
      TaskExecution.parse({ executionId: 'bar' }),
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should destroy a task', async (done) => {
    component.open([executions[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Clean Up Task Execution(s)');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Clean up task execution(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('1 task execution(s) cleaned up.');
    done();
  });

  it('should destroy tasks', async (done) => {
    component.open(executions);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Clean Up Task Execution(s)');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Clean up task execution(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 task execution(s) cleaned up.');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(TaskServiceMock.mock, 'executionsClean').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([executions[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Clean Up Task Execution(s)');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
