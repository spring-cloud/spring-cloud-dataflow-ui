import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { StreamsService } from './streams.service';
import { StreamsRoutingModule } from './streams-routing.module';

import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';

@NgModule({
  imports: [
    StreamsRoutingModule,
    SharedModule
  ],
  declarations: [
    StreamsComponent,
    StreamCreateComponent,
    StreamDefinitionsComponent
  ],
  providers: [ StreamsService ]
})
export class StreamsModule { }
