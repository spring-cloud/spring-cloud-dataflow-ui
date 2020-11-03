import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { KeyValueComponent } from './component/key-value/key-value.component';
import { DatetimePipe } from './pipe/datetime.pipe';
import { OrderByPipe } from './pipe/order-by.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DurationPipe } from './pipe/duration.pipe';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { ToastrModule } from 'ngx-toastr';
import { ToastComponent } from './component/toast/toast.component';
import { SearchComponent } from './component/search/search.component';
import { RouterModule } from '@angular/router';
import { FocusDirective } from './directive/focus.directive';
import { AutoResizeDirective } from './directive/auto-resize.directive';
import { CommonModule } from '@angular/common';
import { CardComponent } from './component/card/card.component';
import {
  GrafanaJobExecutionDirective,
  GrafanaRuntimeAppDirective, GrafanaRuntimeInstanceDirective,
  GrafanaStreamDirective,
  GrafanaStreamsDirective,
  GrafanaTaskDirective, GrafanaTaskExecutionDirective,
  GrafanaTasksDirective
} from './grafana/grafana.directive';
import { TippyDirective } from './directive/tippy.directive';
import { CapitalizePipe } from './pipe/capitalize.pipe';
import { LocalStorageModule } from 'angular-2-local-storage';
import { StreamDslComponent } from './component/stream-dsl/stream-dsl.component';
import {
  WavefrontRuntimeAppDirective, WavefrontRuntimeInstanceDirective,
  WavefrontStreamDirective,
  WavefrontStreamsDirective, WavefrontTaskDirective, WavefrontTaskExecutionDirective,
  WavefrontTasksDirective
} from './wavefront/wavefront.directive';
import { StoreModule } from '@ngrx/store';
import * as fromContext from './store/context.reducer';
import { DateFilterComponent } from './filter/date/date.filter';
import { DatagridColumnPipe } from './pipe/datagrid-column.pipe';

@NgModule({
  entryComponents: [
    ToastComponent
  ],
  declarations: [
    KeyValueComponent,
    DatetimePipe,
    CapitalizePipe,
    OrderByPipe,
    DurationPipe,
    ConfirmComponent,
    ToastComponent,
    ToastComponent,
    SearchComponent,
    FocusDirective,
    AutoResizeDirective,
    CardComponent,
    GrafanaStreamDirective,
    GrafanaStreamsDirective,
    GrafanaTasksDirective,
    GrafanaTaskDirective,
    GrafanaRuntimeAppDirective,
    GrafanaRuntimeInstanceDirective,
    GrafanaTaskExecutionDirective,
    GrafanaJobExecutionDirective,
    WavefrontStreamsDirective,
    WavefrontStreamDirective,
    WavefrontTasksDirective,
    WavefrontTaskDirective,
    WavefrontRuntimeAppDirective,
    WavefrontRuntimeInstanceDirective,
    WavefrontTaskExecutionDirective,
    TippyDirective,
    StreamDslComponent,
    DateFilterComponent,
    DatagridColumnPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(fromContext.contextFeatureKey, fromContext.reducer),
    ToastrModule.forRoot({
      timeOut: 4000,
      tapToDismiss: false,
      preventDuplicates: false,
      maxOpened: 6,
      enableHtml: true,
      closeButton: true,
      toastComponent: ToastComponent
    }),
    LocalStorageModule.forRoot({
      prefix: 'dataflow-',
      storageType: 'localStorage'
    })
  ],
  exports: [
    KeyValueComponent,
    ConfirmComponent,
    DatetimePipe,
    CapitalizePipe,
    OrderByPipe,
    DurationPipe,
    SearchComponent,
    FocusDirective,
    AutoResizeDirective,
    CardComponent,
    GrafanaStreamDirective,
    GrafanaStreamsDirective,
    GrafanaTasksDirective,
    GrafanaTaskDirective,
    GrafanaRuntimeAppDirective,
    GrafanaRuntimeInstanceDirective,
    GrafanaTaskExecutionDirective,
    GrafanaJobExecutionDirective,
    WavefrontStreamsDirective,
    WavefrontStreamDirective,
    WavefrontTasksDirective,
    WavefrontTaskDirective,
    WavefrontRuntimeAppDirective,
    WavefrontRuntimeInstanceDirective,
    WavefrontTaskExecutionDirective,
    TippyDirective,
    StreamDslComponent,
    DateFilterComponent,
    DatagridColumnPipe
  ]
})
export class SharedModule {
}
