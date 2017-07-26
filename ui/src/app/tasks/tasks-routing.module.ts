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

const taskRoutes: Routes = [
  {
    path: 'tasks',
    component: TasksComponent,
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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(taskRoutes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
