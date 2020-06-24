import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevGuard } from './shared/support/dev.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'apps'
  },
  {
    path: 'dev',
    loadChildren: () => import('./dev/dev.module').then(m => m.DevModule),
    canLoad: [DevGuard]
  },
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
