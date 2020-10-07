import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { RecordsComponent } from './records/records.component';
import { ImportExportComponent } from './import-export/import-export.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { StreamImportComponent } from './import-export/stream/import.component';
import { StreamExportComponent } from './import-export/stream/export.component';
import { TaskExportComponent } from './import-export/task/export.component';
import { TaskImportComponent } from './import-export/task/import.component';
import { SecurityModule } from '../security/security.module';
import { OperationFilterComponent } from './records/operation.filter';
import { ActionFilterComponent } from './records/action.filter';


@NgModule({
  declarations: [
    RecordsComponent,
    ImportExportComponent,
    StreamImportComponent,
    StreamExportComponent,
    TaskExportComponent,
    TaskImportComponent,
    OperationFilterComponent,
    ActionFilterComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClarityModule,
    SecurityModule
  ],
  providers: []
})
export class ManageModule {
}
