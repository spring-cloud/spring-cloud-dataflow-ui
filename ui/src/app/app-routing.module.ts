import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'apps'
  },
  // {
  //   path: 'streams',
  //   loadChildren: () => import('./streams/streams.module').then(m => m.StreamsModule)
  // },
  // {
  //   path: 'manage',
  //   loadChildren: () => import('./manage/manage.module').then(m => m.ManageModule)
  // },
  // {
  //   path: 'tasks-jobs',
  //   loadChildren: () => import('./tasks-jobs/tasks-jobs.module').then(m => m.TasksJobsModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
