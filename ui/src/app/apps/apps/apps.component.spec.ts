import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AppsComponent } from './apps.component';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AppsService } from '../apps.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { AppVersionLabelComponent } from '../components/app-versions-label/app-versions-label.component';
import { AppTypeComponent } from '../components/app-type/app-type.component';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { By } from '@angular/platform-browser';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { MasterCheckboxComponent } from '../../shared/components/master-checkbox.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { APPS } from '../../tests/mocks/mock-data';
import { DebugElement } from '@angular/core';
import { MockModalService } from '../../tests/mocks/modal';
import { AppsUnregisterComponent } from '../apps-unregister/apps-unregister.component';
import { tick } from '@angular/core/testing';
import { AppVersionsComponent } from '../app-versions/app-versions.component';
import { BusyService } from '../../shared/services/busy.service';
import { TruncatorComponent } from '../../shared/components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from '../../shared/components/truncator/truncator-width-provider.directive';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

describe('AppsComponent', () => {
  let component: AppsComponent;
  let fixture: ComponentFixture<AppsComponent>;
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const sharedAboutService = new MocksSharedAboutService();
  const authService = new MockAuthService();
  const modalService = new MockModalService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsComponent,
        AppVersionLabelComponent,
        AppTypeComponent,
        SortComponent,
        TruncatePipe,
        TruncatorComponent,
        TruncatorWidthProviderDirective,
        MasterCheckboxComponent,
        PagerComponent,
        RolesDirective
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([]),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot()
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: AuthService, useValue: authService },
        { provide: BsModalService, useValue: modalService },
        { provide: BusyService, useValue: new BusyService() },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: LoggerService, useValue: loggerService },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should navigate to the builk import applications page', () => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigate');
    component.bulkImportApps();
    expect(navigate).toHaveBeenCalledWith(['apps/bulk-import-apps']);
  });

  it('should navigate to the register application page', () => {
    fixture.detectChanges();
    const navigate = spyOn((<any>component).router, 'navigate');
    component.registerApps();
    expect(navigate).toHaveBeenCalledWith(['apps/register-apps']);
  });

  describe('no application', () => {

    beforeEach(() => {
      appsService.mock = {
        items: [],
        size: 20,
        totalElements: 0,
        totalPages: 1
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      const message = fixture.debugElement.query(By.css('#empty')).nativeElement;
      fixture.detectChanges();
      expect(message).toBeTruthy();
    });

    it('should not display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters'));
      expect(search).toBeNull();
    });

    it('should not display the table', () => {
      const table = fixture.debugElement.query(By.css('#table'));
      expect(table).toBeNull();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('One page', () => {

    beforeEach(() => {
      appsService.mock = JSON.parse(JSON.stringify(APPS));
      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#table')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should not display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination'));
      expect(pagination).toBeNull();
    });

  });

  describe('At least 2 pages', () => {

    beforeEach(() => {
      sharedAboutService.dataflowVersionInfo.featureInfo.skipperEnabled = false;
      appsService.mock = {
        items: Array.from({ length: 20 }).map((a, i) => {
          return { name: 'foo' + i, type: 'source', uri: 'http://foo.bar' };
        }),
        size: 20,
        totalElements: 30,
        totalPages: 2
      };
      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should display the table', () => {
      const table = fixture.debugElement.query(By.css('#table')).nativeElement;
      expect(table).toBeTruthy();
    });

    it('should display the pagination', () => {
      const pagination = fixture.debugElement.query(By.css('#pagination')).nativeElement;
      expect(pagination).toBeTruthy();
    });

    it('should display a message if no result after run a search', () => {
      appsService.mock = {
        items: [],
        size: 20,
        totalElements: 0,
        totalPages: 0
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#no-result')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should clear the search', () => {
      appsService.mock = {
        items: [],
        size: 20,
        totalElements: 0,
        totalPages: 0
      };
      component.form.q = 'foo';
      component.form.type = 'source';
      component.search();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#no-result .btn')).nativeElement;

      button.click();
      fixture.detectChanges();
      expect(button).toBeTruthy();
      expect(component.form.q).toBe('');
      expect(component.form.type).toBe('');
    });

    it('should apply a search', () => {
      appsService.mock = {
        items: Array.from({ length: 12 }).map((a, i) => {
          return { name: 'foo' + i, type: 'task', uri: 'http://foo.bar' };
        }),
        size: 20,
        totalElements: 12,
        totalPages: 1
      };
      component.form.q = 'foo';
      component.search();
      fixture.detectChanges();
      const noResult = fixture.debugElement.query(By.css('#table')).nativeElement;
      expect(noResult).toBeTruthy();
    });

    it('should apply a sort on name, type and uri', () => {
      const sortName: HTMLElement = fixture.debugElement.query(By.css('#sort-name a')).nativeElement;
      const sortType: HTMLElement = fixture.debugElement.query(By.css('#sort-type a')).nativeElement;
      const sortUri: HTMLElement = fixture.debugElement.query(By.css('#sort-uri a')).nativeElement;
      [
        { click: sortName, nameDesc: true, sort: 'name', order: 'DESC' },
        { click: sortName, sort: '', order: '' },
        { click: sortType, typeAsc: true, sort: 'type', order: 'ASC' },
        { click: sortType, typeDesc: true, sort: 'type', order: 'DESC' },
        { click: sortType, sort: '', order: '' },
        { click: sortUri, uriAsc: true, sort: 'uri', order: 'ASC' },
        { click: sortUri, uriDesc: true, sort: 'uri', order: 'DESC' },
        { click: sortUri, sort: '', order: '' },
        { click: sortName, nameAsc: true, sort: 'name', order: 'ASC' },
        { click: sortType, typeAsc: true, sort: 'type', order: 'ASC' },
        { click: sortUri, uriAsc: true, sort: 'uri', order: 'ASC' }
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

        if (test['typeDesc']) {
          expect(fixture.debugElement.query(By.css('#sort-type .ico .desc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-type .ico .desc'))).toBeNull();
        }
        if (test['typeAsc']) {
          expect(fixture.debugElement.query(By.css('#sort-type .ico .asc'))).toBeTruthy();
        } else {
          expect(fixture.debugElement.query(By.css('#sort-type .ico .asc'))).toBeNull();
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

        expect(component.params.sort).toBe(test.sort);
        expect(component.params.order).toBe(test.order);
      });
    });

    it('should change the page', () => {
      fixture.detectChanges();
      const buttonPage2 = fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement;
      buttonPage2.click();
      fixture.detectChanges();
      expect(component.params.page).toBe(1);
    });

  });

  describe('Application action', () => {

    beforeEach(() => {
      appsService.applicationsContext.page = 0;
      appsService.mock = JSON.parse(JSON.stringify(APPS));
      fixture.detectChanges();
    });

    it('should unregister an application', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#table tbody tr'))[0];
      const spy = spyOn(component, 'unregisterApps');
      line.query(By.css('.actions button[name=app-remove0]')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

    it('should navigate to the detail page', () => {
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#table tbody tr'))[0];
      const navigate = spyOn((<any>component).router, 'navigate');
      line.query(By.css('.actions button[name="app-view0"]')).nativeElement.click();
      expect(navigate).toHaveBeenCalledWith(['apps/source/foo']);
    });

  });

  describe('Grouped applications action', () => {

    beforeEach(() => {
      appsService.mock = JSON.parse(JSON.stringify(APPS));
      fixture.detectChanges();
    });

    it('should show the grouped action if at least one application is selected', () => {
      fixture.debugElement.queryAll(By.css('#table tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();
      expect(component.countSelected()).toBe(2);
      expect(fixture.debugElement.queryAll(By.css('#dropdown-actions'))).toBeTruthy();
    });

    it('should call the unregister modal', fakeAsync(() => {
      fixture.debugElement.queryAll(By.css('#table tbody tr')).forEach((line) => {
        const input: HTMLInputElement = line.query(By.css('td.cell-checkbox input')).nativeElement;
        input.click();
      });
      fixture.detectChanges();

      fixture.debugElement.query(By.css('#dropdown-actions .btn-dropdown')).nativeElement.click();
      fixture.detectChanges();
      tick();

      const spy = spyOn(modalService, 'show');
      fixture.debugElement.query(By.css('#unregister-apps')).nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(AppsUnregisterComponent);
    }));

  });

  describe('Skipper enabled', () => {

    beforeEach(() => {
      sharedAboutService.dataflowVersionInfo.featureInfo.skipperEnabled = true;
      appsService.mock = JSON.parse(JSON.stringify(APPS));
      fixture.detectChanges();
    });

    it('should display the version of the application', () => {
      const items: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tbody tr'));
      appsService.mock.items.forEach((mock, index) => {
        expect(items[index].nativeElement.textContent).toContain(mock.version);
      });
    });

    it('should list all the versions of the application', () => {

    });

    it('should open the modal version', () => {
      const spy = spyOn(modalService, 'show');
      const line: DebugElement = fixture.debugElement.queryAll(By.css('#table tbody tr'))[0];
      line.query(By.css('.cell-version a')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(AppVersionsComponent, { class: 'modal-xl' });
    });

  });
});
