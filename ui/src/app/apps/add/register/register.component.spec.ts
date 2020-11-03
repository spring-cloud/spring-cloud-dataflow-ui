import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FocusDirective } from '../../../shared/directive/focus.directive';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { RegisterComponent } from './register.component';
import { throwError } from 'rxjs';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('apps/register/register.component.ts', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
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
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.isValid()).toBeFalsy();
    expect(component.noValue()).toBeTruthy();
  });

  it('should add/remove a form', () => {
    fixture.debugElement.query(By.css('button[name=add-form]')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.app-group')).length).toBe(2);
    expect(component.forms.length).toBe(2);
    fixture.debugElement.query(By.css('.app-group .btn-secondary')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.app-group')).length).toBe(1);
    const bt: HTMLElement = fixture.debugElement.query(By.css('.app-group .btn-secondary')).nativeElement;
    expect(bt.hasAttribute('disabled')).toBeTruthy();
  });

  it('should run a register', () => {
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    const tests = [
      { name: 'foobar1', type: 'source', uri: 'https://foo.bar', metaDataUri: '', force: false },
      { name: '', type: '', uri: '', metaDataUri: '', force: false },
      { name: '', type: '', uri: '', metaDataUri: '', force: false },
    ];
    component.newForm();
    component.newForm();
    tests.forEach((test, index) => {
      component.forms[index].get('name').setValue(test.name);
      component.forms[index].get('type').setValue(test.type);
      component.forms[index].get('uri').setValue(test.uri);
      component.forms[index].get('metaDataUri').setValue(test.metaDataUri);
      component.forms[index].get('force').setValue(test.force);
    });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button[name=register]')).nativeElement.click();
    fixture.detectChanges();
    expect(component.isValid()).toBeTruthy();
    expect(component.noValue()).toBeFalsy();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toContain('Register application(s).');
    expect(NotificationServiceMock.mock.successNotifications[0].message).toContain('1 App(s) registered');
    expect(navigate.calls.mostRecent().args[0].toString()).toBe('apps');
  });

  it('should display an error message if empty', () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button[name=register]')).nativeElement.click();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('Invalid application');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Please, register at least one application.');
  });

  it('should display errors form', () => {
    fixture.detectChanges();
    const tests = [
      { name: 'foobar1', type: 'source', uri: 'https://foo.bar', metaDataUri: '', force: false },
      { name: 'foobar2', type: 'sink', uri: 'https://foo.bar', metaDataUri: '', force: false },
      { name: 'foobar3', type: 'processor', uri: '', metaDataUri: '', force: false },
    ];
    component.newForm();
    component.newForm();
    tests.forEach((test, index) => {
      component.forms[index].get('name').setValue(test.name);
      component.forms[index].get('type').setValue(test.type);
      component.forms[index].get('uri').setValue(test.uri);
      component.forms[index].get('metaDataUri').setValue(test.metaDataUri);
      component.forms[index].get('force').setValue(test.force);
    });
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button[name=register]')).nativeElement.click();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('Invalid application(s)');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Some field(s) are missing or invalid.');
  });

  it('should handle error on run', () => {
    spyOn(AppServiceMock.mock, 'registerProps').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    fixture.detectChanges();
    const test = { name: 'foobar1', type: 'source', uri: 'https://foo.bar', metaDataUri: '', force: false };
    component.forms[0].get('name').setValue(test.name);
    component.forms[0].get('type').setValue(test.type);
    component.forms[0].get('uri').setValue(test.uri);
    component.forms[0].get('metaDataUri').setValue(test.metaDataUri);
    component.forms[0].get('force').setValue(test.force);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('button[name=register]')).nativeElement.click();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
  });

});
