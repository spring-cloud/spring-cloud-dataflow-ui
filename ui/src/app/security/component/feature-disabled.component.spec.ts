import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../tests/api/about.service.mock';
import {AppServiceMock} from '../../tests/api/app.service.mock';
import {NotificationServiceMock} from '../../tests/service/notification.service.mock';
import {FeatureDisabledComponent} from './feature-disabled.component';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';

describe('security/component/feature-disabled.component.ts', () => {
  let component: FeatureDisabledComponent;
  let fixture: ComponentFixture<FeatureDisabledComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureDisabledComponent],
      imports: [
        FormsModule,
        ClarityModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        RouterTestingModule.withRoutes([]),
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
    NotificationServiceMock.mock.clearAll();
    fixture = TestBed.createComponent(FeatureDisabledComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
