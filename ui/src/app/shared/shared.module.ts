import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ToastyModule, ToastyConfig } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';

import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'angular2-busy';
import {ErrorHandler} from "./model/error-handler";

const busyConfig: BusyConfig = {
    message: 'Processing..',
    delay: 0,
    template: BUSY_CONFIG_DEFAULTS.template,
    minDuration: 1000,
    backdrop: true,
    wrapperClass: BUSY_CONFIG_DEFAULTS.wrapperClass
};

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    BusyModule.forRoot(busyConfig),
    ToastyModule.forRoot() ],
  declarations: [ ],
  providers: [StompService, ErrorHandler],
  exports: [
    BusyModule,
    CommonModule,
    FormsModule,
    ToastyModule
  ]
})
export class SharedModule { }
