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
import { Schedule } from '../../../shared/model/schedule.model';
import { ScheduleServiceMock } from '../../../tests/api/schedule.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks/schedules/destroy/destroy.component.ts', () => {

  let component: DestroyComponent;
  let fixture: ComponentFixture<DestroyComponent>;
  let schedules: Schedule[];

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
        ScheduleServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestroyComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    schedules = [
      Schedule.parse({ name: 'foo', taskDefinitionName: 'foo1' }),
      Schedule.parse({ name: 'bar', taskDefinitionName: 'bar1' }),
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should destroy a schedule', async (done) => {
    component.open([schedules[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Delete Schedule');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Delete schedule(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('1 schedule(s) deleted.');
    done();
  });

  it('should destroy schedules', async (done) => {
    component.open(schedules);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Delete Schedule');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Delete schedule(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 schedule(s) deleted.');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(ScheduleServiceMock.mock, 'destroySchedules').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([schedules[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Delete Schedule');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
