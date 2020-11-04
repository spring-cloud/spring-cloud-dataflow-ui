import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { App, ApplicationType } from '../../shared/model/app.model';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { VersionComponent } from './version.component';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { HttpError } from '../../shared/model/error.model';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('apps/version/version.component.ts', () => {

  let component: VersionComponent;
  let fixture: ComponentFixture<VersionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VersionComponent,
        ConfirmComponent
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        AppServiceMock.provider,
        NotificationServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open the modal', async (done) => {
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    const items = fixture.debugElement.queryAll(By.css('.modal-body table tbody tr'));
    expect(title.textContent).toContain('Manage versions');
    expect(items.length).toBe(2);
    done();
  });

  it('should handle error', async (done) => {
    spyOn(AppServiceMock.mock, 'getAppVersions').and.callFake(() => {
      return throwError(new HttpError('Fake error', 404));
    });
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(component.isOpen).toBe(false);
    done();
  });

  it('should display the unregister version confirmation', async (done) => {
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const item = fixture.debugElement.queryAll(By.css('.table tbody tr'))[1];
    item.queryAll(By.css('button'))[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('app-confirm'));
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    const confirm = modal.queryAll(By.css('.modal-footer button'))[1].nativeElement;
    expect(title.textContent).toContain('Confirm unregister version');
    confirm.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Unregister version');
    done();
  });

  it('should handle error on unregister version', async (done) => {
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    spyOn(AppServiceMock.mock, 'unregisterApp').and.callFake(() => {
      return throwError(new HttpError('Fake error', 404));
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const item = fixture.debugElement.queryAll(By.css('.table tbody tr'))[1];
    item.queryAll(By.css('button'))[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('app-confirm'));
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    const confirm = modal.queryAll(By.css('.modal-footer button'))[1].nativeElement;
    expect(title.textContent).toContain('Confirm unregister version');
    confirm.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

  it('should display the make default version confirmation', async (done) => {
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const item = fixture.debugElement.queryAll(By.css('.table tbody tr'))[1];
    item.queryAll(By.css('button'))[1].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.queryAll(By.css('app-confirm'))[1];
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    const confirm = modal.queryAll(By.css('.modal-footer button'))[1].nativeElement;
    expect(title.textContent).toContain('Confirm make default version');
    confirm.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Default version');
    done();
  });

  it('should handle error on make default version', async (done) => {
    component.open('aggregator', (ApplicationType.processor as any) as ApplicationType);
    spyOn(AppServiceMock.mock, 'defaultVersion').and.callFake(() => {
      return throwError(new HttpError('Fake error', 404));
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const item = fixture.debugElement.queryAll(By.css('.table tbody tr'))[1];
    item.queryAll(By.css('button'))[1].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.queryAll(By.css('app-confirm'))[1];
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    const confirm = modal.queryAll(By.css('.modal-footer button'))[1].nativeElement;
    expect(title.textContent).toContain('Confirm make default version');
    confirm.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.isOpen).toBe(false);
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
