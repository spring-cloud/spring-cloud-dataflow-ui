import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {AppServiceMock} from '../../tests/api/app.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {SignpostComponent} from './signpost.component';
import {InfoComponent} from '../info/info.component';
import {SharedModule} from '../../shared/shared.module';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';
import {StoreModule} from '@ngrx/store';
import {throwError} from 'rxjs';
import {AppError} from '../../shared/model/error.model';
import {ROOT_REDUCERS, metaReducers} from '../../reducers/reducer';

describe('about/signpost/signpost.component.ts', () => {
  let component: SignpostComponent;
  let fixture: ComponentFixture<SignpostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SignpostComponent, InfoComponent],
      imports: [
        FormsModule,
        ClarityModule,
        SharedModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot(ROOT_REDUCERS, {metaReducers}),
        BrowserAnimationsModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        AppServiceMock.provider,
        NotificationServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignpostComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should catch API error and display a message', async () => {
    spyOn(AboutServiceMock.mock, 'getAbout').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    const notificationMessage = NotificationServiceMock.mock.errorNotification[0].message.toString().trim();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(
      notificationMessage === 'Fake error' ||
        notificationMessage.indexOf('An error occured') > 0 ||
        notificationMessage.indexOf('Invalid field(s)') > 0
    ).toBeTruthy();
  });
});
