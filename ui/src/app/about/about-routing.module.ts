import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { AboutDetailsComponent } from './about-details.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'about', component: AboutComponent },
    { path: 'about/details', component: AboutDetailsComponent }
  ])],
  exports: [RouterModule]
})
export class AboutRoutingModule {}
