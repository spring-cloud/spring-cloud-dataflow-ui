import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {BsModalRef, ModalModule, PopoverModule} from 'ngx-bootstrap';
import {AppsService} from '../apps.service';
import {ToastyService} from 'ng2-toasty';
import {MockToastyService} from '../../tests/mocks/toasty';
import {MockAppsService} from '../../tests/mocks/apps';
import {AppsBulkImportComponent} from './apps-bulk-import.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {BusyService} from '../../shared/services/busy.service';

/**
 * Test {@link AppsBulkImportComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportComponent', () => {
  let component: AppsBulkImportComponent;
  let fixture: ComponentFixture<AppsBulkImportComponent>;
  const bsModalRef = new BsModalRef();
  const toastyService = new MockToastyService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportComponent
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
        {provide: ToastyService, useValue: toastyService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsBulkImportComponent);
    component = fixture.componentInstance;
    toastyService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('URI', () => {
    it('should disabled the import action', () => {
      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('.footer-actions .btn-primary')).nativeElement;
      const inputs = {
        uri: fixture.debugElement.query(By.css('#uriInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      [
        {uri: '', force: true},
        {uri: 'bar', force: false},
        {uri: 'foo@bar.com', force: true}
      ].forEach((a) => {
        component.form.get('uri').setValue(a.uri);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(inputs.uri.value).toBe(a.uri);
        expect(inputs.force.checked).toBe(a.force);
        expect(bt.disabled).toBeTruthy();
      });
    });

    it('should enable the import action and call the appService.bulkImportApps method', () => {
      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('.footer-actions .btn-primary')).nativeElement;
      const inputs = {
        uri: fixture.debugElement.query(By.css('#uriInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      const spy = spyOn(appsService, 'bulkImportApps');
      [
        {uri: 'http://foo.ly/foo-bar-foo', force: false}
      ].forEach((a) => {
        component.form.get('uri').setValue(a.uri);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(bt.disabled).not.toBeTruthy();
        expect(inputs.uri.value).toBe(a.uri);
        expect(inputs.force.checked).toBe(a.force);
        bt.click();
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Properties', () => {
    it('should disabled the import action', () => {
      component.changeTab('properties');
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
      component.changeTab('properties');
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
    component.form.get('uri').setValue('http://foo.ly/foo-bar-foo');
    component.bulkImportApps();
    fixture.detectChanges();
    expect(toastyService.testSuccess[0]).toContain('Apps Imported');
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

  it('should go back to the apps list (footer close)', () => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigate');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.footer-actions .btn-default')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith(['apps']);
  });

});
