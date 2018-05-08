import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, PopoverModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppsRegisterComponent } from './apps-register.component';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { By } from '@angular/platform-browser';
import { BusyService } from '../../shared/services/busy.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Test {@link AppsRegisterComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsRegisterComponent', () => {
  let component: AppsRegisterComponent;
  let fixture: ComponentFixture<AppsRegisterComponent>;
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsRegisterComponent,
        CapitalizePipe
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: BusyService, useValue: new BusyService() },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsRegisterComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
    fixture.detectChanges();

  });
  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should go back to the apps list (footer close)', () => {
    const navigate = spyOn((<any>component).router, 'navigate');
    const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=cancel]')).nativeElement;
    bt.click();
    expect(navigate).toHaveBeenCalledWith(['apps']);
  });

  it('should add a form', () => {
    const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=add-form]')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-horizontal')).length).toBe(2);
    expect(component.forms.length).toBe(2);
  });

  it('should remove a form', () => {
    component.newForm();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-horizontal')).length).toBe(2);
    expect(component.forms.length).toBe(2);
    const bt: HTMLElement = fixture.debugElement.query(By.css('form[name=registerAppsForm1] .btn-danger')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-horizontal')).length).toBe(1);
    expect(component.forms.length).toBe(1);
  });

  it('should can not removed a form if is the last form', () => {
    const bt: HTMLElement = fixture.debugElement.query(By.css('form[name=registerAppsForm0] .btn-danger')).nativeElement;
    expect(bt.hasAttribute('disabled')).toBeTruthy();
  });

  describe('Required', () => {

    it('should display an error if no the name is invalid', () => {
      const tests = [
        { name: '', type: 'source', uri: 'http://foo.bar', metaDataUri: '', force: false },
        { name: 'd', type: 'sink', uri: 'http://foo.bar', metaDataUri: '', force: false }
      ];
      const form = component.forms[0];
      tests.forEach((test) => {
        form.get('name').setValue(test.name);
        form.get('type').setValue(test.type);
        form.get('uri').setValue(test.uri);
        form.get('metaDataUri').setValue(test.metaDataUri);
        form.get('force').setValue(test.force);
        fixture.detectChanges();
        const error: HTMLElement = fixture.debugElement.query(By.css('.control-name0')).nativeElement;
        const errorMessage = fixture.debugElement.query(By.css('.control-name0 .help-block'));
        expect(error.className.indexOf('has-error') > -1).toBeTruthy();
        expect(errorMessage).toBeTruthy();
      });
    });

    it('should display an error if no the type is invalid', () => {
      const tests = [
        { name: 'foobar', type: '', uri: 'http://foo.bar', metaDataUri: '', force: false },
        { name: 'foobar', type: null, uri: 'http://foo.bar', metaDataUri: '', force: false },
      ];
      const form = component.forms[0];
      tests.forEach((test) => {
        form.get('name').setValue(test.name);
        form.get('type').setValue(test.type);
        form.get('uri').setValue(test.uri);
        form.get('metaDataUri').setValue(test.metaDataUri);
        form.get('force').setValue(test.force);
        fixture.detectChanges();
        const error: HTMLElement = fixture.debugElement.query(By.css('.control-type0')).nativeElement;
        const errorMessage = fixture.debugElement.query(By.css('.control-type0 .help-block'));
        expect(error.className.indexOf('has-error') > -1).toBeTruthy();
        expect(errorMessage).toBeTruthy();
      });
    });

    it('should display an error if no the uri is invalid', () => {
      const tests = [
        { name: 'foobar', type: 'sink', uri: '', metaDataUri: '', force: false },
        { name: 'foobar', type: 'processor', uri: 'a', metaDataUri: '', force: false },
      ];
      const form = component.forms[0];
      tests.forEach((test) => {
        form.get('name').setValue(test.name);
        form.get('type').setValue(test.type);
        form.get('uri').setValue(test.uri);
        form.get('metaDataUri').setValue(test.metaDataUri);
        form.get('force').setValue(test.force);
        fixture.detectChanges();
        const error: HTMLElement = fixture.debugElement.query(By.css('.control-uri0')).nativeElement;
        const errorMessage = fixture.debugElement.query(By.css('.control-uri0 .help-block'));
        expect(error.className.indexOf('has-error') > -1).toBeTruthy();
        expect(errorMessage).toBeTruthy();
      });
    });

    it('should display an error if the metaDataUri is invalid', () => {
      const tests = [
        { name: 'foobar', type: 'sink', uri: 'http://foo.bar', metaDataUri: 'a', force: false }
      ];
      const form = component.forms[0];
      tests.forEach((test) => {
        form.get('name').setValue(test.name);
        form.get('type').setValue(test.type);
        form.get('uri').setValue(test.uri);
        form.get('metaDataUri').setValue(test.metaDataUri);
        form.get('force').setValue(test.force);
        fixture.detectChanges();
        const error: HTMLElement = fixture.debugElement.query(By.css('.control-metaDataUri0')).nativeElement;
        const errorMessage = fixture.debugElement.query(By.css('.control-metaDataUri0 .help-block'));
        expect(error.className.indexOf('has-error') > -1).toBeTruthy();
        expect(errorMessage).toBeTruthy();
      });
    });

  });

  describe('Register', () => {

    it('should not submit if no form fill', () => {
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      expect(bt.hasAttribute('disabled')).toBeTruthy();
    });

    it('should not submit if at least one filled form is invalid', () => {
      const tests = [
        { name: 'foobar1', type: 'source', uri: 'http://foo.bar', metaDataUri: '', force: false },
        { name: 'foobar2', type: 'sink', uri: 'http://foo.bar', metaDataUri: '', force: false },
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
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      expect(bt.hasAttribute('disabled')).toBeTruthy();
    });

    it('should submit if at least one form is fill and all forms filled are valid', () => {
      const tests = [
        { name: 'foobar1', type: 'source', uri: 'http://foo.bar', metaDataUri: '', force: false },
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
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      expect(bt.hasAttribute('disabled')).toBeFalsy();
    });


    it('should display a message and navigate to the application list after register', () => {
      const tests = [
        { name: 'foobar1', type: 'source', uri: 'http://foo.bar', metaDataUri: '', force: false },
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
      const navigate = spyOn((<any>component).router, 'navigate');
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(notificationService.testSuccess[0]).toContain('1 App(s) registered');
      expect(navigate).toHaveBeenCalledWith(['apps']);
    });

  });

});
