import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsComponent } from './tools/tools.component';
import { RecordsComponent } from './records/records.component';
import { SecurityGuard } from '../security/support/security.guard';

const routes: Routes = [
  {
    path: 'manage',
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
    children: [
      {
        path: 'tools',
        component: ToolsComponent,
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE'],
        },
      },
      {
        path: 'records',
        component: RecordsComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule {
}
