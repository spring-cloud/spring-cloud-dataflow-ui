import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, By } from '@angular/platform-browser';
import { PropsComponent } from './props.component';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { KeyValueComponent } from '../../../shared/component/key-value/key-value.component';
import { throwError } from 'rxjs';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('apps/props/props.component.ts', () => {
  let component: PropsComponent;
  let fixture: ComponentFixture<PropsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PropsComponent,
        KeyValueComponent
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
    fixture = TestBed.createComponent(PropsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display an error', () => {
    fixture.detectChanges();
    const inputs = {
      properties: fixture.debugElement.query(By.css('app-key-value textarea')).nativeElement,
      force: fixture.debugElement.query(By.css('clr-checkbox-wrapper input[type=checkbox]')).nativeElement
    };
    [
      { properties: '', force: true },
      { properties: 'bar', force: false },
      { properties: 'bar', force: true },
      { properties: 'bar', force: false },
      { properties: 'foo=bar\nbar', force: false }
    ].forEach((values) => {
      NotificationServiceMock.mock.clearAll();
      component.form.get('properties').setValue(values.properties);
      component.form.get('force').setValue(values.force);
      fixture.detectChanges();
      expect(inputs.properties.value).toBe(values.properties);
      expect(inputs.force.checked).toBe(values.force);
      component.submit();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('Invalid field(s)');
      expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Some field(s) are missing or invalid.');
    });
  });

  it('should run the import', () => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    const inputs = {
      properties: fixture.debugElement.query(By.css('app-key-value textarea')).nativeElement,
      force: fixture.debugElement.query(By.css('clr-checkbox-wrapper input[type=checkbox]')).nativeElement
    };
    [
      { properties: 'foo=https://foo.ly/foo-bar-foo', force: true },
      { properties: 'foo=https://foo.ly/foo-bar-foo\nbar=https://foo.ly/foo-bar-foo', force: true }
    ].forEach((values) => {
      NotificationServiceMock.mock.clearAll();
      component.form.get('properties').setValue(values.properties);
      component.form.get('force').setValue(values.force);
      fixture.detectChanges();
      expect(inputs.properties.value).toBe(values.properties);
      expect(inputs.force.checked).toBe(values.force);
      component.submit();
      fixture.detectChanges();
      expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Import application(s)');
      expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('Application(s) Imported.');
    });
    expect(navigate).toHaveBeenCalledTimes(2);
  });

  it('should handle error on run', () => {
    spyOn(AppServiceMock.mock, 'importProps').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    fixture.detectChanges();
    NotificationServiceMock.mock.clearAll();
    component.form.get('properties').setValue('foo=https://foo.ly/foo-bar-foo');
    component.form.get('force').setValue(true);
    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toContain('An error occurred while importing Apps.');
  });

});
