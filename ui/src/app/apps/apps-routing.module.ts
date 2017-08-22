import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';
import { AppsRegisterComponent } from './apps-register/apps-register.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AuthGuard } from '../auth/support/auth.guard';

const appsRoutes: Routes = [
  {
    path: 'apps',
    component: AppsComponent,
    canActivate: [AuthGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW'],
      feature: 'appsEnabled'
    }
  },
  { path: 'apps/bulk-import-apps', component: AppsBulkImportComponent },
  { path: 'apps/register-apps', component: AppsRegisterComponent },
  { path: 'apps/:appType/:appName', component: AppDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(appsRoutes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {}
