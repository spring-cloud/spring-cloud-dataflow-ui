import {NgModule} from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { AppsComponent } from './apps.component';
import { AppsBulkImportComponent } from './apps-bulk-import.component';
import { AppsRegisterComponent } from './apps-register/apps-register.component';
import { AppDetailsComponent } from './app-details/app-details.component';

import { AppsService } from './apps.service';
import { AppsRoutingModule } from './apps-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';

import { SearchfilterPipe } from '../shared/pipes/search-filter.pipe';
import { ClickOutsideDirective } from '../shared/directives/click-outside.directive'
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../shared/custom-route-reuse-strategy';

import { AlertModule, ModalModule, PopoverModule } from 'ngx-bootstrap';

@NgModule({
  imports:      [
    AppsRoutingModule, SharedModule, NgxPaginationModule,
    AlertModule.forRoot(), ModalModule.forRoot(), PopoverModule.forRoot()
  ],
  declarations: [
    AppsComponent, AppsBulkImportComponent, AppsRegisterComponent, AppDetailsComponent,
    SearchfilterPipe, ClickOutsideDirective ],
  ],
  providers:    [
    AppsService
  ]
})
export class AppsModule { }
