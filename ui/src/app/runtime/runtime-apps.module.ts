import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RuntimeAppsComponent } from './runtime-apps/runtime-apps.component';
import { RuntimeAppsService } from './runtime-apps.service';
import { RuntimeAppsRoutingModule } from './runtime-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap';
import { RuntimeAppComponent } from './runtime-app/runtime-app.component';
import { RuntimeAppStateComponent } from './components/runtime-app-state/runtime-app-state.component';

@NgModule({
  imports: [
    RuntimeAppsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ModalModule.forRoot()
  ],
  declarations: [
    RuntimeAppsComponent,
    RuntimeAppComponent,
    RuntimeAppStateComponent
  ],
  entryComponents: [
    RuntimeAppComponent
  ],
  providers: [
    RuntimeAppsService
  ]
})
export class RuntimeAppsModule {
}
