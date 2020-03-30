import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule, BsModalRef, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppDetailsComponent } from './app-details.component';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { AppTypeComponent } from '../components/app-type/app-type.component';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { ActivatedRoute } from '@angular/router';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { APPS } from '../../tests/mocks/mock-data';
import { MockConfirmService } from '../../tests/mocks/confirm';
import { ConfirmService } from '../../shared/components/confirm/confirm.service';
import { AppVersionLabelComponent } from '../components/app-versions-label/app-versions-label.component';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { OrderByPipe } from '../../shared/pipes/orderby.pipe';
import { AppVersionsComponent } from '../app-versions/app-versions.component';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Observable, of } from 'rxjs';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TippyDirective } from '../../shared/directives/tippy.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Test {@link AppDetailsComponent}.
 *
 * @author Damien Vitrac
 * @author Gunnar Hillert
 */
describe('AppDetailsComponent', () => {
  let component: AppDetailsComponent;
  let fixture: ComponentFixture<AppDetailsComponent>;
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const authService = new MockAuthService();
  const sharedAboutService = new MocksSharedAboutService();

  let modalService;
  const confirmService = new MockConfirmService();
  const routingStateService = new MockRoutingStateService();
  let activeRoute: MockActivatedRoute;
  const loggerService = new LoggerService();

  const commonTestParams = { appName: 'foo', appType: 'source' };

  const sourceMock = JSON.parse(JSON.stringify(APPS));
  const appMock = sourceMock.items[0];

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        AppDetailsComponent,
        AppTypeComponent,
        AppVersionLabelComponent,
        SortComponent,
        OrderByPipe,
        RolesDirective,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        LoaderComponent,
        PagerComponent,
        TippyDirective
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: activeRoute },
        BsModalService,
        { provide: ConfirmService, useValue: confirmService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(AppDetailsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
    appsService.mock = Object.assign({}, sourceMock);
    modalService = TestBed.inject(BsModalService);
  });

  describe('Application properties', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should contains the information related to the application (uri, type name)', () => {
      const page: HTMLElement = fixture.debugElement.query(By.css('#app-details')).nativeElement;
      expect(page.textContent).toContain('foo');
      expect(page.textContent).toContain('SOURCE');
      expect(page.textContent).toContain('https://foo.bar:1.0.0');
    });

    it('should display the metadata related to the version', () => {
      const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
      appMock.versions.find((a) => a['defaultVersion']).metadata.forEach((a, index) => {
        const tr = trs[index].nativeElement;
        expect(tr.textContent).toContain(a.name);
        expect(tr.textContent).toContain(a.description);
        expect(trs.length).toBe(2);
      });
    });

    it('should apply a sort on name and uri', () => {
      const sortProperty: HTMLElement = fixture.debugElement.query(By.css('#sort-name a')).nativeElement;
      [
        { click: sortProperty, nameAsc: true, sort: 'name', order: 'ASC' },
        { click: sortProperty, nameDesc: true, sort: 'name', order: 'DESC' },
        { click: sortProperty, sort: '', order: '' },
      ].forEach((test) => {
        test.click.click();
        fixture.detectChanges();
        if (test['nameDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .desc'))).toBeNull();
        }
        if (test['nameAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-name .ico .asc'))).toBeNull();
        }

        expect(component.sort.sort).toBe(test.sort);
        expect(component.sort.order).toBe(test.order);
      });
    });

  });

  describe('Application properties (skipper)', () => {

    describe('Many versions with a default version', () => {

      const versionMock = appMock.versions[2];

      beforeEach(() => {
        fixture.detectChanges();
      });

      it('should display the dropdown versions (selected the current version) and contain properties of the current version', () => {
        const dropdownSelect: HTMLElement = fixture.debugElement.query(By.css('#version-dropdown .btn-dropdown')).nativeElement;
        const icoDefault: HTMLElement = fixture.debugElement
          .query(By.css('#version-dropdown .btn-dropdown .ico-current-version')).nativeElement;

        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        versionMock.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
          expect(trs.length).toBe(2);
        });

        expect(dropdownSelect.textContent).toContain(versionMock.version);
        expect(icoDefault).not.toBeNull();
        expect(component.versionSelect).toBe(versionMock.version);
      });

      it('should switch version and display the new properties', () => {
        component.selectVersion(appMock.versions[0].version);
        fixture.detectChanges();
        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        const dropdown: HTMLElement = fixture.debugElement.query(By.css('#version-dropdown .btn-dropdown')).nativeElement;
        const versionNew = appMock.versions[0];
        versionNew.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
        });
        expect(dropdown.textContent).toContain(appMock.versions[0].version);
      });

    });

    describe('One version with a default version', () => {

      const versionMock = appMock.versions[2];

      beforeEach(() => {
        const mock = Object.assign({}, sourceMock);
        appMock.versions = [versionMock];
        appsService.mock = mock;
        fixture.detectChanges();
      });

      it('should contain the informations of the app/version', () => {
        const page: HTMLElement = fixture.debugElement.query(By.css('#app-details')).nativeElement;
        expect(page.textContent).toContain(appMock.name);
        expect(page.textContent).toContain(appMock.type.toUpperCase());
        expect(page.textContent).toContain(versionMock.version);
        expect(page.textContent).toContain(versionMock.uri);
      });

      it('should not display the dropdown versions and contain properties of the current version', () => {
        const dropdown: DebugElement = fixture.debugElement.query(By.css('#version-dropdown .btn-dropdown'));
        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        versionMock.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
          expect(trs.length).toBe(2);
        });
        expect(dropdown).toBeNull();
      });

    });

    describe('Many versions without a default version', () => {

      const versionsMock = [appMock.versions[0], appMock.versions[1]];

      beforeEach(() => {
        const mock = Object.assign({}, sourceMock);
        appMock.versions = versionsMock;
        appsService.mock = mock;
        fixture.detectChanges();
      });

      it('should contain the informations of the app', () => {
        const page: HTMLElement = fixture.debugElement.query(By.css('#app-details')).nativeElement;
        expect(page.textContent).toContain(appMock.name);
        expect(page.textContent).toContain(appMock.type.toUpperCase());
      });

      it('should display a error message', () => {
        const message: HTMLElement = fixture.debugElement.query(By.css('#no-default-version')).nativeElement;
        expect(message).toBeTruthy();
      });

    it('should open the modal versions', () => {
        const mockBsModalRef =  new BsModalRef();
        mockBsModalRef.content = {
          open: () => of('testing')
        };
        const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);

        fixture.debugElement.query(By.css('#no-default-version a')).nativeElement.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(AppVersionsComponent, { class: 'modal-xl' });
      });

      // Note: have to be review (related to the workaround #1871)
      // Based on the apps list information
      it('should display the properties of the first version find', () => {
        const versionTest = versionsMock[0];
        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        const dropdown: HTMLElement = fixture.debugElement.query(By.css('#version-dropdown .btn-dropdown')).nativeElement;
        versionTest.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
          expect(trs.length).toBe(2);
        });
        expect(dropdown.textContent).toContain(versionTest.version);
      });

      it('should switch version and display the new properties', () => {
        const versionTest = versionsMock[1];
        component.selectVersion(versionTest.version);
        fixture.detectChanges();
        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        const dropdown: HTMLElement = fixture.debugElement.query(By.css('#version-dropdown .btn-dropdown')).nativeElement;
        versionTest.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
        });
        expect(dropdown.textContent).toContain(versionTest.version);
      });

    });

    describe('One version without a default version', () => {

      const versionMock = appMock.versions[0];

      beforeEach(() => {
        const mock = Object.assign({}, sourceMock);
        appMock.versions = [versionMock];
        appsService.mock = mock;
        fixture.detectChanges();
      });

      it('should contain the informations of the app', () => {
        const page: HTMLElement = fixture.debugElement.query(By.css('#app-details')).nativeElement;
        expect(page.textContent).toContain(appMock.name);
        expect(page.textContent).toContain(appMock.type.toUpperCase());
      });

      it('should display a error message', () => {
        const page: HTMLElement = fixture.debugElement.query(By.css('#app-details')).nativeElement;
        expect(page.textContent).toContain('Application unavailable');
        expect(page.textContent).toContain('You have to set a default version for this application');
      });

      it('should not display the dropdown versions', () => {
        const dropdown: DebugElement = fixture.debugElement.query(By.css('#version-dropdown'));
        expect(dropdown).toBeNull();
      });

      it('should display the properties', () => {
        const trs: DebugElement[] = fixture.debugElement.queryAll(By.css('#table-properties tbody tr'));
        versionMock.metadata.forEach((a, index) => {
          const tr = trs[index].nativeElement;
          expect(tr.textContent).toContain(a.name);
          expect(tr.textContent).toContain(a.description);
          expect(trs.length).toBe(2);
        });
      });

    });

  });

});
