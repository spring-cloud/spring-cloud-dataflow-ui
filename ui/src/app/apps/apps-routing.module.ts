import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppsComponent } from './apps.component';
import { AppComponent } from './app/app.component';
import { AddComponent } from './add/add.component';
import { SecurityGuard } from '../security/support/security.guard';

const routes: Routes = [
  {
    path: 'apps',
    component: AppsComponent,
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
  },
  {
    path: 'apps/:appType/:appName',
    component: AppComponent,
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
  },
  {
    path: 'apps/add',
    component: AddComponent,
    data: {
      authenticate: true,
      roles: ['ROLE_CREATE']
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppsRoutingModule {
}
