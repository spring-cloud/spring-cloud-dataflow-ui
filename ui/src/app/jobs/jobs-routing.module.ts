import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobsComponent } from './jobs.component';
import { JobExecutionDetailsComponent } from './job-execution-details/job-execution-details.component';
import { StepExecutionDetailsComponent } from './step-execution-details/step-execution-details.component';
import { StepExecutionProgressComponent } from './step-execution-progress/step-execution-progress.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'jobs',
      pathMatch: 'full',
      redirectTo: 'jobs/executions'
    },
    { path: 'jobs/executions', component: JobsComponent },
    { path: 'jobs/executions/:id', component: JobExecutionDetailsComponent },
    { path: 'jobs/executions/:jobid/:stepid', component: StepExecutionDetailsComponent },
    { path: 'jobs/executions/:jobid/:stepid/progress', component: StepExecutionProgressComponent }
  ])],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
