import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, PopoverModule, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { AppsService } from '../../apps.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAppsService } from '../../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppsRegisterComponent } from './apps-register.component';
import { CapitalizePipe } from '../../../shared/pipes/capitalize.pipe';
import { By } from '@angular/platform-browser';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { MockRoutingStateService } from '../../../tests/mocks/routing-state';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

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
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsRegisterComponent,
        CapitalizePipe,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        FocusDirective,
        PagerComponent
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        BlockerService
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

  /*
  it('should go back to the apps list (footer close)', () => {
    const navigate = spyOn((<any>component).router, 'navigate');
    const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=cancel]')).nativeElement;
    bt.click();
    expect(navigate).toHaveBeenCalledWith(['apps']);
  });
  */

  it('should add a form', () => {
    const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=add-form]')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-register-app-box')).length).toBe(2);
    expect(component.forms.length).toBe(2);
  });

  it('should remove a form', () => {
    component.newForm();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-register-app-box')).length).toBe(2);
    expect(component.forms.length).toBe(2);
    const bt: HTMLElement = fixture.debugElement.query(By.css('#registerAppsForm1 .btn-remove')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.form-register-app-box')).length).toBe(1);
    expect(component.forms.length).toBe(1);
  });

  it('should can not removed a form if is the last form', () => {
    const bt: HTMLElement = fixture.debugElement.query(By.css('#registerAppsForm0 .btn-remove')).nativeElement;
    expect(bt.hasAttribute('disabled')).toBeTruthy();
  });

  describe('Required', () => {

    beforeEach(() => {
      component.submitted = true;
      fixture.detectChanges();
    });

    it('should display an error if no the name is invalid', () => {
      const tests = [
        { name: '', type: 'source', uri: 'https://foo.bar', metaDataUri: '', force: false },
        { name: 'd', type: 'sink', uri: 'https://foo.bar', metaDataUri: '', force: false }
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
        { name: 'foobar', type: '', uri: 'https://foo.bar', metaDataUri: '', force: false },
        { name: 'foobar', type: null, uri: 'https://foo.bar', metaDataUri: '', force: false },
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
        { name: 'foobar', type: 'sink', uri: 'https://foo.bar', metaDataUri: 'a', force: false }
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

    it('should display an error message', () => {
      const spy = spyOn(notificationService, 'error');
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Please, register at least one application.');
    });

    it('should not submit if at least one filled form is invalid', () => {
      const spy = spyOn(notificationService, 'error');
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
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Some field(s) are missing or invalid.');
    });

    /*
    TODO: fix it
    it('should submit if at least one form is fill and all forms filled are valid', () => {
      const spy = spyOn(appsService, 'registerApps');
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
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
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });
    */

    it('should display a message and navigate to the application list after register', () => {
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
      const navigate = spyOn((<any>component).router, 'navigate');
      const bt: HTMLElement = fixture.debugElement.query(By.css('button[name=register]')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(notificationService.testSuccess[0]).toContain('1 App(s) registered');
      expect(navigate).toHaveBeenCalledWith(['apps']);
    });

  });

});
