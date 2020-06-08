import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RuntimeComponent } from './runtime/runtime.component';
import { StreamsComponent } from './streams/streams.component';
import { StreamComponent } from './streams/stream/stream.component';
import { CreateComponent } from './streams/create/create.component';
import { DeployComponent } from './streams/deploy/deploy.component';
import { SecurityGuard } from '../security/support/security.guard';
import { MultiDeployComponent } from './streams/multi-deploy/multi-deploy.component';

const routes: Routes = [
  {
    path: 'streams',
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW'],
      feature: 'streams'
    },
    children: [
      {
        path: 'list',
        component: StreamsComponent,
      },
      {
        path: 'list/create',
        component: CreateComponent,
      },
      {
        path: 'list/:name',
        component: StreamComponent,
      },
      {
        path: 'list/:name/deploy',
        component: DeployComponent,
      },
      {
        path: 'list/:group/multi-deploy',
        component: MultiDeployComponent,
      },
      {
        path: 'runtime',
        component: RuntimeComponent,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {
}
