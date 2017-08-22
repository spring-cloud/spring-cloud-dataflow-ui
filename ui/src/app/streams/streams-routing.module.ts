import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamDetailsComponent } from './stream-details/stream-details.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { StreamDeployComponent } from './stream-deploy/stream-deploy.component';

const streamRoutes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
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
        component: StreamDefinitionsComponent,
      },
      {
        path: 'definitions/:id',
        component: StreamDetailsComponent,
      },
      {
        path: 'definitions/:id/deploy',
        component: StreamDeployComponent,
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
export class StreamsRoutingModule {}
