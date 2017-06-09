import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { StreamsComponent } from './streams/streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS} from 'angular2-busy';

const busyConfig: BusyConfig = {
    message: 'Processing..',
    delay: 0,
    template: BUSY_CONFIG_DEFAULTS.template,
    minDuration: 2000,
    backdrop: true,
    wrapperClass: BUSY_CONFIG_DEFAULTS.wrapperClass
};

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    StreamsComponent,
    StreamDefinitionsComponent,
    StreamCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BusyModule.forRoot(busyConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
