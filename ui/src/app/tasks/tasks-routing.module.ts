import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskExecutionsComponent } from './task-executions/task-executions.component';
import { TaskLaunchComponent } from './task-launch/task-launch.component';
import { AuthGuard } from '../auth/support/auth.guard';
import { TaskExecutionComponent } from './task-execution/task-execution.component';
import { TasksComponent } from './tasks/tasks.components';
import { TaskDefinitionCreateComponent } from './task-definition-create/task-definition-create.component';
import { TaskDefinitionComponent } from './task-definition/task-definition.component';
import { TaskDefinitionsComponent } from './task-definitions/task-definitions.component';
import { TaskGraphComponent } from './task-definition/graph/task-graph.component';
import { TaskSummaryComponent } from './task-definition/summary/task-summary.component';

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
        path: 'executions',
        component: TaskExecutionsComponent,
      },
      {
        path: 'executions/:id',
        component: TaskExecutionComponent,
      },
      {
        path: 'create',
        component: TaskDefinitionCreateComponent
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
        component: TaskDefinitionComponent,
        children: [
          {
            path: '',
            redirectTo: 'summary',
            pathMatch: 'full'
          },
          {
            path: 'graph',
            component: TaskGraphComponent,
          },
          {
            path: 'summary',
            component: TaskSummaryComponent,
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(taskRoutes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {
}
