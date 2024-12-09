import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {ClarityModule} from '@clr/angular';
import {SettingsComponent} from './settings.component';
import * as fromSettings from '../store/settings.reducer';
import {LocalStorageModule, LocalStorageService} from 'angular-2-local-storage';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../assets/i18n/en.json';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let mockStore: MockStore;

  const initialState = {
    [fromSettings.settingsFeatureKey]: {
      settings: [
        {name: fromSettings.themeActiveKey, value: 'default'},
        {name: fromSettings.reverseProxyFixKey, value: 'false'}
      ]
    }
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ClarityModule,
        StoreModule.forRoot({}),
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        LocalStorageModule.forRoot({
          prefix: 'dataflow-',
          storageType: 'localStorage'
        })
      ],
      providers: [provideMockStore({initialState}), LocalStorageService],
      declarations: [SettingsComponent]
    }).compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
