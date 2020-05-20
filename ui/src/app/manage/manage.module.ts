import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { AppsComponent } from './apps/apps.component';
import { RecordsComponent } from './records/records.component';
import { ImportExportComponent } from './import-export/import-export.component';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeFilterComponent } from './apps/type.filter';
import { AppComponent } from './apps/app/app.component';
import { UnregisterComponent } from './apps/unregister/unregister.component';
import { ActionFilterComponent } from './records/action.filter';
import { OperationFilterComponent } from './records/operation.filter';
import { DateFilterComponent } from './records/date.filter';
import { SharedModule } from '../shared/shared.module';
import { AddComponent } from './apps/add/add.component';
import { WebsiteStartersComponent } from './apps/add/website-starters/website-starters.component';
import { RegisterComponent } from './apps/add/register/register.component';
import { UriComponent } from './apps/add/uri/uri.component';
import { PropsComponent } from './apps/add/props/props.component';
import { StreamImportComponent } from './import-export/stream/import.component';
import { StreamExportComponent } from './import-export/stream/export.component';
import { TaskExportComponent } from './import-export/task/export.component';
import { TaskImportComponent } from './import-export/task/import.component';
import { VersionComponent } from './apps/version/version.component';


@NgModule({
  declarations: [
    AppsComponent,
    RecordsComponent,
    ImportExportComponent,
    TypeFilterComponent,
    AppComponent,
    UnregisterComponent,
    ActionFilterComponent,
    OperationFilterComponent,
    DateFilterComponent,
    AddComponent,
    WebsiteStartersComponent,
    RegisterComponent,
    UriComponent,
    PropsComponent,
    StreamImportComponent,
    StreamExportComponent,
    TaskExportComponent,
    TaskImportComponent,
    VersionComponent
  ],
  imports: [
    CommonModule,
    ManageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ClarityModule
  ],
  providers: []
})
export class ManageModule {
}
