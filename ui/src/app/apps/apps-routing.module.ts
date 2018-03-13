import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AppsComponent} from './apps/apps.component';
import {AppsBulkImportComponent} from './apps-bulk-import/apps-bulk-import.component';
import {AppsRegisterComponent} from './apps-register/apps-register.component';
import {AppDetailsComponent} from './app-details/app-details.component';
import {AuthGuard} from '../auth/support/auth.guard';
import {AppsBulkImportUriComponent} from './apps-bulk-import/uri/apps-bulk-import-uri.component';
import {AppsBulkImportPropertiesComponent} from './apps-bulk-import/properties/apps-bulk-import-properties.component';


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
        path: 'bulk-import-apps',
        component: AppsBulkImportComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
        children: [
          {
            path: '',
            redirectTo: 'uri',
            pathMatch: 'full'
          },
          {
            path: 'uri',
            component: AppsBulkImportUriComponent
          },
          {
            path: 'properties',
            component: AppsBulkImportPropertiesComponent
          }
        ]
      },
      {
        path: 'register-apps', component: AppsRegisterComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
      },
      {
        path: ':appType/:appName',
        component: AppDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appsRoutes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {
}
