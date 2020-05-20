import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoComponent } from './info/info.component';
import { SecurityGuard } from '../security/support/security.guard';


const routes: Routes = [
  {
    path: 'about',
    component: InfoComponent,
    canActivate: [SecurityGuard],
    data: {
      authenticate: true,
      roles: ['ROLE_VIEW'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule {
}
