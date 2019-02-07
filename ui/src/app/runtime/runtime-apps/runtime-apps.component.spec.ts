import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule, BsModalService, BsModalRef, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RuntimeAppsComponent } from './runtime-apps.component';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockRuntimeAppsService } from '../../tests/mocks/runtime';
import { RuntimeAppsService } from '../runtime-apps.service';
import { RUNTIME_APPS } from '../../tests/mocks/mock-data';
import { RuntimeAppStateComponent } from '../components/runtime-app-state/runtime-app-state.component';
import { RuntimeAppComponent } from '../runtime-app/runtime-app.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { of } from 'rxjs';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { FormsModule } from '@angular/forms';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';

describe('RuntimeAppsComponent', () => {
  let component: RuntimeAppsComponent;
  let fixture: ComponentFixture<RuntimeAppsComponent>;
  const notificationService = new MockNotificationService();
  const runtimeAppsService = new MockRuntimeAppsService();
  const sharedAboutService = new MocksSharedAboutService();
  let modalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RuntimeAppsComponent,
        RuntimeAppStateComponent,
        LoaderComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: RuntimeAppsService, useValue: runtimeAppsService },
        BsModalService,
        { provide: NotificationService, useValue: notificationService },
        GrafanaService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeAppsComponent);
    component = fixture.componentInstance;
    modalService = TestBed.get(BsModalService);
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });


  describe('1 page', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = RUNTIME_APPS;
      fixture.detectChanges();
    });

    it('should populate runtime apps', () => {
      const des: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tr td'));
      expect(des.length).toBe(8);
      expect(des[0].nativeElement.textContent).toContain('foostream.log');
      expect(des[1].nativeElement.textContent).toContain('DEPLOYED');
      expect(des[2].nativeElement.textContent).toContain('1');
      expect(des[4].nativeElement.textContent).toContain('foostream.time');
      expect(des[5].nativeElement.textContent).toContain('DEPLOYING');
      expect(des[6].nativeElement.textContent).toContain('1');
    });

    it('should not display the pagination', () => {
      expect(fixture.debugElement.query(By.css('#pagination'))).toBeNull();
    });

    it('should call open modal', () => {
      const des: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tr td'));
      const mockBsModalRef =  new BsModalRef();
      mockBsModalRef.content = {
        open: () => of('testing')
      };
      const spy = spyOn(modalService, 'show').and.returnValue(mockBsModalRef);

      des[3].query(By.css('.btn-default')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(RuntimeAppComponent, { class: 'modal-xl' });
    });

    it('should refresh the page', () => {
      const spy = spyOn(component, 'loadRuntimeApps');
      fixture.debugElement.query(By.css('button[name=refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

  describe('2 pages', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = {
        _embedded: {
          appStatusResourceList: Array.from({ length: 10 }).map((a, index) => {
            return {
              deploymentId: `foostream${{ index }}.time`,
              state: `deploying`,
              instances: { _embedded: { appInstanceStatusResourceList: [] } },
              _links: { self: { href: `http://localhost:9393/runtime/apps/foostream${{ index }}.time` } }
            };
          })
        },
        page: {
          totalElements: 14,
          totalPages: 2,
          number: 0,
          size: 10
        }
      };
      component.pagination = { page: 0, size: 10 };
      fixture.detectChanges();
    });

    it('should refresh the page', () => {
      const spy = spyOn(runtimeAppsService, 'getRuntimeApps');
      fixture.debugElement.query(By.css('button[name=refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ page: 0, size: 10 });
    });

    it('should navigation to the page 2', () => {
      const spy = spyOn(runtimeAppsService, 'getRuntimeApps');
      fixture.debugElement.queryAll(By.css('#pagination a'))[0].nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith({ page: 1, size: 10 });
    });

  });

  describe('No result', () => {

    beforeEach(() => {
      runtimeAppsService.testRuntimeApps = {
        page: {
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: 10
        }
      };
      fixture.detectChanges();
    });

    it('should display a message', () => {
      expect(fixture.debugElement.query(By.css('#empty'))).toBeTruthy();
    });

    it('should not display the table and the pagination', () => {
      expect(fixture.debugElement.query(By.css('#pagination'))).toBeNull();
      expect(fixture.debugElement.query(By.css('#table'))).toBeNull();
    });

    it('should refresh the result', () => {
      const spy = spyOn(component, 'loadRuntimeApps');
      fixture.debugElement.queryAll(By.css('#empty a'))[0].nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
