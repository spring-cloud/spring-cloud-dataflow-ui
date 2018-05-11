import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JobsComponent } from './jobs/jobs.component';
import { JobExecutionDetailsComponent } from './job-execution-details/job-execution-details.component';
import { StepExecutionDetailsComponent } from './step-execution-details/step-execution-details.component';
import { StepExecutionProgressComponent } from './step-execution-progress/step-execution-progress.component';
import { AuthGuard } from '../auth/support/auth.guard';

/**
 * Jobs Module Routing.
 *
 * @author Gunnar Hillert
 */
@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'jobs',
      canActivate: [AuthGuard],
      data: {
        authenticate: true,
        roles: ['ROLE_VIEW'],
        feature: 'tasksEnabled'
      },
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'executions'
        },
        {
          path: 'executions',
          component: JobsComponent
        },
        {
          path: 'executions/:id',
          component: JobExecutionDetailsComponent
        },
        {
          path: 'executions/:jobid/:stepid',
          component: StepExecutionDetailsComponent
        },
        {
          path: 'executions/:jobid/:stepid/progress',
          component: StepExecutionProgressComponent
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class JobsRoutingModule {
}
