import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgBusyModule, BusyConfig, BUSY_CONFIG_DEFAULTS } from 'ng-busy';
import { ErrorHandler } from './model/error-handler';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { SearchfilterPipe } from './pipes/search-filter.pipe';
import { KeyValuePipe } from './pipes/key-value-filter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
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
import { RoutingStateService } from './services/routing-state.service';
import { ToastContainerModule, ToastrModule } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { LoggerService } from './services/logger.service';
import { GroupRouteService } from './services/group-route.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { PopoverModule, TimepickerModule } from 'ngx-bootstrap';
import { LayoutTypeDirective } from './directives/layout-type.directive';
import { DATAFLOW_PAGE } from './components/page/page.component';
import { DATAFLOW_LIST } from './components/list/list.component';
import { FocusDirective } from './directives/focus.directive';

const busyConfig: BusyConfig = {
  message: 'Processing...',
  delay: 0,
  minDuration: 0,
  backdrop: true,
  template: BUSY_CONFIG_DEFAULTS.template,
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
    HttpClientModule,
    ReactiveFormsModule,
    FloModule,
    NgBusyModule.forRoot(busyConfig),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxPaginationModule,
    ToastContainerModule,
    ProgressbarModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 6,
      enableHtml: true
    }),
    LocalStorageModule.withConfig({
      prefix: 'dataflow-',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    CapitalizePipe,
    KeyValuePipe,
    SearchfilterPipe,
    MasterCheckboxComponent,
    SortComponent,
    ClickOutsideDirective,
    AutoResizeDirective,
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
    PagerComponent,
    TimepickerComponent,
    LayoutTypeDirective,
    FocusDirective,
    DATAFLOW_LIST,
    DATAFLOW_PAGE
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
    BusyService,
    RoutingStateService,
    NotificationService,
    LoggerService,
    GroupRouteService
  ],
  exports: [
    StreamDslComponent,
    NgBusyModule,
    ClickOutsideDirective,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule,
    CapitalizePipe,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    KeyValuePipe,
    MapValuesPipe,
    SearchfilterPipe,
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
    PagerComponent,
    ToastContainerModule,
    TimepickerComponent,
    LayoutTypeDirective,
    FocusDirective,
    DATAFLOW_LIST,
    DATAFLOW_PAGE
  ]
})
export class SharedModule {
}
