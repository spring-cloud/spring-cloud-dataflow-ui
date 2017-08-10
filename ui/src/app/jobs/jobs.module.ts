import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { JobsComponent } from './jobs.component';
import { JobsService } from './jobs.service';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobExecutionStatusComponent } from './components/job-execution-status.component';
import { DeploymentStatusComponent } from './components/deployment-status.component';

@NgModule({
  imports:      [ JobsRoutingModule, SharedModule ],
  declarations: [ JobsComponent, JobExecutionStatusComponent, DeploymentStatusComponent ],
  providers:    [ JobsService ]
})
export class JobsModule { }
