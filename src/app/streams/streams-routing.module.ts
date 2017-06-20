import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StreamsComponent } from './streams.component';
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component';
import { StreamCreateComponent } from './stream-create/stream-create.component';

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
        component: StreamDefinitionsComponent
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
