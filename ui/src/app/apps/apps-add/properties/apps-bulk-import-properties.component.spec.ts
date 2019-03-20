import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule, BsModalRef, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AppsService } from '../../apps.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAppsService } from '../../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppsBulkImportPropertiesComponent } from './apps-bulk-import-properties.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { AuthService } from '../../../auth/auth.service';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { MockRoutingStateService } from 'src/app/tests/mocks/routing-state';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

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
  const authService = new MockAuthService();
  const sharedAboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportPropertiesComponent,
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
        { provide: AuthService, useValue: authService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: AppsService, useValue: appsService },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        BlockerService
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
    it('should display an error', () => {
      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('#footer-actions .btn-primary')).nativeElement;
      const spy = spyOn(notificationService, 'error');
      const inputs = {
        properties: fixture.debugElement.query(By.css('#propertiesInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      [
        { properties: '', force: true },
        { properties: 'a=a', force: false },
        { properties: 'bar', force: false },
        { properties: 'bar', force: true },
        { properties: 'bar', force: false },
        { properties: 'foo=bar=bar', force: false },
        { properties: 'foo=bar\nbar', force: false }
      ].forEach((a) => {
        component.form.get('properties').setValue(a.properties);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();

        expect(inputs.properties.value).toBe(a.properties);
        expect(inputs.force.checked).toBe(a.force);
        bt.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith('Some field(s) are missing or invalid.');
      });
    });

    it('should enable the import action and call the appService.bulkImportApps method', () => {
      fixture.detectChanges();
      const spy = spyOn(appsService, 'bulkImportApps');
      const bt = fixture.debugElement.query(By.css('#footer-actions .btn-primary')).nativeElement;
      const inputs = {
        properties: fixture.debugElement.query(By.css('#propertiesInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      [
        { properties: 'foo=https://foo.ly/foo-bar-foo', force: true },
        { properties: 'foo=https://foo.ly/foo-bar-foo\nbar=https://foo.ly/foo-bar-foo', force: true }
      ].forEach((a) => {
        component.form.get('properties').setValue(a.properties);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(inputs.properties.value).toBe(a.properties);
        expect(inputs.force.checked).toBe(a.force);
        bt.click();
      });
      expect(spy).toHaveBeenCalledTimes(2);
    });

  });

  it('should display a toast after a success import', () => {
    component.form.get('properties').setValue('foo=https://foo.ly/foo-bar-foo');
    component.submit();
    fixture.detectChanges();
    expect(notificationService.testSuccess[0]).toContain('Apps Imported');
  });

  it('should load a file in the properties input', (done) => {
    const event = { target: { files: [new Blob(['a=a'])] } };
    component.fileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.form.get('properties').value).toContain('a=a');
      done();
    }, 1000);
  });

  it('should split the properties by new lines', () => {
    [
      { properties: '', force: true, expectedProp: [''] },
      { properties: 'a=a', force: false, expectedProp: ['a=a'] },
      { properties: 'bar', force: false, expectedProp: ['bar'] },
      { properties: 'foo=bar=bar', force: false, expectedProp: ['foo=bar=bar'] },
      { properties: 'foo=bar\nbar', force: false, expectedProp: ['foo=bar', 'bar'] }
    ].forEach(r => {
      const propsRequest = component.prepareBulkImportRequest(r.properties, r.properties);
      expect(propsRequest.properties).toEqual(r.expectedProp);
    });
  });
});
