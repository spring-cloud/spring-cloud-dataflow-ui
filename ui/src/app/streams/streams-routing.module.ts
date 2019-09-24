import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreamsComponent } from './streams/streams.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { StreamDeployComponent } from './stream-deploy/stream-deploy.component';
import { AuthGuard } from '../auth/support/auth.guard';
import { StreamComponent } from './stream/stream.component';
import { StreamGraphComponent } from './stream/graph/stream-graph.component';
import { StreamSummaryComponent } from './stream/summary/stream-summary.component';
import { StreamHistoryComponent } from './stream/history/stream-history.component';
import { StreamsUtilsComponent } from './streams-utils/streams-utils.component';
import { StreamsExportComponent } from './streams-utils/streams-export/streams-export.component';
import { StreamsImportComponent } from './streams-utils/streams-import/streams-import.component';

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
        pathMatch: 'full',
        redirectTo: 'definitions'
      },
      {
        path: 'definitions',
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
          },
          {
            path: 'history',
            component: StreamHistoryComponent,
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
      },
      {
        path: 'utils',
        component: StreamsUtilsComponent,
        children: [
          {
            path: 'export',
            component: StreamsExportComponent
          },
          {
            path: 'import',
            component: StreamsImportComponent
          },
        ]
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
