import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

import { ToastyModule, ToastyConfig } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';

import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'angular2-busy';
import { ErrorHandler } from "./model/error-handler";
import { CapitalizePipe } from './pipes/capitalize-filter.pipe';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox.component';
import { TriStateButtonComponent } from './components/tri-state-button.component';
import { KeyValuePipe } from "./pipes/key-value-filter.pipe";

const busyConfig: BusyConfig = {
    message: 'Processing..',
    delay: 0,
    template: BUSY_CONFIG_DEFAULTS.template,
    minDuration: 1000,
    backdrop: true,
    wrapperClass: BUSY_CONFIG_DEFAULTS.wrapperClass
};

/**
 * This module contains/declares all application-wide shared functionality.
 * 
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    BusyModule.forRoot(busyConfig),
    ToastyModule.forRoot() ],
  declarations: [
    CapitalizePipe,
    KeyValuePipe,
    TriStateButtonComponent,
    TriStateCheckboxComponent],
  providers: [
    StompService,
    ErrorHandler],
  exports: [
    BusyModule,
    CommonModule,
    FormsModule,
    ToastyModule,
    CapitalizePipe,
    KeyValuePipe,
    TriStateCheckboxComponent,
    TriStateButtonComponent
  ]
})
export class SharedModule { }
