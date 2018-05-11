import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { JobsComponent } from './jobs/jobs.component';
import { JobsService } from './jobs.service';
import { JobsRoutingModule } from './jobs-routing.module';
import { JobExecutionStatusComponent } from './components/job-execution-status.component';
import { DefinitionStatusComponent } from './components/definition-status.component';
import { JobExecutionDetailsComponent } from './job-execution-details/job-execution-details.component';
import { StepExecutionDetailsComponent } from './step-execution-details/step-execution-details.component';
import { StepExecutionProgressComponent } from './step-execution-progress/step-execution-progress.component';

/**
 * Jobs Module.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 */
@NgModule({
  imports: [
    JobsRoutingModule,
    SharedModule
  ],
  declarations: [
    JobsComponent,
    JobExecutionStatusComponent,
    DefinitionStatusComponent,
    JobExecutionDetailsComponent,
    StepExecutionDetailsComponent,
    StepExecutionProgressComponent
  ],
  providers: [
    JobsService
  ]
})
export class JobsModule {
}
