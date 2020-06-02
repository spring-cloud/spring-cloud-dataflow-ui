import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';
import { FormsModule } from '@angular/forms';
import { AboutModule } from './about/about.module';
import { AboutService } from './shared/api/about.service';
import { SharedModule } from './shared/shared.module';
import { StreamsModule } from './streams/streams.module';
import { TasksJobsModule } from './tasks-jobs/tasks-jobs.module';
import { ManageModule } from './manage/manage.module';
import { SecurityModule } from './security/security.module';
import { SecurityService } from './security/service/security.service';
import { map, mergeMap } from 'rxjs/operators';
import { Security } from './shared/model/security.model';
import { of } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
  ],
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
    StreamsModule,
    TasksJobsModule,
    ManageModule,
    SecurityModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (securityService: SecurityService, aboutService: AboutService) => {
        return () => {
          return securityService.load(true)
            .pipe(
              mergeMap((security: Security) => {
                if (security.isAuthenticated || !security.isAuthenticationEnabled) {
                  return aboutService.load()
                    .pipe(
                      map(about => security)
                    );
                }
                return of(security);
              })
            ).toPromise();
        };
      },
      deps: [SecurityService, AboutService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
