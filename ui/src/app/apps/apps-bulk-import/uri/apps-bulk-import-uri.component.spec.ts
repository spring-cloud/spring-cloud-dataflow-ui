import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { AppsService } from '../../apps.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAppsService } from '../../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BusyService } from '../../../shared/services/busy.service';
import { By } from '@angular/platform-browser';
import { AppsBulkImportUriComponent } from './apps-bulk-import-uri.component';
import { NotificationService } from '../../../shared/services/notification.service';

/**
 * Test {@link AppsBulkImportUriComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppsBulkImportUriComponent', () => {
  let component: AppsBulkImportUriComponent;
  let fixture: ComponentFixture<AppsBulkImportUriComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportUriComponent
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
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsBulkImportUriComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
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
        { uri: '', force: true },
        { uri: 'bar', force: false },
        { uri: 'foo@bar.com', force: true }
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
        { uri: 'http://foo.ly/foo-bar-foo', force: false }
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

  it('should display a toast after a success import', () => {
    component.form.get('uri').setValue('http://foo.ly/foo-bar-foo');
    component.submit();
    fixture.detectChanges();
    expect(notificationService.testSuccess[0]).toContain('Apps Imported');
  });

});
