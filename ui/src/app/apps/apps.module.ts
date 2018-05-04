import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AppsComponent } from './apps/apps.component';
import { AppDetailsComponent } from './app-details/app-details.component';
import { AppsService } from './apps.service';
import { AppsRoutingModule } from './apps-routing.module';
import { AlertModule, BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AuthModule } from '../auth/auth.module';
import { AppsUnregisterComponent } from './apps-unregister/apps-unregister.component';
import { AppTypeComponent } from './components/app-type/app-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppVersionLabelComponent } from './components/app-versions-label/app-versions-label.component';
import { AppVersionsComponent } from './app-versions/app-versions.component';
import { AppsWorkaroundService } from './apps.workaround.service';
import { AppListBarComponent } from './components/app-list-bar/app-list-bar.component';
import { AppsBulkImportPropertiesComponent } from './apps-add/properties/apps-bulk-import-properties.component';
import { AppsBulkImportUriComponent } from './apps-add/uri/apps-bulk-import-uri.component';
import { AppsAddComponent } from './apps-add/apps-add.component';
import { AppsRegisterComponent } from './apps-add/register/apps-register.component';

@NgModule({
  imports: [
    AppsRoutingModule,
    SharedModule,
    AuthModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [
    AppsComponent,
    AppsAddComponent,
    AppsRegisterComponent,
    AppDetailsComponent,
    AppsUnregisterComponent,
    AppTypeComponent,
    AppVersionLabelComponent,
    AppVersionsComponent,
    AppsBulkImportPropertiesComponent,
    AppsBulkImportUriComponent,
    AppListBarComponent
  ],
  entryComponents: [
    AppsUnregisterComponent,
    AppDetailsComponent,
    AppVersionsComponent
  ],
  providers: [
    AppsService,
    AppsWorkaroundService
  ],
  exports: [
    AppTypeComponent,
    AppVersionLabelComponent
  ]
})
export class AppsModule {
}
