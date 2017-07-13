import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StreamsService } from './streams.service';
import { StreamsRoutingModule } from './streams-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamDetailsComponent } from './stream-details/stream-details.component';
import { StreamDeployComponent } from './stream-deploy/stream-deploy.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { AlertModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    StreamsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  declarations: [
    StreamsComponent,
    StreamCreateComponent,
    StreamDefinitionsComponent,
    StreamDetailsComponent,
    StreamDeployComponent
  ],
  providers: [ StreamsService ]
})
export class StreamsModule { }
