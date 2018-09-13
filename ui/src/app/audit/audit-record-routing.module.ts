import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditRecordComponent } from './audit-record/audit-record.component';
import { AuditRecordDetailsComponent } from './audit-record-details/audit-record-details.component';
import { AuthGuard } from '../auth/support/auth.guard';

const appsRoutes: Routes = [
  {
    path: 'audit-records',
    canActivate: [AuthGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
    children: [
      {
        path: '',
        component: AuditRecordComponent,
      },
      {
        path: ':auditRecordId',
        component: AuditRecordDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appsRoutes)],
  exports: [RouterModule]
})
export class AuditRecordRoutingModule {
}
