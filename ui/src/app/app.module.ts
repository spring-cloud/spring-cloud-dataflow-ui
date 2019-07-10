import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AboutModule } from './about/about.module';
import { AppsModule } from './apps/apps.module';
import { JobsModule } from './jobs/jobs.module';
import { RuntimeAppsModule } from './runtime/runtime-apps.module';
import { SharedModule } from './shared/shared.module';
import { StreamsModule } from './streams/streams.module';
import { TasksModule } from './tasks/tasks.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth/auth.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedAboutService } from './shared/services/shared-about.service';
import { LayoutModule } from './layout/layout.module';
import { AuditRecordModule } from './audit/audit-record.module';
import { map } from 'rxjs/operators';



/**
 * Executed when the app starts up. Will load the security
 * meta information. The Observable is converted to a Promise
 * and Angular will ensure that the application will not start
 * before the Promise has resolved.
 *
 * @param authService
 */
export function init(authService: AuthService, sharedAboutService: SharedAboutService) {
  return () => {
    return authService.loadSecurityInfo(true)
      .pipe(
        map(securityInfo => {
          if (securityInfo.isAuthenticated || !securityInfo.isAuthenticationEnabled) {
            sharedAboutService.loadAboutInfo();
          }
        })
      ).toPromise();
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AboutModule,
    AppsModule,
    AuditRecordModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JobsModule,
    RuntimeAppsModule,
    SharedModule,
    StreamsModule,
    TasksModule,
    LayoutModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [ AuthService, SharedAboutService ],
      'multi': true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
