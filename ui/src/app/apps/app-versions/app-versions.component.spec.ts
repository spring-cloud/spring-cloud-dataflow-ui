import { AppVersionsComponent } from './app-versions.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { MockAuthService } from '../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { MockConfirmService } from '../../tests/mocks/confirm';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { AppTypeComponent } from '../components/app-type/app-type.component';
import { AppVersionLabelComponent } from '../components/app-versions-label/app-versions-label.component';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { BsDropdownModule, BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppsService } from '../apps.service';
import { AuthService } from '../../auth/auth.service';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { APPS } from '../../tests/mocks/mock-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { ApplicationType } from '../../shared/model/application-type';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { OrderByPipe } from '../../shared/pipes/orderby.pipe';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClipboardModule } from 'ngx-clipboard';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link AppVersionsComponent}.
 *
 * @author Damien Vitrac
 */
describe('AppVersionsComponent', () => {
  let component: AppVersionsComponent;
  let fixture: ComponentFixture<AppVersionsComponent>;
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const authService = new MockAuthService();
  const sharedAboutService = new MocksSharedAboutService();
  const confirmService = new MockConfirmService();
  const bsModalRef = new BsModalRef();
  let activeRoute: MockActivatedRoute;
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        AppVersionsComponent,
        AppTypeComponent,
        AppVersionLabelComponent,
        SortComponent,
        OrderByPipe,
        RolesDirective,
        LoaderComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        TippyDirective
      ],
      imports: [
        BsDropdownModule.forRoot(),
        ClipboardModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: AuthService, useValue: authService },
        { provide: ConfirmService, useValue: confirmService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVersionsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  describe('Many versions with a default version', () => {

    const appMock = APPS.items[0];
    const versionsMock = appMock.versions;
    const versionMock = versionsMock[2];

    beforeEach(() => {
      appsService.mock = Object.assign({}, JSON.parse(JSON.stringify(APPS)));
      component.open(new AppRegistration('foo', ApplicationType[ApplicationType.source.toString()]));
      fixture.detectChanges();
    });

    it('should selected the current version of the application', () => {
      const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-versions tbody .activeVersion'));
      expect(trs.length).toBe(1);
      expect(trs[0].nativeElement.textContent).toContain(versionMock.version);
    });

    it('should display the versions of the application', () => {
      const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-versions tbody tr'));
      versionsMock.forEach((version, index) => {
        const tr: DebugElement = trs[index];
        expect(tr.nativeElement.textContent).toContain(version.version);
        expect(tr.nativeElement.textContent).toContain(version.uri);
      });
      expect(versionsMock.length).toBe(trs.length);
    });

    it('should display a message after change the current version', () => {
      const bt: HTMLElement = fixture.debugElement.queryAll(By.css('#table-versions tbody tr .btn-default'))[0].nativeElement;
      const refreshSpy = spyOn(component, 'refresh');
      bt.click();
      fixture.detectChanges();
      expect(notificationService.testSuccess[0]).toContain('default version');
      expect(notificationService.testSuccess[0]).toContain(versionsMock[0].version);
      expect(notificationService.testSuccess[0]).toContain('<strong>foo</strong> (source)');
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('should display the confirm modal when unregister a version', () => {
      const btn: HTMLElement = fixture.debugElement.queryAll(By.css('#table-versions tbody tr .btn-default'))[1].nativeElement;
      const spy = spyOn(confirmService, 'open').and.callThrough();
      btn.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should display a toast message after unregister a version', (() => {
      const btn: HTMLElement = fixture.debugElement.queryAll(By.css('#table-versions tbody tr .btn-default'))[1].nativeElement;
      btn.click();
      fixture.detectChanges();
      expect(notificationService.testSuccess[0]).toContain('has been unregister');
      expect(notificationService.testSuccess[0]).toContain(versionsMock[0].version);
      expect(notificationService.testSuccess[0]).toContain('<strong>foo</strong> (source)');
    }));

    // TODO: fix it
    xit('should call the unregisterAppVersion on unregister a version', (() => {
      const btn: HTMLElement = fixture.debugElement.queryAll(By.css('#table-versions tbody tr .btn-default'))[1].nativeElement;
      const spy = spyOn(appsService, 'unregisterAppVersion');
      btn.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    }));

    it('should apply a sort on name and uri', () => {
      const sortVersion: HTMLElement = fixture.debugElement.query(By.css('#sort-version a')).nativeElement;
      const sortUri: HTMLElement = fixture.debugElement.query(By.css('#sort-uri a')).nativeElement;
      [
        { click: sortVersion, versionDesc: true, sort: 'version', order: 'DESC' },
        { click: sortUri, uriAsc: true, sort: 'uri', order: 'ASC' },
        { click: sortUri, uriDesc: true, sort: 'uri', order: 'DESC' },
        { click: sortVersion, versionAsc: true, sort: 'version', order: 'ASC' },
        { click: sortUri, uriAsc: true, sort: 'uri', order: 'ASC' }
      ].forEach((test) => {
        test.click.click();
        fixture.detectChanges();
        if (test['versionDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-version .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-version .ico .desc'))).toBeNull();
        }
        if (test['versionAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-version .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-version .ico .asc'))).toBeNull();
        }

        if (test['uriDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-uri .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-uri .ico .desc'))).toBeNull();
        }
        if (test['uriAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-uri .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-uri .ico .asc'))).toBeNull();
        }
        expect(component.sort.sort).toBe(test.sort);
        expect(component.sort.order).toBe(test.order);
      });
    });

  });

  describe('Many versions without a default version', () => {

    beforeEach(() => {
      const mock = Object.assign({}, JSON.parse(JSON.stringify(APPS)));
      mock.items[0].versions = [mock.items[0].versions[0], mock.items[0].versions[1]];
      appsService.mock = mock;
      component.open(new AppRegistration('foo', ApplicationType[ApplicationType.source.toString()]));
      fixture.detectChanges();
    });

    it('should displays a warning message', () => {
      const page: HTMLElement = fixture.debugElement.query(By.css('#app-versions')).nativeElement;
      expect(page.textContent).toContain('Application unavailable.');
      expect(page.textContent).toContain('You have to set a default version for this application.');
    });

  });

  describe('Modal', () => {

    beforeEach(() => {
      appsService.mock = Object.assign({}, JSON.parse(JSON.stringify(APPS)));
      component.open(new AppRegistration('foo', ApplicationType[ApplicationType.source.toString()]));
      fixture.detectChanges();
    });

    it('Should call the close action (header close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('Should call the close action (footer close)', () => {
      fixture.detectChanges();
      const spy = spyOn(bsModalRef, 'hide');
      const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-default')).nativeElement;
      bt.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
