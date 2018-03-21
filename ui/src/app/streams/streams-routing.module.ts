import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StreamsComponent} from './streams/streams.component';
import {StreamCreateComponent} from './stream-create/stream-create.component';
import {StreamDeployComponent} from './stream-deploy/stream-deploy.component';
import {AuthGuard} from '../auth/support/auth.guard';
import {StreamComponent} from './stream/stream.component';
import {StreamGraphComponent} from './stream/graph/stream-graph.component';
import {StreamSummaryComponent} from './stream/summary/stream-summary.component';

const streamRoutes: Routes = [
  {
    path: 'streams',
    canActivate: [AuthGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW'],
      feature: 'streamsEnabled'
    },
    children: [
      {
        path: '',
        component: StreamsComponent,
      },
      {
        path: 'definitions/:id',
        component: StreamComponent,
        children: [
          {
            path: '',
            redirectTo: 'summary',
            pathMatch: 'full'
          },
          {
            path: 'graph',
            component: StreamGraphComponent,
          },
          {
            path: 'summary',
            component: StreamSummaryComponent,
          }
        ]
      },
      {
        path: 'definitions/:id/deploy',
        component: StreamDeployComponent,
        canActivate: [AuthGuard],
        data: {
          authenticate: true,
          roles: ['ROLE_CREATE']
        },
      },
      {
        path: 'create',
        component: StreamCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(streamRoutes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {
}
