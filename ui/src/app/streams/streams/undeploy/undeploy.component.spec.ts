import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { Stream } from '../../../shared/model/stream.model';
import { UndeployComponent } from './undeploy.component';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('apps/undeploy/undeploy.component.ts', () => {

  let component: UndeployComponent;
  let fixture: ComponentFixture<UndeployComponent>;
  let streams: Stream[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UndeployComponent
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
        StreamServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UndeployComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    streams = [
      Stream.parse({ name: 'foo', dslText: 'file|log' }),
      Stream.parse({ name: 'bar', dslText: 'file|log' }),
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should undeploy a stream', async (done) => {
    component.open([streams[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Undeploy Stream');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Undeploy stream');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('Successfully undeploy stream "foo".');
    done();
  });

  it('should undeploy streams', async (done) => {
    component.open(streams);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Undeploy Streams');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Undeploy streams');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 stream(s) undeployed.');
    done();
  });

  it('should undeploy an error', async (done) => {
    spyOn(StreamServiceMock.mock, 'undeployStreams').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([streams[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Undeploy Stream');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
