import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalRef, ModalModule, PopoverModule} from 'ngx-bootstrap';
import {AppsService} from '../../apps.service';
import {MockNotificationService} from '../../../tests/mocks/notification';
import {MockAppsService} from '../../../tests/mocks/apps';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {BusyService} from '../../../shared/services/busy.service';
import {By} from '@angular/platform-browser';
import {AppsBulkImportPropertiesComponent} from './apps-bulk-import-properties.component';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Test {@link AppsBulkImportPropertiesComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportPropertiesComponent', () => {
  let component: AppsBulkImportPropertiesComponent;
  let fixture: ComponentFixture<AppsBulkImportPropertiesComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportPropertiesComponent
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: AppsService, useValue: appsService},
        {provide: BusyService, useValue: new BusyService()},
        {provide: BsModalRef, useValue: bsModalRef},
        {provide: NotificationService, useValue: notificationService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsBulkImportPropertiesComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Properties', () => {
    it('should disabled the import action', () => {
      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('.footer-actions .btn-primary')).nativeElement;
      const inputs = {
        properties: fixture.debugElement.query(By.css('#propertiesInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      [
        {properties: '', force: true},
        {properties: 'a=a', force: false},
        {properties: 'bar', force: false},
        {properties: 'bar', force: true},
        {properties: 'bar', force: false},
        {properties: 'foo=bar=bar', force: false},
        {properties: 'foo=bar\nbar', force: false}
      ].forEach((a) => {
        component.form.get('properties').setValue(a.properties);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(inputs.properties.value).toBe(a.properties);
        expect(inputs.force.checked).toBe(a.force);
        expect(bt.disabled).toBeTruthy();
      });
    });

    it('should enable the import action and call the appService.bulkImportApps method', () => {
      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('.footer-actions .btn-primary')).nativeElement;
      const inputs = {
        properties: fixture.debugElement.query(By.css('#propertiesInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      const spy = spyOn(appsService, 'bulkImportApps');
      [
        {properties: 'foo=http://foo.ly/foo-bar-foo', force: true},
        {properties: 'foo=http://foo.ly/foo-bar-foo\nbar=http://foo.ly/foo-bar-foo', force: true}
      ].forEach((a) => {
        component.form.get('properties').setValue(a.properties);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(bt.disabled).not.toBeTruthy();
        expect(inputs.properties.value).toBe(a.properties);
        expect(inputs.force.checked).toBe(a.force);
        bt.click();
      });
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  it('should display a toast after a success import', () => {
    component.form.get('properties').setValue('foo=http://foo.ly/foo-bar-foo');
    component.submit();
    fixture.detectChanges();
    expect(notificationService.testSuccess[0]).toContain('Apps Imported');
  });

  it('should load a file in the properties input', (done) => {
    const event = {target: {files: [new Blob(['a=a'])]}};
    component.fileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.form.get('properties').value).toContain('a=a');
      done();
    }, 1000);
  });

  it('should split the properties by new lines', () => {
    [
      {properties: '', force: true, expectedProp: ['']},
      {properties: 'a=a', force: false, expectedProp: ['a=a']},
      {properties: 'bar', force: false, expectedProp: ['bar']},
      {properties: 'foo=bar=bar', force: false, expectedProp: ['foo=bar=bar']},
      {properties: 'foo=bar\nbar', force: false, expectedProp: ['foo=bar', 'bar']}
    ].forEach(r => {
      const propsRequest =  component.prepareBulkImportRequest(r.properties, r.properties);
      expect(propsRequest.properties).toEqual(r.expectedProp);
    } );
  });
});
