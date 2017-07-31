import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';

import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'angular2-busy';
import { ErrorHandler } from './model/error-handler';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox.component';
import { TriStateButtonComponent } from './components/tri-state-button.component';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive'

import { KeyValuePipe } from './pipes/key-value-filter.pipe';

import { PropertyTableComponent } from './components/property-table/property-table.component';
import { ModalModule } from 'ngx-bootstrap';
import {TabComponent, TabsComponent} from './components/tabs.component';

import { SharedAppsService } from '../shared/services/shared-apps.service';

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
    ReactiveFormsModule,
    BusyModule.forRoot(busyConfig),
    ModalModule.forRoot(),
    ToastyModule.forRoot() ],
  declarations: [
    CapitalizePipe,
    KeyValuePipe,
    TriStateButtonComponent,
    TriStateCheckboxComponent,
    ClickOutsideDirective,
    PropertyTableComponent,
    TabsComponent,
    TabComponent],
  providers: [
    StompService,
    SharedAppsService,
    ErrorHandler],
  exports: [
    BusyModule,
    ClickOutsideDirective,
    CommonModule,
    FormsModule,
    ToastyModule,
    CapitalizePipe,
    KeyValuePipe,
    TriStateCheckboxComponent,
    TriStateButtonComponent,
    PropertyTableComponent
  ]
})
export class SharedModule { }
