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
import { TaskExecution } from '../../../shared/model/task-execution.model';
import { StopComponent } from './stop.component';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks-jobs/executions/stop/stop.component.ts', () => {

  let component: StopComponent;
  let fixture: ComponentFixture<StopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StopComponent
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
    fixture = TestBed.createComponent(StopComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should destroy a task', async (done) => {
    component.open(TaskExecution.parse({ executionId: 'foo' }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Stop Task Execution');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Stop task execution(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('Request submitted to stop task execution "foo".');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(TaskServiceMock.mock, 'executionStop').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open(TaskExecution.parse({ executionId: 'foo' }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Stop Task Execution');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
