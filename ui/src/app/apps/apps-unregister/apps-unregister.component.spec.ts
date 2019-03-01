import { AppsUnregisterComponent } from './apps-unregister.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { AppsService } from '../apps.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockAppsService } from '../../tests/mocks/apps';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { ApplicationType } from '../../shared/model/application-type';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AppTypeComponent } from '../components/app-type/app-type.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Test {@link AppsUnregisterComponent}.
 *
 * @author Vitrac Damien
 */
describe('AppsUnregisterComponent', () => {
  let component: AppsUnregisterComponent;
  let fixture: ComponentFixture<AppsUnregisterComponent>;
  const bsModalRef = new BsModalRef();
  const notificationService = new MockNotificationService();
  const appsService = new MockAppsService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppsUnregisterComponent, AppTypeComponent
      ],
      imports: [
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AppsService, useValue: appsService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        BlockerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsUnregisterComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display the unregister validation message (1 app)', () => {
    component.open([new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com')]);
    fixture.detectChanges();
    const el: HTMLElement = fixture.debugElement.query(By.css('.modal-body')).nativeElement;
    expect(el.textContent).toContain('foo');
    expect(el.textContent).toContain(ApplicationType[ApplicationType.sink.toString()].toString().toUpperCase());
  });

  it('should display the unregister validation message (2 app)', () => {
    component.open([
      new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
      new AppRegistration('bar', ApplicationType[ApplicationType.processor.toString()], 'maven://url.com')
    ]);
    fixture.detectChanges();
    const query: DebugElement[] = fixture.debugElement.queryAll(By.css('.modal-body table tbody tr'));
    const l1 = query[0].nativeElement;
    const l2 = query[1].nativeElement;
    expect(l1.textContent).toContain('foo');
    expect(l1.textContent).toContain('SINK');
    expect(l2.textContent).toContain('bar');
    expect(l2.textContent).toContain('PROCESSOR');
  });

  it('Should call appsService.unregister on validation (2 apps)', (() => {
    component.open([
      new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
      new AppRegistration('bar', ApplicationType[ApplicationType.processor.toString()], 'maven://url.com')
    ]);
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    const spyAppsService = spyOn(appsService, 'unregisterApps').and.callThrough();
    bt.click();
    expect(spyAppsService).toHaveBeenCalled();
  }));

  it('Should call appsService.unregister on validation (1 app)', (() => {
    component.open([new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com')]);
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    const spyAppsService = spyOn(appsService, 'unregisterApps').and.callThrough();
    bt.click();
    expect(spyAppsService).toHaveBeenCalled();
  }));

  it('Should display a message after delete one app', (() => {
    component.open([new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com')]);
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    bt.click();
    expect(notificationService.testSuccess[0]).toContain('Successfully removed app "foo" of type "sink".');
  }));

  it('Should display a message after delete at leat 2 apps)', (() => {
    component.open([
      new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
      new AppRegistration('bar', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
    ]);
    fixture.detectChanges();
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    bt.click();
    expect(notificationService.testSuccess[0]).toContain('2 app(s) unregistered.');
  }));

  it('Should call the close action (header close)', () => {
    component.open([
      new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
      new AppRegistration('bar', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com')
    ]);
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-header .close')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('Should call the close action (footer close)', () => {
    component.open([
      new AppRegistration('foo', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com'),
      new AppRegistration('bar', ApplicationType[ApplicationType.sink.toString()], 'maven://url.com')
    ]);
    fixture.detectChanges();
    const spy = spyOn(bsModalRef, 'hide');
    const bt: HTMLElement = fixture.debugElement.query(By.css('.modal-footer .btn-default')).nativeElement;
    bt.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

});
