import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ClarityModule } from '@clr/angular';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { AboutModule } from './about/about.module';
import { LayoutModule } from './layout/layout.module';
import { StreamsModule } from './streams/streams.module';
import { TasksJobsModule } from './tasks-jobs/tasks-jobs.module';
import { ManageModule } from './manage/manage.module';
import { SecurityModule } from './security/security.module';
import { ROOT_REDUCERS, metaReducers } from './reducers/reducer';
import * as fromSecurity from './security/store/security.reducer';
import * as fromAbout from './shared/store/about.reducer';
import { EffectsModule } from '@ngrx/effects';

describe('app.component.ts', () => {

  const initialState = {
    [fromSecurity.securityFeatureKey]: fromSecurity.initialState,
    [fromAbout.aboutFeatureKey]: fromAbout.initialState
  };
  const enabledLoggedInState = {
    [fromSecurity.securityFeatureKey]: {
      enabled: true,
      authenticated: true,
      username: 'fakeuser',
      roles: []
      },
    [fromAbout.aboutFeatureKey]: {
      versions: {
        implementation: {
          name: 'fakename',
          version: 'fakeversion'
        },
        core: {
          name: 'fakename',
          version: 'fakeversion'
        },
        dashboard: {
          name: 'fakename',
          version: 'fakeversion'
        },
        shell: {
          name: 'fakename',
          version: 'fakeversion'
        }
      },
      features: {
        streams: true
      },
      runtimeEnvironment: {
        appDeployer: {

        }
      },
      security: {
        isAuthentication: true
      }
    }
  };
  const disabledState = {
    [fromSecurity.securityFeatureKey]: {
      enabled: false,
      authenticated: false,
      username: undefined,
      roles: []
      },
    [fromAbout.aboutFeatureKey]: {
      versions: {
        implementation: {
          name: 'fakename',
          version: 'fakeversion'
        },
        core: {
          name: 'fakename',
          version: 'fakeversion'
        },
        dashboard: {
          name: 'fakename',
          version: 'fakeversion'
        },
        shell: {
          name: 'fakename',
          version: 'fakeversion'
        }
      },
      features: {
        streams: true
      },
      runtimeEnvironment: {
        appDeployer: {

        }
      },
      security: {
        isAuthentication: true
      }
    }
  };
  let mockStore: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        ClarityModule,
        BrowserAnimationsModule,
        SharedModule,
        AboutModule,
        HttpClientModule,
        FormsModule,
        LayoutModule,
        StreamsModule,
        TasksJobsModule,
        ManageModule,
        SecurityModule,
        RouterTestingModule,
        StoreModule.forRoot(ROOT_REDUCERS, {metaReducers}),
        EffectsModule.forRoot([])
      ],
      providers: [
        provideMockStore({ initialState })
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    mockStore = TestBed.inject(MockStore);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show components when security enabled and not logged in', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.main-container'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.login-wrapper'))).toBeTruthy();
  });

  it('should show components when security disabled', () => {
    mockStore.setState(disabledState);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.main-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.login-wrapper'))).toBeFalsy();
  });

  it('should hide components when security enabled and logged in', () => {
    mockStore.setState(enabledLoggedInState);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.main-container'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.login-wrapper'))).toBeFalsy();
  });
});
