import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FocusDirective } from '../../../shared/directive/focus.directive';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { WebsiteStartersComponent } from './website-starters.component';
import { throwError } from 'rxjs';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('apps/website-starters/website-starters.component.ts', () => {
  let component: WebsiteStartersComponent;
  let fixture: ComponentFixture<WebsiteStartersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        WebsiteStartersComponent,
        FocusDirective
      ],
      imports: [
        BrowserModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(WebsiteStartersComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should run an app import', async (done) => {
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    const spy = spyOn(AppServiceMock.mock, 'importUri').and.callThrough();
    component.value = 'stream.kafka.maven';
    component.force = true;
    fixture.detectChanges();
    component.submit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navigate.calls.mostRecent().args[0].toString()).toBe('apps');
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Import starters');
    expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('Application(s) Imported.');
    done();
  });

  it('should display an error message', () => {
    component.value = 'foo';
    component.force = true;
    component.submit();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('No starter selected');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toBe('Please, select a starter pack.');
  });

  it('should handle error on run', () => {
    spyOn(AppServiceMock.mock, 'importUri').and.callFake(() => {
      return throwError(new Error('Fake error'));
    });
    fixture.detectChanges();
    component.value = 'stream.kafka.maven';
    component.force = true;
    fixture.detectChanges();
    component.submit();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
  });

});
