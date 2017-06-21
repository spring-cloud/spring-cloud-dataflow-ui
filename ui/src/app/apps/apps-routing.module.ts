import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'apps', component: AppsComponent },
    { path: 'apps/bulk-import-apps', component: AppsBulkImportComponent }
  ])],
  exports: [RouterModule]
})
export class AppsRoutingModule {}
