import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from '../auth/support/auth.guard';

const aboutRoutes: Routes = [
  {
    path: 'about',
    canActivate: [AuthGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW']
    },
    children: [
      {
        path: '',
        component: AboutComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(aboutRoutes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {
}
