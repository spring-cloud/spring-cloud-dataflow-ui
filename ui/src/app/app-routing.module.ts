import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DevGuard} from './shared/support/dev.guard';
import {UrlUtilities} from "./url-utilities.service";

const routes: Routes = [
  {
    path: UrlUtilities.calculateBaseApiUrl(),
    pathMatch: 'full',
    redirectTo: 'apps'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, relativeLinkResolution: 'legacy'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
