import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ManageRoutingModule} from './manage-routing.module';
import {RecordsComponent} from './records/records.component';
import {ToolsComponent} from './tools/tools.component';
import {ClarityModule} from '@clr/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {StreamImportComponent} from './tools/stream/import.component';
import {StreamExportComponent} from './tools/stream/export.component';
import {TaskExportComponent} from './tools/task/export.component';
import {TaskImportComponent} from './tools/task/import.component';
import {SecurityModule} from '../security/security.module';
import {OperationFilterComponent} from './records/operation.filter';
import {ActionFilterComponent} from './records/action.filter';
import {CleanupComponent} from './tools/cleanup/cleanup.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    RecordsComponent,
    ToolsComponent,
    StreamImportComponent,
    StreamExportComponent,
    TaskExportComponent,
    TaskImportComponent,
    OperationFilterComponent,
    ActionFilterComponent,
    CleanupComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClarityModule,
    SecurityModule,
    TranslateModule
  ],
  providers: []
})
export class ManageModule {}
