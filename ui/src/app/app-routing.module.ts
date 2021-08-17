import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DevGuard} from './shared/support/dev.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'apps'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
