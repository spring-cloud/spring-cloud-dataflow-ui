import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { DestroyComponent } from './destroy.component';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { Task } from '../../../shared/model/task.model';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks/tasks/destroy/destroy.component.ts', () => {

  let component: DestroyComponent;
  let fixture: ComponentFixture<DestroyComponent>;
  let tasks: Task[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DestroyComponent
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
    fixture = TestBed.createComponent(DestroyComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    tasks = [
      Task.parse({ name: 'foo', dslText: 'file|log' }),
      Task.parse({ name: 'bar', dslText: 'file|log' }),
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should destroy a task', async (done) => {
    component.open([tasks[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Task');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Destroy task(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('1 task definition(s) destroyed.');
    done();
  });

  it('should destroy tasks', async (done) => {
    component.open(tasks);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Tasks');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Destroy task(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 task definition(s) destroyed.');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(TaskServiceMock.mock, 'destroyTasks').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([tasks[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Task');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
