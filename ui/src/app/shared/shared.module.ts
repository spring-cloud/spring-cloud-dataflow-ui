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
  GrafanaRuntimeAppDirective, GrafanaRuntimeInstanceDirective,
  GrafanaStreamDirective,
  GrafanaStreamsDirective,
  GrafanaTaskDirective,
  GrafanaTasksDirective
} from './grafana/grafana.directive';

@NgModule({
  entryComponents: [
    ToastComponent
  ],
  declarations: [
    KeyValueComponent,
    DatetimePipe,
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
  ],
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      tapToDismiss: false,
      preventDuplicates: false,
      maxOpened: 6,
      enableHtml: true,
      closeButton: true,
      toastComponent: ToastComponent
    })
  ],
  exports: [
    KeyValueComponent,
    ConfirmComponent,
    DatetimePipe,
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
  ]
})
export class SharedModule {
}
