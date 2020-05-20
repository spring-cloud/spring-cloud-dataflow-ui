import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppsComponent } from './apps/apps.component';
import { ImportExportComponent } from './import-export/import-export.component';
import { RecordsComponent } from './records/records.component';
import { AppComponent } from './apps/app/app.component';
import { AddComponent } from './apps/add/add.component';
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
        path: 'apps',
        component: AppsComponent,
      },
      {
        path: 'apps/:appType/:appName',
        component: AppComponent,
      },
      {
        path: 'apps/add',
        component: AddComponent,
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
      },
      {
        path: 'import-export',
        component: ImportExportComponent,
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
