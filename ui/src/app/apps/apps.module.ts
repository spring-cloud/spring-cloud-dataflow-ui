import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';
import { AppsService } from './apps.service';
import { AppsRoutingModule } from './apps-routing.module';

import {NgxPaginationModule} from 'ngx-pagination';

import { SearchfilterPipe } from '../shared/pipes/search-filter';

import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../shared/custom-route-reuse-strategy';

@NgModule({
  imports:      [ AppsRoutingModule, SharedModule, NgxPaginationModule ],
  declarations: [ AppsComponent, AppsBulkImportComponent, SearchfilterPipe ],
  providers:    [
    AppsService,
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
})
export class AppsModule { }
