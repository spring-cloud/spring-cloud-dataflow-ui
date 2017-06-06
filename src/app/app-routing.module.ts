import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { StreamsComponent } from './streams/streams.component'
import { StreamDefinitionsComponent } from './stream-definitions/stream-definitions.component'
import { StreamCreateComponent } from './stream-create/stream-create.component'

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'streams',
    component: StreamsComponent,
    children: [
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
