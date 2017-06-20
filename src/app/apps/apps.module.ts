import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';
import { AppsService } from './apps.service';
import { AppsRoutingModule } from './apps-routing.module';

@NgModule({
  imports:      [ AppsRoutingModule, SharedModule ],
  declarations: [ AppsComponent, AppsBulkImportComponent ],
  providers:    [ AppsService ]
})
export class AppsModule { }
