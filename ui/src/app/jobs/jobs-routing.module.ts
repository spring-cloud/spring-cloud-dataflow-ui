import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JobsComponent } from './jobs.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'jobs',
      pathMatch: 'full',
      redirectTo: 'jobs/executions'
    },
    { path: 'jobs/executions', component: JobsComponent }
  ])],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
