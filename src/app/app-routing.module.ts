import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppsComponent } from './apps/apps.component'
import { RuntimeComponent } from './runtime/runtime.component'
import { StreamsComponent } from './streams/streams.component'
import { TasksComponent } from './tasks/tasks.component'
import { JobsComponent } from './jobs/jobs.component'
import { AnalyticsComponent } from './analytics/analytics.component'
import { AboutComponent } from './about/about.component';

import { StreamDefinitionsComponent } from './streams/stream-definitions/stream-definitions.component'
import { StreamCreateComponent } from './streams/stream-create/stream-create.component'

const routes: Routes = [
  {
    path: 'apps',
    component: AppsComponent
  },
  {
    path: 'runtime',
    component: RuntimeComponent
  },
  {
    path: 'streams',
    component: StreamsComponent,
    children: [
      {
          path: '',
          pathMatch: 'full',
          redirectTo: 'definitions'
      },
      {
        path: 'definitions',
        component: StreamDefinitionsComponent
      },
      {
        path: 'create',
        component: StreamCreateComponent
      }
    ]
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'jobs',
    component: TasksComponent
  },
  {
    path: 'analytics',
    component: AnalyticsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  }
  // {
  //   path: '',
  //   children: []
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
