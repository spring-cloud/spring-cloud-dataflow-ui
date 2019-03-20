import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule, BsModalRef, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AppsService } from '../../apps.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAppsService } from '../../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AppsBulkImportUriComponent } from './apps-bulk-import-uri.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router } from '@angular/router';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../../shared/components/list/list.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MockRoutingStateService } from '../../../tests/mocks/routing-state';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';

/**
 * Test {@link AppsBulkImportUriComponent}.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
describe('AppsBulkImportUriComponent', () => {
  let router;
  let component: AppsBulkImportUriComponent;
  let fixture: ComponentFixture<AppsBulkImportUriComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const routingStateService = new MockRoutingStateService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsBulkImportUriComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        FocusDirective,
        PagerComponent
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        BlockerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsBulkImportUriComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('URI', () => {
    it('should display an error message', () => {
      fixture.detectChanges();
      const spy = spyOn(notificationService, 'error');
      const bt = fixture.debugElement.query(By.css('#footer-actions .btn-primary')).nativeElement;
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
        bt.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith('Some field(s) are missing or invalid.');
      });
    });

    it('should enable the import action and call the appService.bulkImportApps method', () => {
      spyOn(router, 'navigateByUrl');

      fixture.detectChanges();
      const bt = fixture.debugElement.query(By.css('#footer-actions .btn-primary')).nativeElement;
      const inputs = {
        uri: fixture.debugElement.query(By.css('#uriInput')).nativeElement,
        force: fixture.debugElement.query(By.css('#forceInput')).nativeElement
      };
      const spy = spyOn(appsService, 'bulkImportApps').and.callThrough();
      [
        { uri: 'https://foo.ly/foo-bar-foo', force: false }
      ].forEach((a) => {
        component.form.get('uri').setValue(a.uri);
        component.form.get('force').setValue(a.force);
        fixture.detectChanges();
        expect(inputs.uri.value).toBe(a.uri);
        expect(inputs.force.checked).toBe(a.force);
        bt.click();
      });
      expect(spy).toHaveBeenCalledTimes(1);

      fixture.whenStable().then(() => {
        expect((<any>router.navigateByUrl).calls.mostRecent().args[0].toString()).toBe('/apps');
      });

    });
  });

  it('should display a toast after a success import', () => {
    spyOn(router, 'navigateByUrl');

    component.form.get('uri').setValue('https://foo.ly/foo-bar-foo');
    component.submit();
    fixture.detectChanges();
    expect(notificationService.testSuccess[0]).toContain('Apps Imported');
    fixture.whenStable().then(() => {
      expect((<any>router.navigateByUrl).calls.mostRecent().args[0].toString()).toBe('/apps');
    });
  });

});
