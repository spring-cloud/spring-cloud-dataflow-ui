import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AppsComponent} from './apps/apps.component';
import {AppsBulkImportComponent} from './apps-bulk-import/apps-bulk-import.component';
import {AppsRegisterComponent} from './apps-register/apps-register.component';
import {AppDetailsComponent} from './app-details/app-details.component';
import {AuthGuard} from '../auth/support/auth.guard';


const appsRoutes: Routes = [
  {
    path: 'apps',
    canActivate: [AuthGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
    children: [
      {
        path: '',
        component: AppsComponent,
      },
      {
        path: ':appType/:appName',
        component: AppDetailsComponent
      },
      {
        path: 'bulk-import-apps', component: AppsBulkImportComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
      },
      {
        path: 'register-apps', component: AppsRegisterComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appsRoutes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {
}
