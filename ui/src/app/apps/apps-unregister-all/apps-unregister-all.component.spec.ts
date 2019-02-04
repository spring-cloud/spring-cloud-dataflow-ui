import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { By } from '@angular/platform-browser';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppsUnregisterAllComponent } from './apps-unregister-all.component';
import { APPS } from '../../tests/mocks/mock-data';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

/**
 * Test {@link AppsUnregisterComponent}.
 *
 * @author Vitrac Damien
 */
describe('AppsUnregisterAllComponent', () => {
  let component: AppsUnregisterAllComponent;
  let fixture: ComponentFixture<AppsUnregisterAllComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsUnregisterAllComponent,
        LoaderComponent
      ],
      imports: [
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsUnregisterAllComponent);
    component = fixture.componentInstance;
    appsService.mock = JSON.parse(JSON.stringify(APPS));
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the unregister validation message', () => {
    component.open();
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
    expect(el.textContent).toContain('2 application(s)');
  });

  it('Should call appsService.unregisterAll on validation', (() => {
    component.open();
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    const spyAppsService = spyOn(appsService, 'unregisterAllApps').and.callThrough();
    bt.click();
    expect(spyAppsService).toHaveBeenCalled();
  }));

  it('Should display a message after delete one app', (() => {
    component.open();
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    bt.click();
    expect(notificationService.testSuccess[0]).toContain('Successfully removed all apps.');
  }));

  it('Should call the close action (header close)', () => {
    component.open();
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the close action (footer close)', () => {
    component.open();
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-default')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});
