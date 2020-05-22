import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { JobsComponent } from './jobs/jobs.component';
import { ExecutionsComponent } from './executions/executions.component';
import { TaskComponent } from './tasks/task/task.component';
import { LaunchComponent } from './tasks/launch/launch.component';
import { ExecutionComponent } from './executions/execution/execution.component';
import { ExecutionComponent as JobExecutionComponent } from './jobs/execution/execution.component';
import { StepComponent } from './jobs/step/step.component';
import { CreateComponent } from './tasks/create/create.component';
import { SecurityGuard } from '../security/support/security.guard';

const routes: Routes = [
  {
    path: 'tasks-jobs',
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW'],
      feature: 'tasks'
    },
    children: [
      {
        path: 'tasks',
        component: TasksComponent
      },
      {
        path: 'tasks/create',
        component: CreateComponent
      },
      {
        path: 'tasks/:name',
        component: TaskComponent
      },
      {
        path: 'tasks/:name/launch',
        component: LaunchComponent
      },
      {
        path: 'task-executions',
        component: ExecutionsComponent
      },
      {
        path: 'task-executions/:executionId',
        component: ExecutionComponent
      },
      {
        path: 'job-executions',
        component: JobsComponent
      },
      {
        path: 'job-executions/:executionId',
        component: JobExecutionComponent
      },
      {
        path: 'job-executions/:executionId/:stepId',
        component: StepComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksJobsRoutingModule {
}
