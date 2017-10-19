import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HttpModule } from '@angular/http';

import { ToastyModule } from 'ng2-toasty';
import { StompService } from 'ng2-stomp-service';

import { BusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'tixif-ngx-busy';
import { ErrorHandler } from './model/error-handler';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox.component';
import { TriStateButtonComponent } from './components/tri-state-button.component';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive';
import { SearchfilterPipe } from '../shared/pipes/search-filter.pipe';

import { KeyValuePipe } from './pipes/key-value-filter.pipe';

import { NgxPaginationModule } from 'ngx-pagination';
import { PropertyTableComponent } from './components/property-table/property-table.component';

import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { TabComponent, TabsComponent } from './components/tabs.component';

import { ParserService } from '../shared/services/parser.service';
import { SharedAppsService } from '../shared/services/shared-apps.service';
import { DataflowDateTimePipe } from './pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from './pipes/dataflow-duration.pipe';
import { MapValuesPipe } from './pipes/map-values-pipe.pipe';
import { FloModule } from 'spring-flo';
import { HandleComponent } from './flo/handle/handle.component';
import { DecorationComponent } from './flo/decoration/decoration.component';
import { PropertiesDialogComponent } from './flo/properties/properties-dialog.component';
import { GraphViewComponent } from './flo/graph-view/graph-view.component';

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
    FloModule,
    BusyModule.forRoot(busyConfig),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxPaginationModule,
    ToastyModule.forRoot(),
    ProgressbarModule.forRoot()
  ],
  declarations: [
    CapitalizePipe,
    KeyValuePipe,
    SearchfilterPipe,
    TriStateButtonComponent,
    TriStateCheckboxComponent,
    ClickOutsideDirective,
    PropertyTableComponent,
    TabsComponent,
    TabComponent,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    MapValuesPipe,
    DecorationComponent,
    HandleComponent,
    PropertiesDialogComponent,
    GraphViewComponent
  ],
  providers: [
    StompService,
    SharedAppsService,
    ParserService,
    ErrorHandler
  ],
  exports: [
    BusyModule,
    ClickOutsideDirective,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ToastyModule,
    CapitalizePipe,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    KeyValuePipe,
    MapValuesPipe,
    SearchfilterPipe,
    TriStateCheckboxComponent,
    TriStateButtonComponent,
    PropertyTableComponent,
    ProgressbarModule,
    DecorationComponent,
    HandleComponent,
    PropertiesDialogComponent,
    GraphViewComponent
  ]
})
export class SharedModule { }
