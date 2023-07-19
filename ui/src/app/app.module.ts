import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ClarityModule} from '@clr/angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {LayoutModule} from './layout/layout.module';
import {FormsModule} from '@angular/forms';
import {AboutModule} from './about/about.module';
import {AboutService} from './shared/api/about.service';
import {SharedModule} from './shared/shared.module';
import {StreamsModule} from './streams/streams.module';
import {TasksJobsModule} from './tasks-jobs/tasks-jobs.module';
import {ManageModule} from './manage/manage.module';
import {SecurityModule} from './security/security.module';
import {SettingsModule} from './settings/settings.module';
import {SecurityService} from './security/service/security.service';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {Security} from './shared/model/security.model';
import {of} from 'rxjs';
import {ROOT_REDUCERS, metaReducers} from './reducers/reducer';
import {EffectsModule} from '@ngrx/effects';
import {SettingsService} from './settings/settings.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AppsModule} from './apps/apps.module';
import {UrlUtilities} from './url-utilities.service';
import {TaskService} from './shared/api/task.service';
import {JobService} from './shared/api/job.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    SharedModule,
    AboutModule,
    HttpClientModule,
    FormsModule,
    LayoutModule,
    // DashboardModule,
    // DevModule,
    StreamsModule,
    TasksJobsModule,
    ManageModule,
    SecurityModule,
    SettingsModule,
    AppsModule,
    StoreModule.forRoot(ROOT_REDUCERS, {
      metaReducers,
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true
      }
    }),
    TranslateModule.forRoot({
      useDefaultLang: true,
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([])
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory:
        (securityService: SecurityService, aboutService: AboutService, settingsService: SettingsService) => () =>
          securityService
            .load()
            .pipe(
              mergeMap((security: Security) => {
                securityService.loaded(
                  security.authenticationEnabled,
                  security.authenticated,
                  security.username,
                  security.roles
                );
                if (security.authenticated || !security.authenticationEnabled) {
                  return aboutService.load().pipe(map(() => security));
                }
                return of(security);
              })
            )
            .pipe(switchMap(() => settingsService.load(['en', 'de', 'ru'])))
            .toPromise(),
      deps: [SecurityService, AboutService, SettingsService, TaskService, JobService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, UrlUtilities.calculateAssetUrl() + 'i18n/');
}
