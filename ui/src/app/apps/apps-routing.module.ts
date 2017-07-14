import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';

const appsRoutes: Routes = [
  { path: 'apps', component: AppsComponent },
  { path: 'apps/bulk-import-apps', component: AppsBulkImportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(appsRoutes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {}
