import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { DestroyComponent } from './destroy.component';
import { StreamServiceMock } from '../../../tests/api/stream.service.mock';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { Stream } from '../../../shared/model/stream.model';
import { UpperCasePipe } from '@angular/common';
import { RoleDirective } from '../../../security/directive/role.directive';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('streams/streams/destroy/destroy.component.ts', () => {

  let component: DestroyComponent;
  let fixture: ComponentFixture<DestroyComponent>;
  let streams: Stream[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DestroyComponent,
        UpperCasePipe,
        RoleDirective
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
    fixture = TestBed.createComponent(DestroyComponent);
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

  it('should destroy a stream', async (done) => {
    component.open([streams[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Stream');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Destroy stream');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('Successfully removed stream "foo".');
    done();
  });

  it('should destroy streams', async (done) => {
    component.open(streams);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Streams');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Destroy streams');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 stream(s) destroyed.');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(StreamServiceMock.mock, 'destroyStreams').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([streams[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Destroy Stream');
    fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
