import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UnregisterComponent } from '../unregister/unregister.component';
import { VersionComponent } from '../version/version.component';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { CardComponent } from '../../shared/component/card/card.component';
import { OrderByPipe } from '../../shared/pipe/order-by.pipe';
import { By } from '@angular/platform-browser';
import { HttpError } from '../../shared/model/error.model';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('apps/apps.component.ts', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        UnregisterComponent,
        VersionComponent,
        ConfirmComponent,
        CardComponent,
        OrderByPipe
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
        ContextServiceMock.provider,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ appName: 'aggregator', appType: 'processor' }),
          },
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    NotificationServiceMock.mock.clearAll();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should be created', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    done();
  });

  it('should redirect if error versions', async (done) => {
    spyOn(AppServiceMock.mock, 'getAppVersions').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('/apps');
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

  it('should redirect if no application', async (done) => {
    spyOn(AppServiceMock.mock, 'getAppVersions').and.callFake(() => {
      return of([]);
    });
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('/apps');
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('No application found.');
    done();
  });

  it('should display the unregister confirmation', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btnUnregister')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('app-unregister'));
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Unregister Application');
    done();
  });

  it('should display the version modal', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btnVersion')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('app-version'));
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Manage versions');
    done();
  });

  it('should handle error on application properties call', async (done) => {
    spyOn(AppServiceMock.mock, 'getApp').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

  it('should handle error on application properties call (404 redirection)', async (done) => {
    spyOn(AppServiceMock.mock, 'getApp').and.callFake(() => {
      return throwError(new HttpError('Fake error', 404));
    });
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(navigate).toHaveBeenCalledWith('/apps');
    done();
  });

});

