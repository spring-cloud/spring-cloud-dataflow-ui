import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamDetailsComponent } from './stream-details/stream-details.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { StreamDeployComponent } from './stream-deploy/stream-deploy.component';

@NgModule({
  imports: [RouterModule.forChild([
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
  ])],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}
