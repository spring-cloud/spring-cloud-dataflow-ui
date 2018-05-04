import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppsComponent } from './apps/apps.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AuthGuard } from '../auth/support/auth.guard';
import { AppsAddComponent } from './apps-add/apps-add.component';
import { AppsBulkImportUriComponent } from './apps-add/uri/apps-bulk-import-uri.component';
import { AppsBulkImportPropertiesComponent } from './apps-add/properties/apps-bulk-import-properties.component';
import { AppsRegisterComponent } from './apps-add/register/apps-register.component';

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
        path: 'add',
        component: AppsAddComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
        children: [
          {
            path: 'register',
            component: AppsRegisterComponent,
          },
          {
            path: 'import-from-uri',
            component: AppsBulkImportUriComponent
          },
          {
            path: 'import-from-properties',
            component: AppsBulkImportPropertiesComponent
          }
        ]
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
