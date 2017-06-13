import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { StreamsComponent } from './streams/streams.component';
import { StreamDefinitionsComponent } from './streams/stream-definitions/stream-definitions.component';
import { StreamCreateComponent } from './streams/stream-create/stream-create.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'angular2-busy';
import { AppsComponent } from './apps/apps.component';
import { RuntimeComponent } from './runtime/runtime.component';
import { TasksComponent } from './tasks/tasks.component';
import { JobsComponent } from './jobs/jobs.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ToastyModule, ToastyConfig } from 'ng2-toasty';

const busyConfig: BusyConfig = {
    message: 'Processing..',
    delay: 0,
    template: BUSY_CONFIG_DEFAULTS.template,
    minDuration: 1000,
    backdrop: true,
    wrapperClass: BUSY_CONFIG_DEFAULTS.wrapperClass
};

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    StreamsComponent,
    StreamDefinitionsComponent,
    StreamCreateComponent,
    AppsComponent,
    RuntimeComponent,
    TasksComponent,
    JobsComponent,
    AnalyticsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BusyModule.forRoot(busyConfig),
    ToastyModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

