import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { UriComponent } from './uri.component';
import { throwError } from 'rxjs';
import { FocusDirective } from '../../../shared/directive/focus.directive';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('apps/uri/uri.component.ts', () => {
  let component: UriComponent;
  let fixture: ComponentFixture<UriComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UriComponent,
        FocusDirective
      ],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        AppServiceMock.provider,
        NotificationServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UriComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display an error message', () => {
    fixture.detectChanges();
    const inputs = {
      uri: fixture.debugElement.query(By.css('#uriInput')).nativeElement,
      force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
    };
    [
      { uri: '', force: true },
      { uri: 'bar', force: false },
      { uri: 'foo@bar.com', force: true }
    ].forEach((a) => {
      component.fillUrl(a.uri);
      component.form.get('force').setValue(a.force);
      fixture.detectChanges();
      expect(inputs.uri.value).toBe(a.uri);
      expect(inputs.force.checked).toBe(a.force);
      component.submit();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('Invalid field');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Some field(s) are missing or invalid.');
    });
  });

  it('should run an app import', async (done) => {
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    const spy = spyOn(AppServiceMock.mock, 'importUri').and.callThrough();
    component.fillUrl('https://foo.ly/foo-bar-foo');
    component.form.get('force').setValue(false);
    fixture.detectChanges();
    component.submit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navigate.calls.mostRecent().args[0].toString()).toBe('apps');
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Import application(s)');
    expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('Application(s) Imported.');
    done();
  });

  it('should handle error on run', () => {
    spyOn(AppServiceMock.mock, 'importUri').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    fixture.detectChanges();
    component.fillUrl('https://foo.ly/foo-bar-foo');
    component.form.get('force').setValue(true);
    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
  });

});
