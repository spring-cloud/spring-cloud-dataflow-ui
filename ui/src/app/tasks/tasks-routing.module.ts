import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksComponent } from './tasks.component';
import { TaskAppsComponent } from './task-apps/task-apps.component';
import { TaskDefinitionsComponent } from './task-definitions/task-definitions.component';
import { TaskCreateComposedTaskComponent } from './task-create-composed-task/task-create-composed-task.component';
import { TaskExecutionsComponent } from './task-executions/task-executions.component';
import { TaskExecutionsDetailsComponent } from './task-details/task-details.component';
import { TaskAppDetailsComponent } from './task-app-details/task-app-details.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskBulkDefineComponent } from './task-bulk-define/task-bulk-define.component';
import { TaskLaunchComponent } from './task-launch/task-launch.component';
import { AuthGuard } from '../auth/support/auth.guard';
import { ComposedTaskDetailsComponent } from './composed-task-details/composed-task-details.component';

const taskRoutes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
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
          redirectTo: 'definitions'
      },
      {
          path: 'apps',
          component: TaskAppsComponent,
      },
      {
          path: 'apps/:id',
          component: TaskAppDetailsComponent,
      },
      {
          path: 'apps/:id/task-create',
          component: TaskCreateComponent,
          canActivate: [AuthGuard],
          data: {
            authenticate: true,
            roles: ['ROLE_CREATE']
          },
      },
      {
          path: 'executions',
          component: TaskExecutionsComponent,
      },
      {
          path: 'executions/:id',
          component: TaskExecutionsDetailsComponent,
      },
      {
          path: 'create-composed-task',
          component: TaskCreateComposedTaskComponent
      },
      {
        path: 'bulk-define-tasks',
        component: TaskBulkDefineComponent,
      },
      {
        path: 'definitions',
        component: TaskDefinitionsComponent,
      },
      {
        path: 'definitions/launch/:id',
        component: TaskLaunchComponent,
      },
      {
        path: 'definitions/:id',
        component: ComposedTaskDetailsComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(taskRoutes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
