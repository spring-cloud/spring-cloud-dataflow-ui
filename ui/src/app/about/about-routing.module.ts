import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about.component';
import { AboutDetailsComponent } from './about-details.component';
import { AuthGuard } from '../auth/support/auth.guard';

const aboutRoutes: Routes = [
  {
    path: 'about',
    canActivate: [AuthGuard],
    data: {
      authenticate: true
    },
    children: [
      { path: '', component: AboutComponent },
      { path: 'details', component: AboutDetailsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(aboutRoutes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
