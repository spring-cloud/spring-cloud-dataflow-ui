import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ToastyModule } from 'ng2-toasty';
import { NgBusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'ng-busy';
import { ErrorHandler } from './model/error-handler';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { TriStateCheckboxComponent } from './components/tri-state-checkbox.component';
import { TriStateButtonComponent } from './components/tri-state-button.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SearchfilterPipe } from './pipes/search-filter.pipe';
import { KeyValuePipe } from './pipes/key-value-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { PropertyTableComponent } from './components/property-table/property-table.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabComponent, TabsComponent } from './components/tabs.component';
import { ParserService } from './services/parser.service';
import { SharedAppsService } from './services/shared-apps.service';
import { DataflowDateTimePipe } from './pipes/dataflow-date-time.pipe';
import { DataflowDurationPipe } from './pipes/dataflow-duration.pipe';
import { MapValuesPipe } from './pipes/map-values-pipe.pipe';
import { FloModule } from 'spring-flo';
import { HandleComponent } from './flo/handle/handle.component';
import { DecorationComponent } from './flo/decoration/decoration.component';
import { PropertiesDialogComponent } from './flo/properties/properties-dialog.component';
import { GraphViewComponent } from './flo/graph-view/graph-view.component';
import { SharedAboutService } from './services/shared-about.service';
import { MasterCheckboxComponent } from './components/master-checkbox.component';
import { SortComponent } from './components/sort/sort.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { ConfirmService } from './components/confirm/confirm.service';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { BusyService } from './services/busy.service';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { StreamDslComponent } from './components/dsl/dsl.component';
import { LoaderComponent } from './components/loader/loader.component';
import { TruncatorComponent } from './components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from './components/truncator/truncator-width-provider.directive';
import { PagerComponent } from './components/pager/pager.component';

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
    NgBusyModule.forRoot(busyConfig),
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
    MasterCheckboxComponent,
    SortComponent,
    ClickOutsideDirective,
    AutoResizeDirective,
    PropertyTableComponent,
    TabsComponent,
    TabComponent,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    MapValuesPipe,
    DecorationComponent,
    HandleComponent,
    PropertiesDialogComponent,
    GraphViewComponent,
    StreamDslComponent,
    TruncatePipe,
    TruncatorComponent,
    TruncatorWidthProviderDirective,
    OrderByPipe,
    ConfirmComponent,
    LoaderComponent,
    PagerComponent
  ],
  entryComponents: [
    ConfirmComponent
  ],
  providers: [
    SharedAppsService,
    SharedAboutService,
    ParserService,
    ErrorHandler,
    ConfirmService,
    BusyService
  ],
  exports: [
    StreamDslComponent,
    NgBusyModule,
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
    MasterCheckboxComponent,
    SortComponent,
    HandleComponent,
    PropertiesDialogComponent,
    GraphViewComponent,
    TruncatePipe,
    TruncatorComponent,
    TruncatorWidthProviderDirective,
    OrderByPipe,
    ConfirmComponent,
    AutoResizeDirective,
    LoaderComponent,
    PagerComponent
  ]
})
export class SharedModule {
}
