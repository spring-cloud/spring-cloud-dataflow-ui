import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule, BsModalRef } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockRuntimeAppsService } from '../../tests/mocks/runtime';
import { RuntimeAppsService } from '../runtime-apps.service';
import { RuntimeAppStateComponent } from '../components/runtime-app-state/runtime-app-state.component';
import { RuntimeAppComponent } from './runtime-app.component';
import { By } from '@angular/platform-browser';
import { RUNTIME_APPS } from '../../tests/mocks/mock-data';
import { RuntimeApp } from '../model/runtime-app';
import { KeyValuePipe } from '../../shared/pipes/key-value-filter.pipe';
import { RuntimeAppInstance } from '../model/runtime-app-instance';
import { NgBusyModule } from 'ng-busy';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TruncatorComponent } from '../../shared/components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from '../../shared/components/truncator/truncator-width-provider.directive';
import { NotificationService } from '../../shared/services/notification.service';

describe('RuntimeAppComponent', () => {
  let component: RuntimeAppComponent;
  let fixture: ComponentFixture<RuntimeAppComponent>;
  const notificationService = new MockNotificationService();
  const runtimeAppsService = new MockRuntimeAppsService();
  const bsModalRef = new BsModalRef();
  const mock: any = RUNTIME_APPS;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RuntimeAppComponent,
        KeyValuePipe,
        RuntimeAppStateComponent,
        LoaderComponent,
        TruncatorComponent,
        TruncatorWidthProviderDirective
      ],
      imports: [
        NgBusyModule,
        NgxPaginationModule,
        ModalModule.forRoot()
      ],
      providers: [
        { provide: RuntimeAppsService, useValue: runtimeAppsService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeAppComponent);
    component = fixture.componentInstance;
  });

  describe('2 instances with multiples attributes', () => {

    beforeEach(() => {
      component.open(new RuntimeApp(
        'ab.log',
        'failed',
        null,
        [
          new RuntimeAppInstance('Instance1', 'deployed', { foo: 'bar' }),
          new RuntimeAppInstance('Instance2', 'failed', { foo: 'bar' }),
        ]
      ));
      fixture.detectChanges();
    });

    it('should display the name, type and attributes of each instance', () => {
      const modalHeader = fixture.debugElement.query(By.css('.modal-header'));
      const panelHeadings = fixture.debugElement.queryAll(By.css('.modal-body .panel-heading'));
      expect(panelHeadings[0].nativeElement.textContent).toContain('Instance1');
      expect(panelHeadings[0].nativeElement.textContent).toContain('DEPLOYED');
      expect(panelHeadings[1].nativeElement.textContent).toContain('Instance2');
      expect(panelHeadings[1].nativeElement.textContent).toContain('FAILED');
      expect(modalHeader.nativeElement.textContent).toContain('ab.log');
    });

  });

  describe('Modal cancel', () => {

    beforeEach(() => {
      component.open(mock._embedded.appStatusResourceList[0] as RuntimeApp);
      fixture.detectChanges();
    });

    it('should call the close action (header close)', () => {
      const spy = spyOn(bsModalRef, 'hide');
      fixture.debugElement.query(By.css('.modal-header .close')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the close action (footer close)', () => {
      const spy = spyOn(bsModalRef, 'hide');
      fixture.debugElement.query(By.css('.modal-footer .btn-default')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
