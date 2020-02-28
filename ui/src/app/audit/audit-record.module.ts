import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AuditRecordComponent } from './audit-record/audit-record.component';
import { AuditRecordDetailsComponent } from './audit-record-details/audit-record-details.component';
import { AuditRecordService } from './audit-record.service';
import { AuditRecordRoutingModule } from './audit-record-routing.module';
import {
  AlertModule,
  BsDropdownModule,
  ModalModule,
  PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuditRecordListBarComponent } from './components/audit-record-list-bar/audit-record-list-bar.component';
import { AuditRecordActionComponent } from './components/audit-record-action/audit-record-action.component';
import { AuditRecordOperationComponent } from 'src/app/audit/components/audit-record-operation/audit-record-operation.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    AuditRecordRoutingModule,
    SharedModule,
    AuthModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    AuditRecordListBarComponent,
    AuditRecordComponent,
    AuditRecordDetailsComponent,
    AuditRecordActionComponent,
    AuditRecordOperationComponent
  ],
  entryComponents: [],
  providers: [
    AuditRecordService,
  ],
  exports: []
})
export class AuditRecordModule {
}
