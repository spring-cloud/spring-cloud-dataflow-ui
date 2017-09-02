import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SecurityAwareRequestOptions } from './auth/support/security-aware-request-options';

/* Feature Modules */
import { AboutModule } from './about/about.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppsModule } from './apps/apps.module';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { RuntimeAppsModule } from './runtime/runtime-apps.module';
import { SharedModule } from './shared/shared.module';
import { StreamsModule } from './streams/streams.module';
import { TasksModule } from './tasks/tasks.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AuthService } from './auth/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { reducers } from "./store/app-reducer";

/**
 * Executed when the app starts up. Will load the security
 * meta information. The Observable is converted to a Promise
 * and Angular will ensure that the application will not start
 * before the Promise has resolved.
 *
 * @param authService
 */
export function init(authService: AuthService) {
  return () => {
    return authService.loadSecurityInfo(true).toPromise();
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AboutModule,
    AnalyticsModule,
    AppsModule,
    AuthModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JobsModule,
    RuntimeAppsModule,
    SharedModule,
    StreamsModule,
    TasksModule,
    BsDropdownModule.forRoot(),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([])
  ],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [ AuthService ],
      'multi': true
    },
    {
      'provide': RequestOptions,
      'useClass': SecurityAwareRequestOptions
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
