import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UnregisterComponent } from './unregister.component';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { App } from '../../shared/model/app.model';
import { By } from '@angular/platform-browser';
import { throwError } from 'rxjs';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('apps/unregister/unregister.component.ts', () => {

  let component: UnregisterComponent;
  let fixture: ComponentFixture<UnregisterComponent>;
  let apps: App[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        UnregisterComponent
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
    fixture = TestBed.createComponent(UnregisterComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    apps = [
      App.parse({
        name: 'foo',
        type: 'source',
        uri: 'docker:springcloudstream/foo-source-kafka:2.1.1.RELEASE',
        version: '2.1.1.RELEASE',
        defaultVersion: true
      }),
      App.parse({
        name: 'bar',
        type: 'source',
        uri: 'docker:springcloudstream/bar-source-kafka:2.1.1.RELEASE',
        version: '2.1.1.RELEASE',
        defaultVersion: true
      })
    ];
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should unregister an application', async (done) => {
    component.open([apps[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Unregister Application');
    const btnUnregister: HTMLButtonElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    btnUnregister.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Unregister application');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('Successfully removed app "foo" of type "source".');
    done();
  });

  it('should unregister applications', async (done) => {
    component.open(apps);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Unregister Applications');
    const btnUnregister: HTMLButtonElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    btnUnregister.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Unregister applications');
    expect(NotificationServiceMock.mock.successNotifications[0].message)
      .toBe('2 app(s) unregistered.');
    done();
  });

  it('should display an error', async (done) => {
    spyOn(AppServiceMock.mock, 'unregisterApps').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    component.open([apps[0]]);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Confirm Unregister Application');
    const btnUnregister: HTMLButtonElement = fixture.debugElement.query(By.css('.modal-footer .btn-primary')).nativeElement;
    btnUnregister.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    done();
  });

});
