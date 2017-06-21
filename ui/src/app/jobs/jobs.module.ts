import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { JobsRoutingModule } from './jobs-routing.module';

@NgModule({
  imports:      [ JobsRoutingModule, SharedModule ],
  declarations: [ JobsComponent ],
  providers:    [ JobsService ]
})
export class JobsModule { }
