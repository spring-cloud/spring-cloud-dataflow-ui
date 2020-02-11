import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from './model/error-handler';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { SearchfilterPipe } from './pipes/search-filter.pipe';
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
import { FloModule } from 'spring-flo';
import { PropertiesDialogComponent } from './flo/properties/properties-dialog.component';
import { PropertiesGroupsDialogComponent } from './flo/properties-groups/properties-groups-dialog.component';
import { GraphViewComponent } from './flo/graph-view/graph-view.component';
import { SharedAboutService } from './services/shared-about.service';
import { MasterCheckboxComponent } from './components/master-checkbox.component';
import { SortComponent } from './components/sort/sort.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { OrderByPipe } from './pipes/orderby.pipe';
import { ConfirmService } from './components/confirm/confirm.service';
import { ConfirmComponent } from './components/confirm/confirm.component';
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
import { PopoverModule, TimepickerModule } from 'ngx-bootstrap';
import { LayoutTypeDirective } from './directives/layout-type.directive';
import { DATAFLOW_PAGE } from './components/page/page.component';
import { DATAFLOW_LIST } from './components/list/list.component';
import { FocusDirective } from './directives/focus.directive';
import { GrafanaModule } from './grafana/grafana.module';
import { KvRichTextComponent } from './components/kv-rich-text/kv-rich-text.component';
import { BlockerComponent } from './components/blocker/blocker.component';
import { HttpLoaderComponent } from './components/http-loader/http-loader.component';
import { HttpLoaderInterceptor } from './components/http-loader/http-loader.interceptor';
import { HttpLoaderService } from './components/http-loader/http-loader.service';
import { BlockerService } from './components/blocker/blocker.service';
import { DocService } from './services/doc.service';
import { TippyDirective } from './directives/tippy.directive';


/**
 * This module contains/declares all application-wide shared functionality.
 *
 * @author Gunnar Hillert
 * @author Ilayaperumal Gopinathan
 * @author Damien Vitrac
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FloModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    PopoverModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxPaginationModule,
    ToastContainerModule,
    ProgressbarModule.forRoot(),
    GrafanaModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      maxOpened: 6,
      enableHtml: true
    }),
    LocalStorageModule.forRoot({
      prefix: 'dataflow-',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    CapitalizePipe,
    SearchfilterPipe,
    MasterCheckboxComponent,
    SortComponent,
    AutoResizeDirective,
    TabsComponent,
    TabComponent,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    PropertiesDialogComponent,
    PropertiesGroupsDialogComponent,
    GraphViewComponent,
    StreamDslComponent,
    TruncatePipe,
    TruncatorComponent,
    TruncatorWidthProviderDirective,
    OrderByPipe,
    ConfirmComponent,
    LoaderComponent,
    PagerComponent,
    LayoutTypeDirective,
    FocusDirective,
    TippyDirective,
    KvRichTextComponent,
    BlockerComponent,
    HttpLoaderComponent,
    DATAFLOW_LIST,
    DATAFLOW_PAGE,
    TippyDirective
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
    RoutingStateService,
    NotificationService,
    LoggerService,
    GroupRouteService,
    HttpLoaderService,
    DocService,
    BlockerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpLoaderInterceptor,
      multi: true
    }
  ],
  exports: [
    StreamDslComponent,
    GrafanaModule,
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ToastrModule,
    CapitalizePipe,
    DataflowDateTimePipe,
    DataflowDurationPipe,
    SearchfilterPipe,
    ProgressbarModule,
    MasterCheckboxComponent,
    SortComponent,
    PropertiesDialogComponent,
    PropertiesGroupsDialogComponent,
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
    LayoutTypeDirective,
    FocusDirective,
    TippyDirective,
    KvRichTextComponent,
    BlockerComponent,
    HttpLoaderComponent,
    DATAFLOW_LIST,
    DATAFLOW_PAGE,
    TippyDirective
  ]
})
export class SharedModule {
}
