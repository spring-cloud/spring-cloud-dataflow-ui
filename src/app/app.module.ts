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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
